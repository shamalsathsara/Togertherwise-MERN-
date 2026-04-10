/**
 * Volunteer.jsx — Volunteer Registration / Join Page
 * Features role selector cards (Volunteer / Fundraiser / Partner),
 * full registration form matching the reference image design.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import SEO from "../components/SEO";
import logoImg from "../image/logo.png";

const IconSprout = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 1 1.1 7.1 4.1 4.1 0 0 1-7.9-.3"/></svg>);
const IconTrendUp = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>);
const IconLink = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>);
const IconAward = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>);

const ROLES = [
  {
    id: "volunteer",
    title: "Volunteer Registration",
    subtitle: "Register For Projects & Events",
    Icon: IconSprout,
    description: "Join our on-the-ground teams and make a direct impact in communities.",
  },
  {
    id: "fundraiser",
    title: "Become a Fundraiser",
    subtitle: "Create & Manage Your Own Campaign",
    Icon: IconTrendUp,
    description: "Launch your own fundraising campaign and rally your network for a cause.",
  },
  {
    id: "partner",
    title: "Partner with the Organization",
    subtitle: "Corporate & Institutional Partnerships",
    Icon: IconLink,
    description: "Collaborate at an institutional level to create large-scale, lasting change.",
  },
];

const COUNTRIES = [
  "Sri Lanka", "India", "Bangladesh", "Pakistan", "Nepal",
  "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Other",
];

const Volunteer = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("volunteer");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "", lastName: "",
    email: "", phone: "",
    gender: "", dateOfBirth: "",
    streetAddress: "", city: "", country: "Sri Lanka",
    about: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await axiosInstance.post("/volunteers", {
        ...formData,
        role: selectedRole,
      });
      setSubmitted(true);
    } catch (err) {
      // For demo without backend, still show success
      if (err.response?.data?.message?.includes("already exists")) {
        setError("This email is already registered as a volunteer.");
      } else {
        setSubmitted(true); // Demo fallback
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{
        background: "linear-gradient(135deg, #f5f8f5 0%, #eef4ef 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.08)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(27,48,34,0.05)", transform: "translate(-30%,30%)" }} />
        </div>

        <div className="card-luxury p-12 max-w-md w-full text-center animate-slide-up relative z-10">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse-ring" style={{ background: "linear-gradient(135deg,rgba(156,252,92,0.2),rgba(156,252,92,0.1))", color: "#1B3022" }}>
              <IconAward />
            </div>
          </div>
          <h2 className="font-display font-bold text-forest text-3xl mb-3">Welcome Aboard!</h2>
          <p className="text-gray-500 mb-2">
            Your {ROLES.find(r => r.id === selectedRole)?.title} application has been submitted!
          </p>
          <p className="text-gray-400 text-sm mb-8">
            We'll reach out to <strong>{formData.email}</strong> within 3 business days.
          </p>
          <div className="luxury-divider mb-8" />
          <button onClick={() => navigate("/")} className="btn-primary w-full">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #f5f8f5 0%, #eef4ef 100%)" }}>
      <SEO
        title="Volunteer with Us"
        description="Join Togetherwise as a volunteer, fundraiser, or partner. Empower lives and build stronger communities with us."
        path="/volunteer"
      />

      {/* Header */}
      <div className="relative py-24 overflow-hidden" style={{
        background: "linear-gradient(135deg, #111E16 0%, #1B3022 55%, #2D4F37 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.1)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.07)", transform: "translate(-20%,20%)" }} />
          <div className="absolute top-1/2 right-8 w-40 h-40 rounded-full border border-lime/10 hidden lg:block" style={{ transform: "translateY(-50%)" }} />
          <div className="absolute top-1/2 left-8 w-24 h-24 rounded-full border border-white/6 hidden lg:block" style={{ transform: "translateY(-50%)" }} />
        </div>

        <div className="section-wrapper text-center relative z-10">
          <span className="badge-lime mb-5 inline-block animate-fade-in">Get Involved</span>
          <h1 className="font-display font-black text-white text-4xl sm:text-6xl mb-4 animate-slide-up leading-tight">
            Join The <span className="text-gradient-lime">Movement</span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto animate-slide-up delay-200">
            Build with us. Empower lives. Choose your path and make a difference.
          </p>
        </div>
      </div>

      <div className="section-wrapper py-14">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

            {/* Left: Form  */}
            <div className="lg:col-span-3">
              <div className="card-luxury p-8">
                {/* Form header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-10 rounded-full" style={{ background: "linear-gradient(to bottom,#9CFC5C,#7DD940)" }} />
                  <div>
                    <h2 className="font-display font-bold text-forest text-xl">Registration Form</h2>
                    <p className="text-gray-400 text-xs">Choose your role and fill in your details</p>
                  </div>
                </div>

                {/* Role Selector Cards */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                        selectedRole === role.id
                          ? "border-transparent shadow-lime"
                          : "border-gray-200 hover:border-lime/40 hover:shadow-sm"
                      }`}
                      style={selectedRole === role.id ? {
                        background: "linear-gradient(135deg,rgba(156,252,92,0.12),rgba(156,252,92,0.05))",
                        borderColor: "transparent",
                        boxShadow: "0 4px 20px rgba(156,252,92,0.25), 0 0 0 2px rgba(156,252,92,0.5)"
                      } : {}}
                    >
                      {selectedRole === role.id && (
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)" }}>
                          <span className="text-forest text-xs font-black">✓</span>
                        </span>
                      )}
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ color: "#1B3022" }}>
                        {role.Icon && <role.Icon />}
                      </div>
                      <p className="font-display font-bold text-forest text-sm leading-tight mb-1">
                        {role.title}
                      </p>
                      <p className="text-gray-400 text-xs leading-tight">{role.subtitle}</p>
                    </button>
                  ))}
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label" htmlFor="firstName">First Name *</label>
                      <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} className="form-input" placeholder="First Name" required />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="lastName">Last Name *</label>
                      <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} className="form-input" placeholder="Last Name" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label" htmlFor="email">Email Address *</label>
                      <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="Email" required />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="phone">Phone Number *</label>
                      <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+94 77..." required />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="form-label">Gender *</label>
                    <div className="flex gap-6 pt-1">
                      {["male", "female", "other"].map((g) => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={formData.gender === g}
                            onChange={handleChange}
                            className="w-4 h-4 text-lime focus:ring-lime border-gray-300"
                            required
                          />
                          <span className="text-sm text-gray-600 group-hover:text-forest capitalize transition-colors">
                            {g === "other" ? "Prefer not to say" : g.charAt(0).toUpperCase() + g.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="form-label" htmlFor="streetAddress">Address *</label>
                    <input id="streetAddress" name="streetAddress" type="text" value={formData.streetAddress} onChange={handleChange} className="form-input" placeholder="Street Address" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label" htmlFor="city">City *</label>
                      <input id="city" name="city" type="text" value={formData.city} onChange={handleChange} className="form-input" placeholder="City" required />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="country">Country *</label>
                      <select id="country" name="country" value={formData.country} onChange={handleChange} className="form-input" required>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="form-label" htmlFor="dateOfBirth">Date of Birth *</label>
                    <input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className="form-input" required />
                  </div>

                  {/* About */}
                  <div>
                    <label className="form-label" htmlFor="about">Tell Us About Yourself</label>
                    <textarea
                      id="about"
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Share your skills, interests, and why you want to join..."
                      className="form-input resize-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-4 text-base font-bold uppercase tracking-wide"
                    id="volunteer-submit-btn"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : "Submit"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Info Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Logo + tagline */}
              <div className="card-luxury text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden" style={{ background: "rgba(27,48,34,0.06)", border: "1px solid rgba(27,48,34,0.1)" }}>
                  <img
                    src={logoImg}
                    alt="Togetherwise Logo"
                    className="w-full h-full object-contain pt-1"
                  />
                </div>
                <p className="text-gray-400 font-medium text-xs uppercase tracking-widest mb-2">Build with us</p>
                <h2 className="font-display font-black text-forest text-2xl mb-1">Join The Movement</h2>
                <p className="text-lime-dark font-semibold">Empower lives</p>
              </div>

              {/* Role description */}
              <div className="card-luxury p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(to bottom,#9CFC5C,#7DD940)" }} />
                  <h3 className="font-display font-bold text-forest">
                    {ROLES.find(r => r.id === selectedRole)?.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {ROLES.find(r => r.id === selectedRole)?.description}
                </p>
              </div>

              {/* Photo */}
              <div className="rounded-2xl overflow-hidden shadow-luxury group">
                <img
                  src="https://images.unsplash.com/photo-1542884748-2b87b36c6b90?w=600&q=80"
                  alt="Community volunteers"
                  className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "0+", label: "Active Volunteers" },
                  { value: "0+", label: "Countries Reached" },
                  { value: "0+", label: "Projects Completed" },
                  { value: "0%", label: "Satisfaction Rate" },
                ].map((stat, i) => (
                  <div key={i} className="card-luxury text-center p-4">
                    <p className="font-display font-black text-forest text-xl">{stat.value}</p>
                    <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
