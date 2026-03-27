const asyncHandler = require("express-async-handler");
const SuccessStory = require("../models/SuccessStory");

// @desc    Get all success stories
// @route   GET /api/success-stories
// @access  Public
const getSuccessStories = asyncHandler(async (req, res) => {
  const stories = await SuccessStory.find({}).sort("-createdAt");
  res.status(200).json({ success: true, count: stories.length, data: stories });
});

// @desc    Get top featured success stories (for homepage)
// @route   GET /api/success-stories/featured
// @access  Public
const getFeaturedSuccessStories = asyncHandler(async (req, res) => {
  const stories = await SuccessStory.find({}).sort("-createdAt").limit(3);
  res.status(200).json({ success: true, count: stories.length, data: stories });
});

// @desc    Create a new success story
// @route   POST /api/success-stories
// @access  Private/Admin
const createSuccessStory = asyncHandler(async (req, res) => {
  const { title, location, tag, quote, person, role } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image for the success story");
  }

  // Construct the URL to access the uploaded file
  // multer saves it in 'uploads/' directory which we expose statically
  const image = `/uploads/${req.file.filename}`;

  const story = await SuccessStory.create({
    title,
    location,
    tag,
    quote,
    person,
    role,
    image,
  });

  res.status(201).json({ success: true, data: story });
});

// @desc    Delete a success story
// @route   DELETE /api/success-stories/:id
// @access  Private/Admin
const deleteSuccessStory = asyncHandler(async (req, res) => {
  const story = await SuccessStory.findById(req.params.id);

  if (!story) {
    res.status(404);
    throw new Error("Success story not found");
  }

  await story.deleteOne();

  res.status(200).json({ success: true, message: "Story deleted successfully" });
});

module.exports = {
  getSuccessStories,
  getFeaturedSuccessStories,
  createSuccessStory,
  deleteSuccessStory,
};
