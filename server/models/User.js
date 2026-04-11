/**
 * User.js — Mongoose User Schema
 * Supports two roles: 'user' (default) and 'admin'.
 * Passwords are hashed with bcryptjs BEFORE saving.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Full display name of the user
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // Unique email address used for login
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },

    // Hashed password (never store plain text)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [12, "Password must be at least 12 characters"],
      // Exclude password from query results by default
      select: false,
    },

    // Role determines access level
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Optional avatar URL
    avatar: {
      type: String,
      default: "",
    },

    // Password reset token (stored as SHA-256 hash — never store raw token)
    resetPasswordToken: {
      type: String,
      default: null,
    },

    // Expiry for the reset token (10 minutes from request)
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// ─── Pre-Save Hook ───────────────────────────────────────────────────────────
// Hash the password before saving if it was modified
userSchema.pre("save", async function (next) {
  // Only hash if the password field was changed (e.g., not on profile updates)
  if (!this.isModified("password")) return next();

  // Salt rounds: 12 is a good balance of security vs. performance
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method ─────────────────────────────────────────────────────────
// Compare a candidate password with the stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
