/**
 * server.js — Togetherwise Express API Entry Point
 *
 * Security features applied:
 * - Helmet.js: Sets secure HTTP response headers
 * - CORS: Only allows requests from the React client URL
 * - cookie-parser: Parses cookies for JWT extraction
 * - express.json: Limits body size to prevent large payload attacks
 * - express-rate-limit: Prevents brute-force and spam attacks
 *
 * ⚠️ Hostinger deployment:
 *   Set NODE_ENV=production in your Hostinger environment variables.
 *   This enables: secure cookie flag (HTTPS only) and hides stack traces.
 *
 * Route structure:
 * - /api/auth       → Auth (login, register, logout, profile)
 * - /api/projects   → Project CRUD
 * - /api/donations  → Donation recording and stats
 * - /api/volunteers → Volunteer registration
 * - /api/payment    → Payment gateway scaffold
 */

require("dotenv").config(); // Load environment variables from .env first

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

// ─── Import Routes ────────────────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const donationRoutes = require("./routes/donationRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const successStoryRoutes = require("./routes/successStoryRoutes");
const messageRoutes = require("./routes/messageRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const newsRoutes = require("./routes/newsRoutes");
const studentRoutes = require("./routes/studentRoutes");

// ─── Initialize Express App ───────────────────────────────────────────────────
const app = express();

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Security Middleware ──────────────────────────────────────────────────────

// Helmet sets secure HTTP headers (prevents clickjacking, XSS, etc.)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow React client to load images
  })
);

// CORS: Only allow requests from the configured client URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allow cookies to be sent cross-origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Protect against brute-force, credential stuffing, and spam attacks.

/**
 * Auth limiter — very strict:
 * Applies to login, register, forgot-password, reset-password.
 * Max 10 requests per IP per 15 minutes.
 * Prevents password brute-force and OTP farming.
 */
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
});

/**
 * Public form limiter — moderate:
 * Applies to contact messages, newsletter subscribers, volunteer registrations, donations.
 * Max 20 requests per IP per 15 minutes.
 * Prevents spam / automated form submissions.
 */
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down and try again shortly." },
});

/**
 * General API limiter — broad:
 * Applies to all other /api/* routes (read operations, public stats, etc.).
 * Max 200 requests per IP per 15 minutes.
 * Prevents scraping and DoS.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP. Please wait and try again." },
});

// Apply general limiter to all API routes first
app.use("/api", generalLimiter);

// Then apply tighter limiters over specific route groups
app.use("/api/auth", authLimiter);
app.use("/api/messages", formLimiter);
app.use("/api/subscribers", formLimiter);
app.use("/api/volunteers", formLimiter);
app.use("/api/donations", formLimiter);

// Parse incoming JSON bodies (max 10MB for media metadata)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Parse cookies (required for reading the JWT cookie)
app.use(cookieParser());

// Static Files: Serve uploaded media files at /uploads
// Security: X-Content-Type-Options prevents browsers from MIME-sniffing and
// executing uploaded files as scripts, even if extension/content-type is wrong.
app.use("/uploads", (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Disposition", "inline"); // 'attachment' would force download instead
  next();
}, express.static(path.join(__dirname, "uploads")));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/success-stories", successStoryRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/students", studentRoutes);

// ─── Health Check Route ──────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Togetherwise API is running",
    timestamp: new Date().toISOString(),
    // NOTE: NODE_ENV is intentionally NOT exposed here — it helps attackers profile targets.
  });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
// Catches errors thrown by asyncHandler and returns consistent JSON error responses
app.use((err, req, res, next) => {
  // Use the status code set before the error, or default to 500
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  console.error(`❌ Error [${statusCode}]: ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Stack trace is ONLY included in explicit development mode.
    // If NODE_ENV is unset, missing, or anything other than 'development', it is hidden.
    // This is important: on Hostinger, set NODE_ENV=production to ensure this.
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Togetherwise API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔒 Helmet security headers: enabled`);
  console.log(`🌐 CORS allowed origin: ${process.env.CLIENT_URL}`);
});

module.exports = app;
