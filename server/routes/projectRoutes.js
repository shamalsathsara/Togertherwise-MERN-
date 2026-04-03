/**
 * projectRoutes.js — Project/Campaign Routes
 * Public: GET all projects, GET single project
 * Admin only: POST create, PUT update, DELETE
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// ─── Multer Configuration ─────────────────────────────────────────────────────
// Configure where uploaded files are stored and what filenames are used
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files go into the 'uploads' folder at server root
  },
  filename: (req, file, cb) => {
    // Use timestamp + original extension to prevent collisions
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Only allow image and video files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error("Only images and videos are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max per file
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/projects/public-stats — Public summary stats (Home page, Login page)
router.get("/public-stats", getProjectStats);

// GET /api/projects/stats — Summary stats for admin dashboard (admin only)
router.get("/stats", protect, adminOnly, getProjectStats);

// GET /api/projects — All projects (public)
router.get("/", getAllProjects);

// GET /api/projects/:id — Single project (public)
router.get("/:id", getProjectById);

// POST /api/projects — Create project with optional media upload (admin only)
router.post("/", protect, adminOnly, upload.array("media", 10), createProject);

// PUT /api/projects/:id — Update project (admin only)
router.put("/:id", protect, adminOnly, upload.array("media", 10), updateProject);

// DELETE /api/projects/:id — Delete project (admin only)
router.delete("/:id", protect, adminOnly, deleteProject);

module.exports = router;
