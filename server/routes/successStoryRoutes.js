const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  getSuccessStories,
  getFeaturedSuccessStories,
  createSuccessStory,
  deleteSuccessStory,
} = require("../controllers/successStoryController");

// Public routes
router.get("/", getSuccessStories);
router.get("/featured", getFeaturedSuccessStories);

// Admin routes (Create with file upload, and Delete)
router.post("/", protect, adminOnly, upload.single("image"), createSuccessStory);
router.delete("/:id", protect, adminOnly, deleteSuccessStory);

module.exports = router;
