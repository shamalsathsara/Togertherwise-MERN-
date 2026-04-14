const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  getSuccessStories,
  getFeaturedSuccessStories,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
} = require("../controllers/successStoryController");

// Public routes
router.get("/", getSuccessStories);
router.get("/featured", getFeaturedSuccessStories);

// Admin routes (Create with file upload, Delete, and Update)
router.post("/", protect, adminOnly, upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), createSuccessStory);
router.put("/:id", protect, adminOnly, upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), updateSuccessStory);
router.delete("/:id", protect, adminOnly, deleteSuccessStory);

module.exports = router;
