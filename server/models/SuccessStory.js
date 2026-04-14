const mongoose = require("mongoose");

const successStorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    tag: {
      type: String,
      required: [true, "Tag (Category) is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    video: {
      type: String,
      default: "",
    },
    quote: {
      type: String,
      required: [true, "Quote is required"],
    },
    person: {
      type: String,
      required: [true, "Person name is required"],
    },
    role: {
      type: String,
      required: [true, "Person's role is required"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SuccessStory", successStorySchema);
