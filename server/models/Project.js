/**
 * Project.js — Mongoose Project Schema
 * Represents a community project/campaign on the platform.
 * Used for the Campaigns page and Admin dashboard.
 */

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    // Short, descriptive title for the project
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: 200,
    },

    // Detailed description — can be multi-paragraph
    description: {
      type: String,
      required: [true, "Description is required"],
    },

    // Short description shown on campaign cards (max 150 chars)
    shortDescription: {
      type: String,
      maxlength: 300,
    },

    // Fundraising goal in LKR
    goal: {
      type: Number,
      required: [true, "Funding goal is required"],
      min: 0,
    },

    // Amount raised so far — updated when donations are processed
    currentFunds: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Project start date (used in admin form)
    startDate: {
      type: Date,
      default: Date.now,
    },

    // Project end/deadline date
    endDate: {
      type: Date,
    },

    // Current project status
    status: {
      type: String,
      enum: ["active", "completed", "paused", "upcoming"],
      default: "active",
    },

    // Category for grouping (used in transparency charts)
    category: {
      type: String,
      enum: [
        "Water Projects",
        "Reforestation",
        "Medical Aid",
        "Education",
        "Community Development",
        "Other",
      ],
      default: "Other",
    },

    // Array of uploaded image/video URLs (stored via Multer)
    mediaUrls: [
      {
        type: String,
      },
    ],

    // Cover image for the campaign card
    coverImage: {
      type: String,
      default: "",
    },

    // Reference to the admin who created this project
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Mark as a featured/success story
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual: Calculate the percentage of goal achieved
projectSchema.virtual("percentFunded").get(function () {
  if (this.goal === 0) return 0;
  return Math.min(Math.round((this.currentFunds / this.goal) * 100), 100);
});

// Ensure virtuals are included when converting to JSON
projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Project", projectSchema);
