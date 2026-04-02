const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");

// ─── POST /api/messages ────────────────────────────────────────────────────────
/**
 * sendMessage — Public endpoint to submit a contact form message.
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { type, firstName, lastName, email, phone, message } = req.body;

  if (!type || !firstName || !lastName || !email || !phone || !message) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const newMessage = await Message.create({
    type,
    firstName,
    lastName,
    email,
    phone,
    message,
  });

  res.status(201).json({ success: true, message: newMessage });
});

// ─── GET /api/messages ────────────────────────────────────────────────────────
/**
 * getMessages — Admin endpoint to get all submitted messages.
 */
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });

  res.json({ success: true, count: messages.length, messages });
});

// ─── DELETE /api/messages/:id ─────────────────────────────────────────────────
/**
 * deleteMessage — Admin endpoint to delete a message.
 */
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  await Message.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: "Message deleted successfully" });
});

// ─── PUT /api/messages/:id/read ───────────────────────────────────────────────
/**
 * markAsRead — Admin endpoint to toggle the read status of a message.
 */
const markAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  message.isRead = !message.isRead;
  await message.save();

  res.json({ success: true, message });
});

module.exports = {
  sendMessage,
  getMessages,
  deleteMessage,
  markAsRead,
};
