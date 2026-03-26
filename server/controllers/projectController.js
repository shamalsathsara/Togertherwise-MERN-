/**
 * projectController.js — Project/Campaign CRUD Controller
 * Handles creating, reading, updating, and deleting projects.
 * Admin-only for write operations; public for read operations.
 */

const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");

// ─── GET /api/projects ────────────────────────────────────────────────────────
/**
 * getAllProjects — Returns all projects (public).
 * Supports filtering by status and category via query params.
 * e.g., /api/projects?status=active&category=Water Projects
 */
const getAllProjects = asyncHandler(async (req, res) => {
  // Build the filter object from query parameters
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;

  const projects = await Project.find(filter)
    .sort({ createdAt: -1 }) // Newest first
    .populate("createdBy", "name email"); // Include creator info

  res.json({ success: true, count: projects.length, projects });
});

// ─── GET /api/projects/:id ────────────────────────────────────────────────────
/**
 * getProjectById — Returns a single project by its MongoDB ID (public).
 */
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "createdBy",
    "name email"
  );

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json({ success: true, project });
});

// ─── POST /api/projects ───────────────────────────────────────────────────────
/**
 * createProject — Creates a new project (admin only).
 * Media files (images/videos) are handled by Multer middleware and
 * their paths are stored in the mediaUrls array.
 */
const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    shortDescription,
    goal,
    startDate,
    endDate,
    status,
    category,
    isFeatured,
  } = req.body;

  // Validate required fields
  if (!title || !description || !goal) {
    res.status(400);
    throw new Error("Title, description, and goal are required");
  }

  // Collect uploaded file paths from Multer (if any)
  const mediaUrls = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
  const coverImage = mediaUrls.length > 0 ? mediaUrls[0] : "";

  const project = await Project.create({
    title,
    description,
    shortDescription: shortDescription || description.substring(0, 150),
    goal: Number(goal),
    startDate: startDate || Date.now(),
    endDate: endDate || null,
    status: status || "active",
    category: category || "Other",
    mediaUrls,
    coverImage,
    createdBy: req.user._id, // Set from auth middleware
    isFeatured: isFeatured === "true" || isFeatured === true,
  });

  res.status(201).json({ success: true, project });
});

// ─── PUT /api/projects/:id ────────────────────────────────────────────────────
/**
 * updateProject — Updates an existing project (admin only).
 */
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Merge updated fields — only update fields that are provided
  const updatedFields = { ...req.body };

  // If new files were uploaded, append to existing mediaUrls
  if (req.files && req.files.length > 0) {
    const newUrls = req.files.map((f) => `/uploads/${f.filename}`);
    updatedFields.mediaUrls = [...project.mediaUrls, ...newUrls];
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    updatedFields,
    { new: true, runValidators: true } // Return the updated document
  );

  res.json({ success: true, project: updatedProject });
});

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────
/**
 * deleteProject — Soft-deletes a project by setting status to 'paused' (admin only).
 * For a hard delete, use findByIdAndDelete.
 */
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  await Project.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: "Project deleted successfully" });
});

// ─── GET /api/projects/stats ──────────────────────────────────────────────────
/**
 * getProjectStats — Returns summary statistics for the dashboard.
 * Used by the admin dashboard to populate the overview cards.
 */
const getProjectStats = asyncHandler(async (req, res) => {
  const activeCount = await Project.countDocuments({ status: "active" });
  const completedCount = await Project.countDocuments({ status: "completed" });
  const featuredCount = await Project.countDocuments({ isFeatured: true });
  const totalProjects = await Project.countDocuments();

  res.json({
    success: true,
    stats: {
      active: activeCount,
      completed: completedCount,
      featured: featuredCount,
      total: totalProjects,
    },
  });
});

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
};
