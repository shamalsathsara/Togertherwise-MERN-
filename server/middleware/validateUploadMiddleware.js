/**
 * validateUploadMiddleware.js — Magic-Byte File Content Validator
 *
 * Purpose:
 *   Multer's fileFilter checks the MIME type from the HTTP request header, which
 *   is fully controlled by the client and can be spoofed. This middleware reads
 *   the first bytes of each uploaded file from disk and compares them against
 *   known magic-byte signatures to confirm the file is what it claims to be.
 *
 *   Must be placed AFTER a multer middleware that has already saved the file(s).
 *   Any file that fails validation is deleted from disk before the error is returned.
 *
 * Usage:
 *   router.post("/", upload.single("image"), validateFileContent, handler);
 *   router.post("/", upload.array("media", 10), validateFileContent, handler);
 */

const fs = require("fs");
const path = require("path");

// ─── Magic Byte Signatures ────────────────────────────────────────────────────
// Reference: https://en.wikipedia.org/wiki/List_of_file_signatures

const IMAGE_SIGNATURES = [
  { bytes: [0xff, 0xd8, 0xff], label: "JPEG" },
  { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], label: "PNG" },
  { bytes: [0x47, 0x49, 0x46, 0x38], label: "GIF" },
  { bytes: [0x52, 0x49, 0x46, 0x46], label: "WebP (RIFF container)" }, // bytes 8–11 should be "WEBP" but RIFF is enough
  { bytes: [0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70], label: "AVIF (ftyp)" }, // common AVIF box
  { bytes: [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70], label: "AVIF (ftyp 32)" },
];

// Video files have widely varying signatures; we validate them by extension + MIME only.
const ALLOWED_VIDEO_EXTS = new Set([".mp4", ".mov", ".avi"]);
const ALLOWED_VIDEO_MIMES = new Set(["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-avi"]);

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Reads the first `count` bytes from a file at `filePath`.
 * Returns a Buffer of length `count`.
 */
function readMagicBytes(filePath, count = 12) {
  const buf = Buffer.alloc(count);
  let fd;
  try {
    fd = fs.openSync(filePath, "r");
    fs.readSync(fd, buf, 0, count, 0);
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
  return buf;
}

/**
 * Checks if the buffer starts with the given byte sequence.
 */
function matchesSignature(buf, sigBytes) {
  return sigBytes.every((byte, i) => buf[i] === byte);
}

/**
 * Returns true if the file at `filePath` is a recognised image or video.
 * For images:  validates magic bytes.
 * For videos:  validates extension + MIME (magic bytes vary too widely).
 */
function isFileValid(file) {
  const ext = path.extname(file.originalname).toLowerCase();

  // ── Video: trust extension + MIME (both already checked by multer fileFilter) ──
  if (ALLOWED_VIDEO_EXTS.has(ext)) {
    return ALLOWED_VIDEO_MIMES.has(file.mimetype);
  }

  // ── Image: check actual magic bytes ──
  const filePath = file.path || path.join("uploads", file.filename);
  try {
    const buf = readMagicBytes(filePath, 12);
    return IMAGE_SIGNATURES.some((sig) => matchesSignature(buf, sig.bytes));
  } catch {
    return false; // Can't read → treat as invalid
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

/**
 * validateFileContent
 *
 * Must be placed AFTER a multer disk-storage middleware.
 * Validates every uploaded file by its magic bytes (images) or extension+MIME (video).
 * Deletes invalid files and returns a 400 error.
 */
const validateFileContent = (req, res, next) => {
  // Support both upload.single() and upload.array()
  const files = req.files ? req.files : req.file ? [req.file] : [];

  if (files.length === 0) return next();

  const invalid = [];

  for (const file of files) {
    if (!isFileValid(file)) {
      invalid.push(file.originalname);
      // Delete the suspicious file from disk immediately
      const filePath = file.path || path.join("uploads", file.filename);
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Already gone or unreadable — continue
      }
    }
  }

  if (invalid.length > 0) {
    res.status(400);
    return next(new Error(`Invalid file content detected: ${invalid.join(", ")}`));
  }

  next();
};

module.exports = { validateFileContent };
