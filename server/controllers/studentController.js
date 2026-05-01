/**
 * studentController.js — Student Exam Tracking Controller
 *
 * Handles all CRUD operations for student records and provides
 * a dedicated exam-alerts endpoint that surfaces students whose
 * current age matches a Sri Lankan national exam milestone (10, 16, 19).
 */

const asyncHandler = require("express-async-handler");
const Student = require("../models/Student");

const EXAM_MILESTONE_AGES = [10, 16, 19];

const EXAM_MILESTONES = {
  10: "Grade 5 Scholarship Exam",
  16: "GCE O/L (Ordinary Level)",
  19: "GCE A/L (Advanced Level)",
};

/**
 * @desc    Register a new student
 * @route   POST /api/students
 * @access  Admin
 */
const createStudent = asyncHandler(async (req, res) => {
  const { name, house, dob } = req.body;

  if (!name || !house || !dob) {
    res.status(400);
    throw new Error("Name, House/Village, and Date of Birth are all required.");
  }

  const student = await Student.create({ name, house, dob });

  res.status(201).json({
    success: true,
    message: "Student registered successfully.",
    student: {
      _id: student._id,
      name: student.name,
      house: student.house,
      dob: student.dob,
      age: student.age,
      upcomingExam: student.upcomingExam,
      hasExamThisYear: student.hasExamThisYear,
      createdAt: student.createdAt,
    },
  });
});

/**
 * @desc    Get all registered students with computed age & exam fields
 * @route   GET /api/students
 * @access  Admin
 */
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({}).sort({ createdAt: -1 });

  const currentYear = new Date().getFullYear();

  const enriched = students.map((s) => {
    const age = currentYear - s.dob.getFullYear();
    return {
      _id: s._id,
      name: s.name,
      house: s.house,
      dob: s.dob,
      age,
      upcomingExam: EXAM_MILESTONES[age] || null,
      hasExamThisYear: EXAM_MILESTONE_AGES.includes(age),
      createdAt: s.createdAt,
    };
  });

  res.json({
    success: true,
    count: enriched.length,
    students: enriched,
  });
});

/**
 * @desc    Get students who have an exam milestone in the current year
 * @route   GET /api/students/exam-alerts
 * @access  Admin
 */
const getExamAlerts = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();
  const students = await Student.find({});

  const alerts = students
    .map((s) => {
      const age = currentYear - s.dob.getFullYear();
      const exam = EXAM_MILESTONES[age];
      return exam
        ? {
            _id: s._id,
            name: s.name,
            house: s.house,
            dob: s.dob,
            age,
            upcomingExam: exam,
          }
        : null;
    })
    .filter(Boolean);

  res.json({
    success: true,
    count: alerts.length,
    year: currentYear,
    alerts,
  });
});

/**
 * @desc    Delete a student record
 * @route   DELETE /api/students/:id
 * @access  Admin
 */
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found.");
  }

  await student.deleteOne();

  res.json({
    success: true,
    message: "Student record deleted successfully.",
  });
});

module.exports = {
  createStudent,
  getAllStudents,
  getExamAlerts,
  deleteStudent,
};
