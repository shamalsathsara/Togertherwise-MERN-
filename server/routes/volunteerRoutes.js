const express = require("express");
const router = express.Router();
const { registerVolunteer, getAllVolunteers, updateVolunteerStatus, deleteVolunteer } = require("../controllers/volunteerController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// POST /api/volunteers — Register as a volunteer (public)
router.post("/", registerVolunteer);

// GET /api/volunteers — All applications (admin only)
router.get("/", protect, adminOnly, getAllVolunteers);

// PUT /api/volunteers/:id/status — Update application status (admin only)
router.put("/:id/status", protect, adminOnly, updateVolunteerStatus);

// DELETE /api/volunteers/:id — Remove an application (admin only)
router.delete("/:id", protect, adminOnly, deleteVolunteer);

module.exports = router;
