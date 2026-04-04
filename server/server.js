/**
 * server.js — Togetherwise Express API Entry Point
 *
 * Security features applied:
 * - Helmet.js: Sets secure HTTP response headers
 * - CORS: Only allows requests from the React client URL
 * - cookie-parser: Parses cookies for JWT extraction
 * - express.json: Limits body size to prevent large payload attacks
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

// Parse incoming JSON bodies (max 10MB for media metadata)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Parse cookies (required for reading the JWT cookie)
app.use(cookieParser());

// ─── Static Files ─────────────────────────────────────────────────────────────
// Serve uploaded media files at /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// ─── Health Check Route ───────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Togetherwise API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Catches errors thrown by asyncHandler and returns consistent JSON error responses
app.use((err, req, res, next) => {
  // Use the status code set before the error, or default to 500
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  console.error(`❌ Error [${statusCode}]: ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Include stack trace only in development (not in production for security)
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
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
