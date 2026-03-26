/**
 * adminMiddleware.js — Admin Role Guard
 * Must be used AFTER the `protect` middleware so req.user is populated.
 * Returns 403 Forbidden if the authenticated user is not an admin.
 */

/**
 * adminOnly — Checks if the authenticated user has the 'admin' role.
 * Usage: router.get('/admin/route', protect, adminOnly, handler)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const adminOnly = (req, res, next) => {
  // req.user is set by the protect middleware
  if (req.user && req.user.role === "admin") {
    // User is admin — allow through
    return next();
  }

  // Not an admin — return 403 Forbidden
  res.status(403).json({
    success: false,
    message: "Access denied — administrators only",
  });
};

module.exports = { adminOnly };
