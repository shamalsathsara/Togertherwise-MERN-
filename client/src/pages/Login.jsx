import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import logoImg from "../image/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const { login, user, isAdmin } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginStats, setLoginStats] = useState([
    { value: "—", label: "Active Projects" },
    { value: "—", label: "Success Stories" },
    { value: "—", label: "Total Raised" },
  ]);

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, isAdmin, navigate]);

  // Fetch live stats for the left panel
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectRes, storyRes, donationRes] = await Promise.allSettled([
          axiosInstance.get("/projects/public-stats"),
          axiosInstance.get("/success-stories"),
          axiosInstance.get("/donations/stats"),
        ]);

        const activeProjects = projectRes.status === "fulfilled"
          ? projectRes.value.data.stats?.active || 0 : 0;
        const storiesCount = storyRes.status === "fulfilled"
          ? storyRes.value.data.count || storyRes.value.data.data?.length || 0 : 0;
        const totalRaised = donationRes.status === "fulfilled"
          ? donationRes.value.data.stats?.totalAmount || 0 : 0;

        setLoginStats([
          { value: String(activeProjects), label: "Active Projects" },
          { value: String(storiesCount), label: "Success Stories" },
          { value: `$${totalRaised.toLocaleString()}`, label: "Total Raised" },
        ]);
      } catch {
        // Keep defaults on error
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (result?.success) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      setError(result?.error || "Invalid email or password. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #111E16 0%, #1B3022 55%, #2D4F37 100%)"
      }}>
        {/* Decorative mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.1)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.06)", transform: "translate(-30%,30%)" }} />
          {/* Rings */}
          <div className="absolute top-1/2 right-12 w-48 h-48 rounded-full border border-lime/10" style={{ transform: "translateY(-50%)" }} />
          <div className="absolute bottom-24 right-24 w-20 h-20 rounded-full border border-white/6" />
          {/* Grid pattern */}
          <div className="absolute bottom-32 left-8 grid grid-cols-6 gap-3 opacity-10">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-lime" />
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <img src={logoImg} alt="Togetherwise Logo" className="w-full h-full object-contain" />
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
            <span className="text-lime text-xs font-semibold">Admin Dashboard</span>
          </div>

          <h1 className="font-display font-black text-white text-5xl leading-tight mb-6">
            Manage.<br />
            <span className="text-gradient-lime">Impact.</span><br />
            Report.
          </h1>
          <p className="text-white/55 text-lg leading-relaxed max-w-sm">
            The Togetherwise admin portal gives you full control over projects, campaigns,
            donations, and volunteer management.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {loginStats.map((stat, i) => (
            <div key={i} className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
              <p className="font-display font-black text-lime text-2xl">{stat.value}</p>
              <p className="text-white/50 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "linear-gradient(180deg,#f5f8f5 0%,#eef4ef 100%)" }}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="font-display font-bold text-forest text-2xl">
              Togetherwise <span style={{ color: "#7DD940" }}>Admin</span>
            </h2>
          </div>

          <div className="card-luxury p-10">
            {/* Reset success banner */}
            {resetSuccess && (
              <div className="flex items-center gap-2 rounded-xl p-3 mb-6 text-sm" style={{ background: "rgba(156,252,92,0.12)", border: "1px solid rgba(156,252,92,0.3)", color: "#1B3022" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Password updated! Please sign in with your new password.
              </div>
            )}

            {/* Form header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(to bottom,#9CFC5C,#7DD940)" }} />
                <h2 className="font-display font-bold text-forest text-3xl">Welcome Back</h2>
              </div>
              <p className="text-gray-400 text-sm ml-4">Sign in to the administration portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="form-label" htmlFor="admin-email">Email Address</label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@togetherwise.org"
                  className="form-input"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="admin-password">Password</label>
                <div className="relative">
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="form-input pr-12"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="flex justify-end -mt-2">
                <Link
                  to="/admin/forgot-password"
                  className="text-xs text-gray-400 hover:text-forest transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="rounded-xl p-3 text-sm flex items-center gap-2" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 text-base disabled:opacity-60"
                id="admin-login-btn"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>

            <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(27,48,34,0.04)", border: "1px solid rgba(27,48,34,0.06)" }}>
              <p className="text-gray-400 text-xs text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 inline-block mr-1 mb-0.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                This is a protected admin area.<br />
                Default credentials: <strong>admin@togetherwise.org</strong> / <strong>Admin@123</strong>
              </p>
            </div>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            Not an administrator?{" "}
            <a href="/" className="text-forest font-medium hover:text-lime-dark transition-colors">
              Return to main site
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
