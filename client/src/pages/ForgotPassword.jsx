/**
 * ForgotPassword.jsx — Admin Forgot Password Page
 * Matches the Login page split-panel design.
 * Sends a request to POST /api/auth/forgot-password.
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import logoImg from "../image/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "sent" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #111E16 0%, #1B3022 55%, #2D4F37 100%)"
      }}>
        {/* Decorative mesh */}
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
            <span className="text-lime text-xs font-semibold">Password Recovery</span>
          </div>

          <h1 className="font-display font-black text-white text-5xl leading-tight mb-6">
            Forgot<br />
            <span className="text-gradient-lime">Your</span><br />
            Password?
          </h1>
          <p className="text-white/55 text-lg leading-relaxed max-w-sm">
            No worries. Enter your admin email and we'll send you a secure reset link valid for 10 minutes.
          </p>
        </div>

        {/* Security note */}
        <div className="relative z-10 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="flex items-start gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-lime flex-shrink-0 mt-0.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <div>
              <p className="text-white/70 text-sm font-semibold mb-1">Secure Reset Process</p>
              <p className="text-white/40 text-xs leading-relaxed">Reset links expire after 10 minutes and can only be used once. Only the registered admin email can request a reset.</p>
            </div>
          </div>
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
            {/* Form header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(to bottom,#9CFC5C,#7DD940)" }} />
                <h2 className="font-display font-bold text-forest text-3xl">Reset Password</h2>
              </div>
              <p className="text-gray-400 text-sm ml-4">Enter your admin email to receive a reset link</p>
            </div>

            {/* Success state */}
            {status === "sent" ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg,rgba(156,252,92,0.2),rgba(156,252,92,0.08))", border: "1px solid rgba(156,252,92,0.3)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-forest">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3 className="font-display font-bold text-forest text-xl mb-2">Check Your Email</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-2">
                  If <strong>{email}</strong> is registered as an admin, a reset link has been sent.
                </p>
                <p className="text-gray-400 text-xs mb-6">
                  Also check your spam folder. The link expires in <strong>10 minutes</strong>.
                </p>
                {/* Dev mode hint */}
                <div className="rounded-xl p-3 text-xs text-left mb-6" style={{ background: "rgba(27,48,34,0.04)", border: "1px solid rgba(27,48,34,0.08)" }}>
                  <p className="text-gray-500 font-semibold mb-1">Running locally?</p>
                  <p className="text-gray-400">If SMTP is not configured, the reset link is printed to your <strong>server console</strong>.</p>
                </div>
                <Link to="/admin/login" className="btn-primary w-full block text-center">
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="form-label" htmlFor="forgot-email">Admin Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); setStatus(null); }}
                    placeholder="admin@Togertherwerise.org"
                    className="form-input"
                    autoComplete="email"
                    required
                  />
                </div>

                {(status === "error") && (
                  <div className="rounded-xl p-3 text-sm flex items-center gap-2" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full py-4 text-base disabled:opacity-60"
                  id="forgot-password-btn"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                      Sending Reset Link...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            Remembered your password?{" "}
            <Link to="/admin/login" className="text-forest font-medium hover:text-lime-dark transition-colors">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
