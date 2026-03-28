/**
 * authController.js — Authentication Controller
 * Handles user registration, login, logout, and fetching current user.
 *
 * Security approach:
 * - Passwords are hashed using bcrypt (in the User model pre-save hook)
 * - JWTs are issued and stored in HttpOnly cookies (not localStorage)
 *   → This protects against XSS attacks stealing tokens
 * - Cookie is marked Secure in production (HTTPS only)
 * - Cookie is SameSite=Strict to help prevent CSRF
 */

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//  Helper: Generate JWT and set as HttpOnly cookie 
/**
 * Signs a JWT for the given user ID and attaches it to the response
 * as an HttpOnly cookie named 'token'.
 *
 * @param {import('express').Response} res - Express response object
 * @param {string} userId - The MongoDB ObjectId of the user
 */
const issueTokenCookie = (res, userId) => {
  // Sign the JWT 
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  // Parse expiry into milliseconds for the cookie maxAge
  const expiryDays = parseInt(process.env.JWT_EXPIRES_IN) || 7;

  // Set the cookie
  res.cookie("token", token, {
    httpOnly: true,                               // JS cannot read this cookie (XSS protection)
    secure: process.env.NODE_ENV === "production", // Only HTTPS in production
    sameSite: "strict",                           // Prevents CSRF in most cases
    maxAge: expiryDays * 24 * 60 * 60 * 1000,    // Convert days → ms
  });

  return token;
};

// POST /api/auth/register 
/**
 * Register a new user (public — creates 'user' role by default).
 * Admin users should be created via the seed script.
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  // Check if a user already exists with this email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  // Create the new user , password is hashed by the pre-save hook in User.js
  const user = await User.create({ name, email, password });

  // Issue JWT cookie
  issueTokenCookie(res, user._id);

  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

//  POST /api/auth/login...
/**
 * Log in with email and password.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Confirm required fields
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find the user and explicitly include the password field (select: false by default)
  const user = await User.findOne({ email }).select("+password");

  // If user not found or password doesn't match, use the same error message
  // (avoids user enumeration attacks)
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Issue JWT cookie
  issueTokenCookie(res, user._id);

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// POST /api/auth/logout
/**
 * Log out by clearing the JWT cookie.
 * The cookie is overwritten with an expired one.
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Immediately expired
  });

  res.json({ success: true, message: "Logged out successfully" });
});

// GET /api/auth/me
/**
 * Return the currently authenticated user's profile.
 */
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = { register, login, logout, getMe };
