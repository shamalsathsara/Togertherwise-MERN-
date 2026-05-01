/**
 * StudentForm.jsx — Admin: Register a New Student
 * Custom modern DOB picker with separate Day / Month / Year selects.
 * Submits to POST /api/students and redirects to the students list.
 */

import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Exam config ──────────────────────────────────────────────────────────────
const EXAM_MAP = { 10: "Grade 5 Scholarship Exam", 16: "GCE O/L (Ordinary Level)", 19: "GCE A/L (Advanced Level)" };
const EXAM_COLORS = {
  "Grade 5 Scholarship Exam": "bg-purple-50 border-purple-200 text-purple-700",
  "GCE O/L (Ordinary Level)":  "bg-blue-50 border-blue-200 text-blue-700",
  "GCE A/L (Advanced Level)":  "bg-rose-50 border-rose-200 text-rose-700",
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// ── DOB state → ISO string (YYYY-MM-DD) ──────────────────────────────────────
const dobToIso = ({ day, month, year }) => {
  if (!day || !month || !year) return "";
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
};

const getPreview = (isoDate) => {
  if (!isoDate) return null;
  const age = new Date().getFullYear() - parseInt(isoDate.split("-")[0], 10);
  return { age, exam: EXAM_MAP[age] || null };
};

// Days in a given month (handles leap years)
const getDaysInMonth = (month, year) => {
  if (!month || !year) return 31;
  return new Date(year, month, 0).getDate();
};

// ── Custom DOB Picker ─────────────────────────────────────────────────────────
const DOBPicker = ({ value, onChange, hasError }) => {
  const currentYear = new Date().getFullYear();

  // Parse back from ISO string
  const parts = value ? value.split("-") : ["", "", ""];
  const selectedYear  = parts[0] ? parseInt(parts[0]) : "";
  const selectedMonth = parts[1] ? parseInt(parts[1]) : "";
  const selectedDay   = parts[2] ? parseInt(parts[2]) : "";

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

  const years = useMemo(() => {
    const arr = [];
    for (let y = currentYear; y >= 1990; y--) arr.push(y);
    return arr;
  }, [currentYear]);

  const handlePart = (key, val) => {
    const next = {
      year:  selectedYear  || "",
      month: selectedMonth || "",
      day:   selectedDay   || "",
      [key]: val ? parseInt(val) : "",
    };
    // Clamp day if month/year change reduces available days
    const maxDay = getDaysInMonth(next.month, next.year);
    if (next.day > maxDay) next.day = maxDay;
    onChange(dobToIso(next));
  };

  const selectClass = (filled, error) =>
    `appearance-none w-full bg-white px-3 py-2.5 pr-8 rounded-xl border text-[14px] text-gray-700 focus:outline-none focus:ring-2 transition-all cursor-pointer ${
      error   ? "border-red-300 focus:ring-red-200 focus:border-red-400" :
      filled  ? "border-forest/40 focus:ring-forest/20 focus:border-forest/50 bg-forest/[0.02]" :
                "border-gray-200 focus:ring-forest/20 focus:border-forest/40 text-gray-400"
    }`;

  return (
    <div className="space-y-2">
      {/* Label row */}
      <div className="flex items-center gap-2 text-[12px] font-medium text-gray-400">
        <span className="text-forest/70"><IconCalendar /></span>
        <span>Select day, month, then year</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">

        {/* Day */}
        <div className="relative">
          <select
            id="dob-day"
            value={selectedDay || ""}
            onChange={(e) => handlePart("day", e.target.value)}
            className={selectClass(!!selectedDay, hasError)}
          >
            <option value="">Day</option>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <IconChevronDown />
          </span>
        </div>

        {/* Month */}
        <div className="relative">
          <select
            id="dob-month"
            value={selectedMonth || ""}
            onChange={(e) => handlePart("month", e.target.value)}
            className={selectClass(!!selectedMonth, hasError)}
          >
            <option value="">Month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <IconChevronDown />
          </span>
        </div>

        {/* Year */}
        <div className="relative">
          <select
            id="dob-year"
            value={selectedYear || ""}
            onChange={(e) => handlePart("year", e.target.value)}
            className={selectClass(!!selectedYear, hasError)}
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <IconChevronDown />
          </span>
        </div>
      </div>

      {/* Display selected date nicely */}
      {value && (
        <div className="flex items-center gap-2 px-3 py-2 bg-forest/5 border border-forest/15 rounded-xl">
          <span className="text-forest/60"><IconCalendar /></span>
          <span className="text-[13px] font-semibold text-forest">
            {new Date(value + "T00:00:00").toLocaleDateString("en-LK", {
              day: "numeric", month: "long", year: "numeric"
            })}
          </span>
          <span className="text-[11px] text-gray-400 ml-auto">Selected ✓</span>
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
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

  const handleDobChange = (isoDate) => {
    setForm((prev) => ({ ...prev, dob: isoDate }));
    if (errors.dob) setErrors((prev) => ({ ...prev, dob: "" }));
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
          <h2 className="text-white font-bold text-lg mt-0.5">Personal &amp; Location Details</h2>
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

          {/* ── Date of Birth — Custom Picker ── */}
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-2">
              Date of Birth <span className="text-red-400">*</span>
            </label>
            <div className={`p-4 rounded-xl border transition-all ${errors.dob ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-gray-50/40"}`}>
              <DOBPicker
                value={form.dob}
                onChange={handleDobChange}
                hasError={!!errors.dob}
              />
            </div>
            {errors.dob && <p className="text-red-500 text-[12px] mt-1.5">{errors.dob}</p>}
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
