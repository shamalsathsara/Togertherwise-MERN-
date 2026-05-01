/**
 * StudentsList.jsx — Admin: Student Exam Tracking Dashboard
 * Displays all students in a table. Students turning 10, 16, or 19
 * this year get amber-highlighted rows + a dismissible alert banner.
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const EXAM_COLORS = {
  "Grade 5 Scholarship Exam": { pill: "bg-purple-100 text-purple-700 border border-purple-200", badge: "bg-purple-500" },
  "GCE O/L (Ordinary Level)":  { pill: "bg-blue-100 text-blue-700 border border-blue-200",   badge: "bg-blue-500"   },
  "GCE A/L (Advanced Level)":  { pill: "bg-rose-100 text-rose-700 border border-rose-200",    badge: "bg-rose-500"   },
};

const IconBell = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>);
const IconPlus = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const IconSearch = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const IconTrash = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>);
const IconX = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

const DeleteModal = ({ student, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
      <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400"><IconTrash /></div>
      <h3 className="text-lg font-bold text-gray-800 text-center mb-1">Delete Student?</h3>
      <p className="text-sm text-gray-500 text-center mb-6">Remove <strong>{student?.name}</strong> from the registry? This cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} disabled={isDeleting} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors">Cancel</button>
        <button onClick={onConfirm} disabled={isDeleting} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
          {isDeleting ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting…</> : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [toast, setToast] = useState(null);
  const currentYear = new Date().getFullYear();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/students");
      if (res.data.success) setStudents(res.data.students);
    } catch { showToast("Failed to load student records.", "error"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/students/${toDelete._id}`);
      showToast(`${toDelete.name} removed.`, "success");
      setToDelete(null);
      fetchStudents();
    } catch { showToast("Failed to delete student.", "error"); }
    finally { setIsDeleting(false); }
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.house.toLowerCase().includes(search.toLowerCase())
  );
  const examStudents = students.filter((s) => s.hasExamThisYear);
  const formatDOB = (d) => new Date(d).toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium ${toast.type === "success" ? "bg-gradient-to-r from-forest to-[#1f5f3a] text-white" : "bg-red-500 text-white"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Delete modal */}
      {toDelete && <DeleteModal student={toDelete} onConfirm={handleDelete} onCancel={() => setToDelete(null)} isDeleting={isDeleting} />}

      {/* ── Exam Alert Banner ── */}
      {examStudents.length > 0 && !alertDismissed && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-amber-600 mt-0.5">
                  <IconBell />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-bold text-amber-900 text-[15px]">📣 Exam Milestone Alert — {currentYear}</h3>
                    <span className="px-2.5 py-0.5 bg-amber-200 text-amber-800 text-[11px] font-bold rounded-full animate-pulse">
                      {examStudents.length} student{examStudents.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-amber-700 text-[13px] mb-3">The following students are scheduled for a national exam this year:</p>
                  <div className="flex flex-wrap gap-2">
                    {examStudents.map((s) => {
                      const c = EXAM_COLORS[s.upcomingExam] || {};
                      return (
                        <div key={s._id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-medium bg-white border border-amber-200 shadow-sm">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.badge}`} />
                          <span className="text-gray-700"><strong>{s.name}</strong> · Age {s.age} · {s.upcomingExam}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <button onClick={() => setAlertDismissed(true)} className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0" title="Dismiss">
                <IconX />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-gray-800 text-2xl">🎓 Student Exam Tracking</h1>
          <p className="text-gray-400 text-[13px] mt-0.5">{currentYear} · Registered students from local village houses</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {examStudents.length > 0 && alertDismissed && (
            <button onClick={() => setAlertDismissed(false)} className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-[13px] font-medium hover:bg-amber-100 transition-colors">
              <IconBell /> {examStudents.length} exam alert{examStudents.length > 1 ? "s" : ""}
            </button>
          )}
          <Link to="/admin/students/new" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-forest to-[#1f5f3a] text-white rounded-xl text-[13px] font-semibold hover:shadow-lg hover:shadow-forest/20 transition-all duration-200">
            <IconPlus /> Register Student
          </Link>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch /></span>
        <input
          type="text"
          placeholder="Search by name or house/village…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40 bg-white transition-all"
        />
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-[3px] border-forest/20 border-t-forest rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Loading students…</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-4xl">🎓</div>
            <p className="font-semibold text-gray-600 mb-1">{search ? "No students match your search" : "No students registered yet"}</p>
            <p className="text-gray-400 text-sm mb-4">{search ? "Try a different name or village." : "Register your first student below."}</p>
            {!search && (
              <Link to="/admin/students/new" className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl text-sm font-medium hover:bg-forest/90 transition-colors">
                <IconPlus /> Register First Student
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Header row */}
            <div className="hidden md:grid grid-cols-[2fr_2fr_1.2fr_0.8fr_2fr_auto] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/80">
              {["Student Name", "House / Village", "Date of Birth", "Age", "Upcoming Exam", ""].map((h, i) => (
                <span key={i} className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</span>
              ))}
            </div>

            {/* Data rows */}
            <div className="divide-y divide-gray-50">
              {filtered.map((student) => {
                const isAlert = student.hasExamThisYear;
                const c = EXAM_COLORS[student.upcomingExam] || {};
                return (
                  <div key={student._id}
                    className={`grid grid-cols-1 md:grid-cols-[2fr_2fr_1.2fr_0.8fr_2fr_auto] gap-x-4 gap-y-1.5 px-5 py-4 items-center transition-colors hover:bg-gray-50/50 ${isAlert ? "bg-amber-50/70 hover:bg-amber-50" : ""}`}
                  >
                    {/* Name */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${isAlert ? "bg-amber-100 text-amber-700" : "bg-forest/5 text-forest"}`}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800 truncate">{student.name}</p>
                        {isAlert && <p className="text-[10px] text-amber-600 font-medium">🔔 Exam this year</p>}
                      </div>
                    </div>

                    {/* House */}
                    <p className="text-[13px] text-gray-500 truncate md:block"><span className="md:hidden text-gray-400 text-[11px]">Village: </span>{student.house}</p>

                    {/* DOB */}
                    <p className="text-[13px] text-gray-500"><span className="md:hidden text-gray-400 text-[11px]">DOB: </span>{formatDOB(student.dob)}</p>

                    {/* Age */}
                    <div>
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[12px] font-bold ${isAlert ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                        {student.age} yrs
                      </span>
                    </div>

                    {/* Exam */}
                    <div>
                      {student.upcomingExam ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${c.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.badge}`} />
                          {student.upcomingExam}
                        </span>
                      ) : <span className="text-[12px] text-gray-300">—</span>}
                    </div>

                    {/* Delete */}
                    <button onClick={() => setToDelete(student)} className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all" title="Delete">
                      <IconTrash />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[12px] text-gray-400">{filtered.length} student{filtered.length !== 1 ? "s" : ""} shown{search ? ` · filtered from ${students.length}` : ""}</span>
              {examStudents.length > 0 && (
                <span className="text-[12px] text-amber-600 font-medium">🔔 {examStudents.length} with exam milestone in {currentYear}</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentsList;
