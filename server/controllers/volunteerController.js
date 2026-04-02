/**
 * volunteerController.js — Volunteer Registration Controller
 * Handles new volunteer applications and admin management.
 */

const asyncHandler = require("express-async-handler");
const Volunteer = require("../models/Volunteer");

// ─── POST /api/volunteers ─────────────────────────────────────────────────────
/**
 * registerVolunteer — Submit a new volunteer application (public).
 */
const registerVolunteer = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    gender,
    dateOfBirth,
    streetAddress,
    city,
    country,
    role,
    about,
  } = req.body;

  // Check if this email already has a pending/approved application
  const existing = await Volunteer.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error(
      "A volunteer application with this email already exists"
    );
  }

  const volunteer = await Volunteer.create({
    firstName,
    lastName,
    email,
    phone,
    gender,
    dateOfBirth,
    streetAddress,
    city,
    country: country || "Sri Lanka",
    role: role || "volunteer",
    about: about || "",
  });

  res.status(201).json({
    success: true,
    message: "Your volunteer application has been submitted successfully!",
    volunteer,
  });
});

// ─── GET /api/volunteers ──────────────────────────────────────────────────────
/**
 * getAllVolunteers — Returns all volunteer applications (admin only).
 */
const getAllVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await Volunteer.find().sort({ createdAt: -1 });
  res.json({ success: true, count: volunteers.length, volunteers });
});

// ─── PUT /api/volunteers/:id/status ──────────────────────────────────────────
/**
 * updateVolunteerStatus — Approve or reject an application (admin only).
 */
const updateVolunteerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const volunteer = await Volunteer.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!volunteer) {
    res.status(404);
    throw new Error("Volunteer application not found");
  }

  res.json({ success: true, volunteer });
});

// ─── DELETE /api/volunteers/:id ──────────────────────────────────────────────
/**
 * deleteVolunteer — Permanently remove an application (admin only).
 */
const deleteVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) {
    res.status(404);
    throw new Error("Volunteer application not found");
  }

  await Volunteer.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Volunteer application deleted" });
});

module.exports = { registerVolunteer, getAllVolunteers, updateVolunteerStatus, deleteVolunteer };
