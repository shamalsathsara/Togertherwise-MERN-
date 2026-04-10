/**
 * authController.js — Authentication Controller
 * Handles user registration, login, logout, fetching current user,
 * forgot password, and reset password.
 *
 * Security approach:
 * - Passwords are hashed using bcrypt (in the User model pre-save hook)
 * - JWTs are issued and stored in HttpOnly cookies (not localStorage)
 *   → This protects against XSS attacks stealing tokens
 * - Cookie is marked Secure in production (HTTPS only)
 * - Cookie is SameSite=Strict to help prevent CSRF
 * - Reset tokens are generated with crypto.randomBytes and stored as SHA-256
 *   hashes — the raw token is only ever sent via email, never stored in the DB
 */

const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// ─── Email Transport ──────────────────────────────────────────────────────────
/**
 * Build a Nodemailer transporter from env vars.
 * If SMTP credentials are not set, returns null (dev console-log fallback).
 */
const buildTransporter = () => {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === "your_gmail@gmail.com") return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// ─── Helper: Generate JWT cookie ─────────────────────────────────────────────
const issueTokenCookie = (res, userId) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });

  // Parse the expiry string (e.g. "7d", "24h", "30m") into milliseconds
  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn, 10) || 7;
  const msMultiplier = unit === "h" ? 3600000 : unit === "m" ? 60000 : 86400000; // default days
  const maxAge = value * msMultiplier;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge,
  });
  return token;
};

// ─── POST /api/auth/register ──────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const email = req.body.email?.toLowerCase().trim();

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password });
  issueTokenCookie(res, user._id);

  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const email = req.body.email?.toLowerCase().trim();

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  issueTokenCookie(res, user._id);

  res.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: "Logged out successfully" });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
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

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
/**
 * Accepts an email address.
 * - Validates it matches ADMIN_RESET_EMAIL env var (the one allowed account)
 * - Generates a secure 32-byte random token
 * - Hashes the token with SHA-256 and stores it on the user with a 10-min expiry
 * - Sends the raw token in a reset link to the user's email
 * - If SMTP is not configured, logs the link to the server console (dev mode)
 *
 * Always returns { success: true } regardless of whether the email exists,
 * to prevent user enumeration.
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email?.toLowerCase().trim();

  if (!email) {
    res.status(400);
    throw new Error("Please provide an email address");
  }

  // ── Allowed email check ──────────────────────────────────────────────────
  const allowedEmail = (process.env.ADMIN_RESET_EMAIL || "").toLowerCase().trim();
  if (allowedEmail && email !== allowedEmail) {
    // Don't reveal which emails are allowed — just silently succeed
    return res.json({ success: true });
  }

  // ── Find the admin user ──────────────────────────────────────────────────
  const user = await User.findOne({ email, role: "admin" });
  if (!user) {
    // Silently succeed to avoid enumeration
    return res.json({ success: true });
  }

  // ── Generate token ───────────────────────────────────────────────────────
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save({ validateBeforeSave: false });

  // ── Build reset URL ──────────────────────────────────────────────────────
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const resetUrl = `${clientUrl}/admin/reset-password/${rawToken}`;

  // ── Send email or log to console ─────────────────────────────────────────
  const transporter = buildTransporter();

  if (!transporter) {
    // Dev mode: print link to console
    console.log("\n╔══════════════════════════════════════════════════════╗");
    console.log("║  [DEV MODE] Password Reset Link (no SMTP configured) ║");
    console.log("╠══════════════════════════════════════════════════════╣");
    console.log(`║  ${resetUrl}`);
    console.log("║  Link expires in 10 minutes.");
    console.log("╚══════════════════════════════════════════════════════╝\n");
  } else {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: "Togetherwise Admin — Password Reset Request",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f5f8f5;border-radius:16px;">
            <div style="text-align:center;margin-bottom:24px;">
              <h2 style="color:#1B3022;margin:0;font-size:24px;">Password Reset</h2>
              <p style="color:#6b7280;font-size:14px;margin-top:8px;">Togetherwise Administration Portal</p>
            </div>
            <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid rgba(27,48,34,0.08);">
              <p style="color:#374151;font-size:15px;margin-top:0;">Hi ${user.name},</p>
              <p style="color:#374151;font-size:15px;">You requested a password reset for your Togetherwise admin account. Click the button below to set a new password:</p>
              <div style="text-align:center;margin:28px 0;">
                <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#9CFC5C,#7DD940);color:#1B3022;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:100px;font-size:15px;">
                  Reset My Password
                </a>
              </div>
              <p style="color:#6b7280;font-size:13px;">This link expires in <strong>10 minutes</strong>. If you didn't request this, ignore this email — your password won't change.</p>
            </div>
            <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:20px;">
              Togetherwise · Hokandara, Sri Lanka
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      // Clean up token if email fails, and return an error
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save({ validateBeforeSave: false });
      res.status(500);
      throw new Error("Failed to send reset email. Please check your SMTP configuration.");
    }
  }

  res.json({ success: true });
});

// ─── POST /api/auth/reset-password/:token ────────────────────────────────────
/**
 * Validates the raw token from the URL, updates the password, and issues
 * a new JWT so the admin is immediately logged in.
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    res.status(400);
    throw new Error("Token and new password are required");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Hash the incoming raw token and look it up
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: new Date() }, // Not expired
  });

  if (!user) {
    res.status(400);
    throw new Error("Reset link is invalid or has expired");
  }

  // Update password and clear reset fields
  user.password = password; // pre-save hook will hash this
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();

  // Return success — user must log in manually with their new password
  res.json({
    success: true,
    message: "Password reset successfully. Please log in with your new password.",
  });
});

module.exports = { register, login, logout, getMe, forgotPassword, resetPassword };



