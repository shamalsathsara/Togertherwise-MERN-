const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  deleteMessage,
  markAsRead,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Public route to submit a message
router.route("/").post(sendMessage);

// Protected Admin routes
router.route("/").get(protect, adminOnly, getMessages);
router.route("/:id").delete(protect, adminOnly, deleteMessage);
router.route("/:id/read").put(protect, adminOnly, markAsRead);

module.exports = router;
