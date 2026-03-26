/**
 * authRoutes.js — Authentication Routes
 * Public routes: /login, /register, /logout
 * Protected: /me (requires token)
 */

const express = require("express");
const router = express.Router();
const { register, login, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register — Create a new user account
router.post("/register", register);

// POST /api/auth/login — Log in and receive an HttpOnly JWT cookie
router.post("/login", login);

// POST /api/auth/logout — Clear the JWT cookie
router.post("/logout", logout);

// GET /api/auth/me — Return the current user's profile (protected)
router.get("/me", protect, getMe);

module.exports = router;
