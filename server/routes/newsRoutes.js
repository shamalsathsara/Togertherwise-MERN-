const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { validateFileContent } = require("../middleware/validateUploadMiddleware");
const {
  getAllNews,
  getAllNewsAdmin,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");

// Public route — only visible items
router.get("/", getAllNews);

// Admin routes
router.get("/admin", protect, adminOnly, getAllNewsAdmin);
router.post("/", protect, adminOnly, upload.single("image"), validateFileContent, createNews);
router.put("/:id", protect, adminOnly, upload.single("image"), validateFileContent, updateNews);
router.delete("/:id", protect, adminOnly, deleteNews);

module.exports = router;
