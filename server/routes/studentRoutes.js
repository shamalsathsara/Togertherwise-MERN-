/**
 * studentRoutes.js — Student Exam Tracking API Routes
 *
 * All routes are protected — only authenticated admins can access them.
 *
 * Routes:
 *   POST   /api/students              → Register a new student
 *   GET    /api/students              → Get all students with age & exam data
 *   GET    /api/students/exam-alerts  → Get students with exam milestones this year
 *   DELETE /api/students/:id          → Delete a student record
 */

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  createStudent,
  getAllStudents,
  getExamAlerts,
  deleteStudent,
} = require("../controllers/studentController");

// Apply auth guard to all student routes
router.use(protect);
router.use(adminOnly);

// NOTE: /exam-alerts must be registered BEFORE /:id to avoid route collision
router.get("/exam-alerts", getExamAlerts);

router.route("/").get(getAllStudents).post(createStudent);

router.route("/:id").delete(deleteStudent);

module.exports = router;
