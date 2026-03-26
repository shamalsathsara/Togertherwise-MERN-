/**
 * authMiddleware.js — JWT Authentication Guard
 * Reads the JWT from the HttpOnly cookie named 'token'.
 * Verifies it and attaches the decoded user payload to req.user.
 * Used to protect any route that requires authentication.
 */

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

/**
 * protect — Middleware that verifies the JWT and populates req.user.
 * Must be applied to any protected route.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const protect = asyncHandler(async (req, res, next) => {
  // Get the token from the HttpOnly cookie
  const token = req.cookies?.token;

  // If no token found in cookies, reject the request
  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  try {
    // Verify the token using the secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID embedded in the JWT payload
    // Select: exclude the hashed password from the result
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("Not authorized — user no longer exists");
    }

    // Attach the user object to the request for downstream use
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized — invalid or expired token");
  }
});

module.exports = { protect };
