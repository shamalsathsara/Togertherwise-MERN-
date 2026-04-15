/**
 * Volunteer.js — Mongoose Volunteer Registration Schema
 * Stores volunteer application data from the Join page registration form.
 */

const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    // ─── Personal Information ──────────────────────────────
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number is too long"],
      match: [/^\+?[\d\s\-().]{7,20}$/, "Please enter a valid phone number"],
    },

    // ─── Demographics ──────────────────────────────────────
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
      required: [true, "Gender is required"],
    },

    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },

    // ─── Address ───────────────────────────────────────────
    streetAddress: {
      type: String,
      required: [true, "Street address is required"],
    },

    city: {
      type: String,
      required: [true, "City is required"],
    },

    country: {
      type: String,
      required: [true, "Country is required"],
      default: "Sri Lanka",
    },

    // ─── Volunteer Preferences ────────────────────────────
    // Type of role the volunteer is applying for
    role: {
      type: String,
      enum: ["volunteer", "fundraiser", "partner"],
      default: "volunteer",
    },

    // Free-form text about interests and motivation
    about: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    // Application status managed by admin
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
