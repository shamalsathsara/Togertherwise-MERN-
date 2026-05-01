/**
 * Student.js — Mongoose Model for Student Exam Tracking
 *
 * Stores student registration data for local village/house students.
 * The DOB field is used to dynamically compute the student's current age
 * and map it to upcoming Sri Lankan national exam milestones.
 *
 * Exam Milestones:
 *   Age 10 → Grade 5 Scholarship Exam
 *   Age 16 → GCE O/L (Ordinary Level)
 *   Age 19 → GCE A/L (Advanced Level)
 */

const mongoose = require("mongoose");

const EXAM_MILESTONES = {
  10: "Grade 5 Scholarship Exam",
  16: "GCE O/L (Ordinary Level)",
  19: "GCE A/L (Advanced Level)",
};

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    house: {
      type: String,
      required: [true, "House/Village details are required"],
      trim: true,
      maxlength: [200, "House/Village details cannot exceed 200 characters"],
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual: age
 * Calculates the student's current age in years based on birth year.
 * Uses calendar year only (consistent with Sri Lankan exam eligibility).
 */
studentSchema.virtual("age").get(function () {
  const currentYear = new Date().getFullYear();
  return currentYear - this.dob.getFullYear();
});

/**
 * Virtual: upcomingExam
 * Returns the name of the upcoming national exam if the student's
 * current age matches a milestone (10, 16, or 19). Returns null otherwise.
 */
studentSchema.virtual("upcomingExam").get(function () {
  const currentYear = new Date().getFullYear();
  const age = currentYear - this.dob.getFullYear();
  return EXAM_MILESTONES[age] || null;
});

/**
 * Virtual: hasExamThisYear
 * Boolean flag — true if the student has an exam milestone this year.
 */
studentSchema.virtual("hasExamThisYear").get(function () {
  const currentYear = new Date().getFullYear();
  const age = currentYear - this.dob.getFullYear();
  return Object.keys(EXAM_MILESTONES).map(Number).includes(age);
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
