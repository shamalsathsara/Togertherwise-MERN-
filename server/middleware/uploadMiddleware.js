const multer = require("multer");
const path = require("path");

// Configure storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Files will be saved into the uploads directory
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    // Ensure unique filenames by appending timestamp
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

// Check file type to ensure it's an image or video
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|avif|mp4|webm|avi|mov/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images and videos only! (jpg, jpeg, png, webp, avif, mp4, webm, avi, mov)"));
  }
}

// Initialize upload middleware with 50MB limit
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
