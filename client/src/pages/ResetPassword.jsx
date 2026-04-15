/**
 * ResetPassword.jsx — Admin Reset Password Page
 * Reads the :token from URL params and submits to POST /api/auth/reset-password/:token.
 * On success, redirects to /admin/login with a success flag.
 */

import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import logoImg from "../image/logo.png";

// Password strength helper
const getStrength = (pw) => {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Weak", color: "#ef4444" };
  if (score === 2) return { level: 2, label: "Fair", color: "#f59e0b" };
  if (score === 3) return { level: 3, label: "Good", color: "#3b82f6" };
  return { level: 4, label: "Strong", color: "#22c55e" };
};

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const strength = getStrength(formData.password);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg("");
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setStatus("loading");
    try {
      const { data } = await axiosInstance.post(`/auth/reset-password/${token}`, {
        password: formData.password,
      });
      if (data.success) {
        setStatus("success");
        // Redirect to login with success query param after 2 seconds
        setTimeout(() => navigate("/admin/login?reset=success"), 2000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Reset failed. The link may have expired.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #111E16 0%, #1B3022 55%, #2D4F37 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.1)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.06)", transform: "translate(-30%,30%)" }} />
          <div className="absolute top-1/2 right-12 w-48 h-48 rounded-full border border-lime/10" style={{ transform: "translateY(-50%)" }} />
          <div className="absolute bottom-24 right-24 w-20 h-20 rounded-full border border-white/6" />
          <div className="absolute bottom-32 left-8 grid grid-cols-6 gap-3 opacity-10">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-lime" />
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <img src={logoImg} alt="Togertherwerise Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-xl leading-none block">
              Together<span className="text-lime">wise</span>
            </span>
            <span className="text-xs text-white/40 uppercase tracking-wide">Administration Portal</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-6" style={{ background: "rgba(156,252,92,0.12)", border: "1px solid rgba(156,252,92,0.25)" }}>
            <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse" />
            <span className="text-lime text-xs font-semibold">Secure Reset</span>
          </div>

          <h1 className="font-display font-black text-white text-5xl leading-tight mb-6">
            Set New<br />
            <span className="text-gradient-lime">Password.</span>
          </h1>
          <p className="text-white/55 text-lg leading-relaxed max-w-sm">
            Choose a strong password with at least 8 characters, a number, and an uppercase letter.
          </p>
        </div>

        {/* Tips */}
        <div className="relative z-10 space-y-2">
          {[
            "At least 8 characters long",
            "Include uppercase & lowercase",
            "Add numbers & symbols for strength",
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(156,252,92,0.2)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#9CFC5C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span className="text-white/50 text-sm">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel — Form ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "linear-gradient(180deg,#f5f8f5 0%,#eef4ef 100%)" }}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="font-display font-bold text-forest text-2xl">
              Togertherwerise <span style={{ color: "#7DD940" }}>Admin</span>
            </h2>
          </div>

          <div className="card-luxury p-10">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(to bottom,#9CFC5C,#7DD940)" }} />
                <h2 className="font-display font-bold text-forest text-3xl">New Password</h2>
              </div>
              <p className="text-gray-400 text-sm ml-4">Enter and confirm your new admin password</p>
            </div>

            {/* Success state */}
            {status === "success" ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg,rgba(156,252,92,0.2),rgba(156,252,92,0.08))", border: "1px solid rgba(156,252,92,0.3)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-forest">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3 className="font-display font-bold text-forest text-xl mb-2">Password Updated!</h3>
                <p className="text-gray-500 text-sm mb-4">Your password has been changed successfully. Redirecting to login…</p>
                <div className="w-8 h-8 border-2 border-lime/30 border-t-lime rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div>
                  <label className="form-label" htmlFor="reset-password">New Password</label>
                  <div className="relative">
                    <input
                      id="reset-password"
                      name="password"
                      type={showPw ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="form-input pr-12"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest transition-colors"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((lvl) => (
                          <div key={lvl} className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ background: lvl <= strength.level ? strength.color : "#e5e7eb" }} />
                        ))}
                      </div>
                      <p className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="form-label" htmlFor="reset-confirm">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="reset-confirm"
                      name="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={formData.confirm}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="form-input pr-12"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest transition-colors"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  {/* Match indicator */}
                  {formData.confirm && (
                    <p className="text-xs mt-1 font-medium" style={{ color: formData.password === formData.confirm ? "#22c55e" : "#ef4444" }}>
                      {formData.password === formData.confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>

                {errorMsg && (
                  <div className="rounded-xl p-3 text-sm flex items-center gap-2" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full py-4 text-base disabled:opacity-60"
                  id="reset-password-btn"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                      Resetting Password...
                    </span>
                  ) : (
                    "Set New Password"
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            <Link to="/admin/login" className="text-forest font-medium hover:text-lime-dark transition-colors">
              ← Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
