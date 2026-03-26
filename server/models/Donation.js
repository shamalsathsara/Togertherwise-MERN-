/**
 * Donation.js — Mongoose Donation Schema
 * Records each donation transaction with donor details.
 * Links to a Project via projectId reference.
 */

const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    // Donation amount in USD
    amount: {
      type: Number,
      required: [true, "Donation amount is required"],
      min: [1, "Minimum donation is $1"],
    },

    // ─── Donor Information ─────────────────────────────────
    donorName: {
      type: String,
      required: [true, "Donor name is required"],
      trim: true,
    },

    donorEmail: {
      type: String,
      required: [true, "Donor email is required"],
      lowercase: true,
      trim: true,
    },

    donorPhone: {
      type: String,
      default: "",
    },

    // ─── Donation Settings ─────────────────────────────────
    // One-time or recurring monthly donation
    frequency: {
      type: String,
      enum: ["one-time", "monthly"],
      default: "one-time",
    },

    // Optional: link donation to a specific project
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    // ─── Payment Information ───────────────────────────────
    // Payment processor used
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "manual", "pending"],
      default: "pending",
    },

    // Payment processor transaction ID (from Stripe/PayPal)
    transactionId: {
      type: String,
      default: "",
    },

    // Current payment status
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    // Anonymous donation flag
    isAnonymous: {
      type: Boolean,
      default: false,
    },

    // Optional message from donor
    message: {
      type: String,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donation", donationSchema);
