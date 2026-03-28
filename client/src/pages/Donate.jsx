/**
 * Donate.jsx — Donation Page
 * Features: Amount selection buttons, Monthly/One-time toggle, donor form
 * Connected to paymentController.js backend endpoint
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const PRESET_AMOUNTS = [10, 25, 30, 50, 100];

const Donate = () => {
  const navigate = useNavigate();
  const [frequency, setFrequency] = useState("one-time"); // 'one-time' | 'monthly'
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    message: "",
    isAnonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get("/projects?status=active");
        if (res.data.success) {
          setProjects(res.data.projects);
        }
      } catch (err) {
        console.error("Could not fetch projects for donation dropdown:", err);
      }
    };
    fetchProjects();
  }, []);

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!finalAmount || finalAmount < 1) {
      setError("Please select or enter a valid donation amount.");
      return;
    }
    if (!formData.donorName || !formData.donorEmail) {
      setError("Please fill in your name and email.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit to the manual donation endpoint (payment gateway scaffold)
      await axiosInstance.post("/payment/manual", {
        amount: finalAmount,
        ...formData,
        frequency,
        projectId: selectedProject || null,
      });
      setSubmitted(true);
    } catch (err) {
      // Capture the error from the backend response
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || "Payment failed. Please try again! Ensure backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center animate-slide-up">
          <div className="w-20 h-20 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">💚</span>
          </div>
          <h2 className="font-display font-bold text-forest text-3xl mb-3">Thank You!</h2>
          <p className="text-gray-500 mb-2">
            Your {frequency} donation of{" "}
            <span className="text-forest font-bold">${finalAmount}</span>{" "}
            has been received.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            A confirmation will be sent to <strong>{formData.donorEmail}</strong>
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate("/")} className="btn-secondary flex-1 border-forest text-forest hover:bg-forest hover:text-white">
              Back to Home
            </button>
            <button onClick={() => { setSubmitted(false); setFormData({ donorName: "", donorEmail: "", donorPhone: "", message: "", isAnonymous: false }); setSelectedAmount(25); setCustomAmount(""); }}
              className="btn-primary flex-1">
              Donate Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="bg-forest py-16 text-center">
        <div className="section-wrapper">
          <span className="badge-lime mb-4 inline-block">Make a Difference</span>
          <h1 className="font-display font-black text-white text-4xl sm:text-5xl mb-4">
            Support Our Mission
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Every dollar you give goes directly toward empowering communities and transforming lives.
          </p>
        </div>
      </div>

      <div className="section-wrapper py-12">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8">

            {/* ── Frequency Toggle ───────────────────────────────────── */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
              <button
                type="button"
                onClick={() => setFrequency("one-time")}
                className={`flex-1 py-3 rounded-xl font-display font-semibold text-sm transition-all ${frequency === "one-time"
                  ? "bg-forest text-white shadow-md"
                  : "text-gray-500 hover:text-forest"
                  }`}
                id="one-time-btn"
              >
                One-Time
              </button>
              <button
                type="button"
                onClick={() => setFrequency("monthly")}
                className={`flex-1 py-3 rounded-xl font-display font-semibold text-sm transition-all ${frequency === "monthly"
                  ? "bg-forest text-white shadow-md"
                  : "text-gray-500 hover:text-forest"
                  }`}
                id="monthly-btn"
              >
                Monthly
              </button>
            </div>

            {/* ── Amount Selection ───────────────────────────────────── */}
            <div className="mb-6">
              <label className="form-label text-base">Select Amount</label>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-3 rounded-xl font-display font-bold text-sm transition-all border-2 ${selectedAmount === amount
                      ? "bg-lime border-lime-dark text-forest shadow-md scale-105"
                      : "border-gray-200 text-gray-700 hover:border-lime hover:text-forest"
                      }`}
                    id={`amount-${amount}-btn`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={handleCustomAmount}
                  min="1"
                  className="form-input pl-8"
                  id="custom-amount-input"
                />
              </div>
            </div>

            {/* ── Project Selection ──────────────────────────────────── */}
            <div className="mb-6">
              <label className="form-label" htmlFor="project-select">
                Where should your donation go? (Optional)
              </label>
              <select
                id="project-select"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="form-input bg-gray-50 border border-gray-200"
              >
                <option value="">General Fund (Area of greatest need)</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* ── Impact Preview ─────────────────────────────────────── */}
            {finalAmount > 0 && (
              <div className="bg-lime/10 border border-lime/30 rounded-2xl p-4 mb-6">
                <p className="text-forest font-semibold text-sm">
                  🌱 Your <strong>${finalAmount} {frequency}</strong> donation can provide{" "}
                  {finalAmount >= 100 ? "clean water for a family for 3 months" :
                    finalAmount >= 50 ? "school supplies for 5 children" :
                      finalAmount >= 25 ? "a week of meals for a family" :
                        "essential supplies for a community member"}.
                </p>
              </div>
            )}

            {/* ── Donor Information ──────────────────────────────────── */}
            <div className="space-y-4 mb-6">
              <h3 className="font-display font-bold text-forest text-lg">Your Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="donor-name">Full Name *</label>
                  <input
                    id="donor-name"
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleFormChange}
                    placeholder="John Smith"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="donor-phone">Phone</label>
                  <input
                    id="donor-phone"
                    type="tel"
                    name="donorPhone"
                    value={formData.donorPhone}
                    onChange={handleFormChange}
                    placeholder="+94 70 000 0000"
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="donor-email">Email Address *</label>
                <input
                  id="donor-email"
                  type="email"
                  name="donorEmail"
                  value={formData.donorEmail}
                  onChange={handleFormChange}
                  placeholder="example@example.com"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="donor-message">Message (optional)</label>
                <textarea
                  id="donor-message"
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Share why you're donating..."
                  className="form-input resize-none"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleFormChange}
                  className="w-4 h-4 rounded border-gray-300 text-lime focus:ring-lime cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-forest transition-colors">
                  Donate anonymously
                </span>
              </label>
            </div>

            {/* ── Error Message ──────────────────────────────────────── */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            {/* ── Submit Button ──────────────────────────────────────── */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
              id="donate-submit-btn"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                `Donate $${finalAmount || 0} ${frequency === "monthly" ? "/ Month" : "Now"} ↗`
              )}
            </button>

            <p className="text-center text-gray-400 text-xs mt-4">
              🔒 Secure, encrypted transaction. Your data is protected.
            </p>
          </form>

          {/* ── Payment Methods Note ─────────────────────────────────── */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-3">Coming soon: Online payment options</p>
            <div className="flex justify-center items-center gap-4 opacity-50">
              <span className="font-bold text-gray-500 text-sm">VISA</span>
              <span className="font-bold text-yellow-500 text-sm">Mastercard</span>
              <span className="font-bold text-blue-500 text-sm">PayPal</span>
              <span className="font-bold text-purple-500 text-sm">Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
