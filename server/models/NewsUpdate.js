/**
 * NewsUpdate.js — Mongoose News & Updates Schema
 * Stores homepage news items manageable from the admin panel.
 */

const mongoose = require("mongoose");

const newsUpdateSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "News content is required"],
      trim: true,
      maxlength: 300,
    },

    tag: {
      type: String,
      required: [true, "Tag is required"],
      trim: true,
      maxlength: 50,
    },

    // Controls the badge colour shown on the homepage
    // e.g. "complete" = lime, "in-progress" = blue, "upcoming" = orange
    status: {
      type: String,
      enum: ["complete", "in-progress", "upcoming", "paused"],
      default: "in-progress",
    },

    // Optional image URL (external link or uploaded path)
    image: {
      type: String,
      default: "",
    },

    // Controls display order — lower numbers appear first
    order: {
      type: Number,
      default: 0,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("NewsUpdate", newsUpdateSchema);
