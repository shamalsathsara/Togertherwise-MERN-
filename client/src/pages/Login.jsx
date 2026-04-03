import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import logoImg from "../image/logo.png";

const Login = () => {
  const navigate = useNavigate();
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
      <div className="hidden lg:flex lg:w-1/2 bg-forest flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-96 h-96 bg-lime rounded-full absolute -top-20 -left-20 blur-3xl" />
          <div className="w-64 h-64 bg-lime rounded-full absolute bottom-20 right-10 blur-2xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img src={logoImg} alt="Togetherwise Logo" className="w-12 h-12 object-contain" />
          <div>
            <span className="font-display font-bold text-white text-xl leading-none block">
              Together<span className="text-lime">wise</span>
            </span>
            <span className="text-xs text-white/50 uppercase tracking-wide">Administration Portal</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="font-display font-black text-white text-5xl leading-none mb-6">
            Manage.<br />
            <span className="text-lime">Impact.</span><br />
            Report.
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            The Togetherwise admin portal gives you full control over projects, campaigns,
            donations, and volunteer management.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {loginStats.map((stat, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="font-display font-black text-lime text-2xl">{stat.value}</p>
              <p className="text-white/60 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="font-display font-bold text-forest text-2xl">
              Togetherwise <span className="text-lime-dark">Admin</span>
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="font-display font-bold text-forest text-3xl mb-2">Welcome Back</h2>
              <p className="text-gray-400 text-sm">Sign in to the administration portal</p>
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
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm flex items-center gap-2">
                  <span>⚠️</span>
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

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-400 text-xs text-center">
                🔒 This is a protected admin area.<br />
                Default credentials: <strong>admin@togetherwise.org</strong> / <strong>Admin@123</strong>
              </p>
            </div>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            Not an administrator?{" "}
            <a href="/" className="text-forest font-medium hover:underline">
              Return to main site
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
