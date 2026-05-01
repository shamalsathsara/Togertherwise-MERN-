/**
 * StudentForm.jsx — Admin: Register a New Student
 * Clean form to capture student name, house/village, and date of birth.
 * Submits to POST /api/students and redirects to the students list.
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

// Computes age & exam from a dob string for the live preview
const EXAM_MAP = { 10: "Grade 5 Scholarship Exam", 16: "GCE O/L (Ordinary Level)", 19: "GCE A/L (Advanced Level)" };
const getPreview = (dob) => {
  if (!dob) return null;
  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  return { age, exam: EXAM_MAP[age] || null };
};

const EXAM_COLORS = {
  "Grade 5 Scholarship Exam": "bg-purple-50 border-purple-200 text-purple-700",
  "GCE O/L (Ordinary Level)":  "bg-blue-50 border-blue-200 text-blue-700",
  "GCE A/L (Advanced Level)":  "bg-rose-50 border-rose-200 text-rose-700",
};

const StudentForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", house: "", dob: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const preview = getPreview(form.dob);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Student name is required.";
    if (!form.house.trim()) e.house = "House/Village details are required.";
    if (!form.dob) e.dob = "Date of Birth is required.";
    else if (new Date(form.dob) > new Date()) e.dob = "Date of Birth cannot be in the future.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await axiosInstance.post("/students", form);
      if (res.data.success) {
        navigate("/admin/students", { state: { successMsg: `${form.name} registered successfully!` } });
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to register student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/students"
          className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
          <IconArrowLeft />
        </Link>
        <div>
          <h1 className="font-display font-bold text-gray-800 text-2xl">🎓 Register New Student</h1>
          <p className="text-gray-400 text-[13px] mt-0.5">Add a student from a local village house to the exam tracking registry.</p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Banner */}
        <div className="bg-gradient-to-r from-forest to-[#1f5f3a] px-6 py-5">
          <p className="text-white/70 text-[13px]">Student Information</p>
          <h2 className="text-white font-bold text-lg mt-0.5">Personal & Location Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>

          {/* Submit error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
              <span>⚠</span> {submitError}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="student-name" className="block text-[13px] font-semibold text-gray-700 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              id="student-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Kamal Perera"
              className={`w-full px-4 py-2.5 rounded-xl border text-[14px] focus:outline-none focus:ring-2 transition-all ${errors.name ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-forest/20 focus:border-forest/40"}`}
            />
            {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name}</p>}
          </div>

          {/* House / Village */}
          <div>
            <label htmlFor="student-house" className="block text-[13px] font-semibold text-gray-700 mb-1.5">
              House / Village <span className="text-red-400">*</span>
            </label>
            <input
              id="student-house"
              type="text"
              name="house"
              value={form.house}
              onChange={handleChange}
              placeholder="e.g. No. 12, Mahinda Mawatha, Galle"
              className={`w-full px-4 py-2.5 rounded-xl border text-[14px] focus:outline-none focus:ring-2 transition-all ${errors.house ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-forest/20 focus:border-forest/40"}`}
            />
            {errors.house && <p className="text-red-500 text-[12px] mt-1">{errors.house}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="student-dob" className="block text-[13px] font-semibold text-gray-700 mb-1.5">
              Date of Birth <span className="text-red-400">*</span>
            </label>
            <input
              id="student-dob"
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className={`w-full px-4 py-2.5 rounded-xl border text-[14px] focus:outline-none focus:ring-2 transition-all ${errors.dob ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-forest/20 focus:border-forest/40"}`}
            />
            {errors.dob && <p className="text-red-500 text-[12px] mt-1">{errors.dob}</p>}
          </div>

          {/* Live Age & Exam Preview */}
          {form.dob && preview && (
            <div className={`rounded-xl border px-4 py-3.5 ${preview.exam ? EXAM_COLORS[preview.exam] : "bg-gray-50 border-gray-200"}`}>
              <p className="text-[12px] font-semibold uppercase tracking-wide opacity-60 mb-1">Live Preview</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[15px] font-bold">
                  Current Age: {preview.age} years old
                </span>
                {preview.exam ? (
                  <span className="text-[13px] font-semibold">
                    🎓 Scheduled for: {preview.exam} in {new Date().getFullYear()}
                  </span>
                ) : (
                  <span className="text-[13px] opacity-60">No exam milestone this year</span>
                )}
              </div>
            </div>
          )}

          {/* Exam Reference */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-3">Sri Lankan Exam Milestones</p>
            <div className="space-y-2">
              {Object.entries(EXAM_MAP).map(([age, exam]) => (
                <div key={age} className="flex items-center gap-3 text-[13px] text-gray-600">
                  <span className="w-8 h-6 bg-white border border-gray-200 rounded-md text-center text-[11px] font-bold text-gray-700 flex items-center justify-center">{age}</span>
                  <span>→</span>
                  <span>{exam}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Link to="/admin/students"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-forest to-[#1f5f3a] text-white text-sm font-semibold hover:shadow-lg hover:shadow-forest/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Registering…</>
              ) : "Register Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
