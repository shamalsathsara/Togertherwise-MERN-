/**
 * newsController.js — News & Updates Controller
 * Full CRUD for homepage news items.
 * Read is public; Create, Update, Delete are admin-only.
 */

const asyncHandler = require("express-async-handler");
const NewsUpdate = require("../models/NewsUpdate");

// ─── GET /api/news ─────────────────────────────────────────────────────────────
/**
 * getAllNews — Returns all visible news items (public).
 * Sorted by order ASC, then newest first.
 */
const getAllNews = asyncHandler(async (req, res) => {
  const filter = { isVisible: true };
  const items = await NewsUpdate.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
});

// ─── GET /api/news/admin ────────────────────────────────────────────────────────
/**
 * getAllNewsAdmin — Returns ALL news items including hidden ones (admin only).
 */
const getAllNewsAdmin = asyncHandler(async (req, res) => {
  const items = await NewsUpdate.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
});

// ─── POST /api/news ────────────────────────────────────────────────────────────
/**
 * createNews — Creates a new news item (admin only).
 */
const createNews = asyncHandler(async (req, res) => {
  const { label, tag, status, image, order, isVisible } = req.body;

  if (!label || !tag) {
    res.status(400);
    throw new Error("News content and tag are required");
  }

  // If an image was uploaded via multer, use that path
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : (image || "");

  const item = await NewsUpdate.create({
    label,
    tag,
    status: status || "in-progress",
    image: imageUrl,
    order: order ? Number(order) : 0,
    isVisible: isVisible !== undefined ? isVisible : true,
  });

  res.status(201).json({ success: true, data: item });
});

// ─── PUT /api/news/:id ─────────────────────────────────────────────────────────
/**
 * updateNews — Updates a news item (admin only).
 */
const updateNews = asyncHandler(async (req, res) => {
  const item = await NewsUpdate.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("News item not found");
  }

  const { label, tag, status, image, order, isVisible } = req.body;

  if (req.file) item.image = `/uploads/${req.file.filename}`;
  else if (image != null) item.image = image;

  if (label     != null) item.label     = label;
  if (tag       != null) item.tag       = tag;
  if (status    != null) item.status    = status;
  if (order     != null) item.order     = Number(order);
  if (isVisible != null) item.isVisible = isVisible === "true" || isVisible === true;

  const updated = await item.save();
  res.json({ success: true, data: updated });
});

// ─── DELETE /api/news/:id ──────────────────────────────────────────────────────
/**
 * deleteNews — Deletes a news item (admin only).
 */
const deleteNews = asyncHandler(async (req, res) => {
  const item = await NewsUpdate.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("News item not found");
  }

  await item.deleteOne();
  res.json({ success: true, message: "News item deleted successfully" });
});

module.exports = { getAllNews, getAllNewsAdmin, createNews, updateNews, deleteNews };
