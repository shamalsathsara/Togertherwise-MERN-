const asyncHandler = require("express-async-handler");
const Subscriber = require("../models/Subscriber");

// ─── POST /api/subscribers ──────────────────────────────────────────────────
/**
 * createSubscriber — Save an email to the newsletter (public)
 */
const createSubscriber = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const existing = await Subscriber.findOne({ email });
  if (existing) {
    return res.status(200).json({ success: true, message: "Already subscribed!" });
  }

  const subscriber = await Subscriber.create({ email });
  res.status(201).json({ success: true, subscriber });
});

// ─── GET /api/subscribers ───────────────────────────────────────────────────
/**
 * getAllSubscribers — Returns all subscribers (admin only)
 */
const getAllSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 });
  res.json({ success: true, count: subscribers.length, subscribers });
});

// ─── DELETE /api/subscribers/:id ──────────────────────────────────────────────
/**
 * deleteSubscriber — Removes an email from the list (admin only)
 */
const deleteSubscriber = asyncHandler(async (req, res) => {
  const sub = await Subscriber.findById(req.params.id);
  if (!sub) {
    res.status(404);
    throw new Error("Subscriber not found");
  }

  await Subscriber.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Subscriber removed" });
});

module.exports = {
  createSubscriber,
  getAllSubscribers,
  deleteSubscriber,
};
