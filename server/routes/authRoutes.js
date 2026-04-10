/**
 * authRoutes.js — Authentication Routes
 * Public routes: /login, /register, /logout, /forgot-password, /reset-password/:token
 * Protected: /me (requires token)
 */

const express = require("express");
const router = express.Router();
const {
  register, login, logout, getMe,
  forgotPassword, resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register — Create a new user account
router.post("/register", register);

// POST /api/auth/login — Log in and receive an HttpOnly JWT cookie
router.post("/login", login);

// POST /api/auth/logout — Clear the JWT cookie
router.post("/logout", logout);

// GET /api/auth/me — Return the current user's profile (protected)
router.get("/me", protect, getMe);

// POST /api/auth/forgot-password — Request a password reset link
router.post("/forgot-password", forgotPassword);

// POST /api/auth/reset-password/:token — Reset password with the token from email
router.post("/reset-password/:token", resetPassword);

module.exports = router;

