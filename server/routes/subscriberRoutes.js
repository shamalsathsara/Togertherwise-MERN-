const express = require("express");
const router = express.Router();
const {
  createSubscriber,
  getAllSubscribers,
  deleteSubscriber,
} = require("../controllers/subscriberController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// POST /api/subscribers
router.post("/", createSubscriber);

// GET /api/subscribers (Admin)
router.get("/", protect, adminOnly, getAllSubscribers);

// DELETE /api/subscribers/:id (Admin)
router.delete("/:id", protect, adminOnly, deleteSubscriber);

module.exports = router;
