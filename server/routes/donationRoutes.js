const express = require("express");
const router = express.Router();
const { createDonation, getAllDonations, getDonationStats, deleteDonation } = require("../controllers/donationController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// POST /api/donations — Record a donation (public)
router.post("/", createDonation);

// GET /api/donations/stats — Donation statistics (public for transparency page)
router.get("/stats", getDonationStats);

// GET /api/donations — All donations list (admin only)
router.get("/", protect, adminOnly, getAllDonations);

// DELETE /api/donations/:id — Delete a donation (admin only)
router.delete("/:id", protect, adminOnly, deleteDonation);

module.exports = router;
