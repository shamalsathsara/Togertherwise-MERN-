/**
 * Donate.jsx — Donation Page
 * Features: Amount selection buttons, Monthly/One-time toggle, donor form
 * Connected to paymentController.js backend endpoint
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import SEO from "../components/SEO";
import { useTranslation } from "react-i18next";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

const Donate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [frequency, setFrequency] = useState("one-time"); // 'one-time' | 'monthly'
  const [selectedAmount, setSelectedAmount] = useState(1000);
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
      setError(t('donate_error'));
      return;
    }
    if (!formData.donorName || !formData.donorEmail) {
      setError(t('donate_error2'));
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
      setError(serverMessage || t('donate_fail'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{
        background: "linear-gradient(135deg, #f5f8f5 0%, #eef4ef 100%)"
      }}>
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.08)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(27,48,34,0.05)", transform: "translate(-30%,30%)" }} />
        </div>

        <div className="card-luxury p-12 max-w-md w-full text-center animate-slide-up relative z-10">
          {/* Success icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse-ring" style={{ background: "linear-gradient(135deg,rgba(156,252,92,0.2),rgba(156,252,92,0.1))" }}>
              <span className="text-5xl">💚</span>
            </div>
          </div>

          <h2 className="font-display font-bold text-forest text-3xl mb-3">{t('donate_thankTitle')}</h2>
          <p className="text-gray-500 mb-2">
            {t('donate_thank1')}{frequency === 'monthly' ? t('donate_optMonthly') : t('donate_optOneTime')}
            {t('donate_thank2')}
            <span className="text-forest font-bold">${finalAmount}</span>{" "}
            {t('donate_thank3')}
          </p>
          <p className="text-gray-400 text-sm mb-8">
            {t('donate_thank4')}<strong>{formData.donorEmail}</strong>
          </p>

          {/* Divider */}
          <div className="luxury-divider mb-8" />

          <div className="flex gap-3">
            <button onClick={() => navigate("/")} className="btn-secondary flex-1 border-forest/30 text-forest hover:bg-forest hover:text-white" style={{ borderColor: "rgba(27,48,34,0.3)" }}>
              {t('donate_backHome')}
            </button>
            <button onClick={() => { setSubmitted(false); setFormData({ donorName: "", donorEmail: "", donorPhone: "", message: "", isAnonymous: false }); setSelectedAmount(1000); setCustomAmount(""); }}
              className="btn-primary flex-1">
              {t('donate_again')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #f5f8f5 0%, #eef4ef 100%)" }}>
      <SEO
        title="Support Our Mission"
        description="Every rupee you give goes directly toward empowering communities and transforming lives. Support Togertherwerise today."
        path="/donate"
      />

      {/*  Page Header  */}
      <div className="relative py-24 text-center overflow-hidden" style={{
        background: "linear-gradient(135deg, #111E16 0%, #1B3022 55%, #2D4F37 100%)"
      }}>
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.1)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl" style={{ background: "rgba(156,252,92,0.07)", transform: "translate(-20%,20%)" }} />
          <div className="absolute top-1/2 right-8 w-32 h-32 rounded-full border border-lime/10 hidden lg:block" style={{ transform: "translateY(-50%)" }} />
          <div className="absolute top-1/2 left-8 w-20 h-20 rounded-full border border-white/6 hidden lg:block" style={{ transform: "translateY(-50%)" }} />
        </div>

        <div className="section-wrapper relative z-10">
          <span className="badge-lime mb-5 inline-block animate-fade-in">{t('donate_badge')}</span>
          <h1 className="font-display font-black text-white text-4xl sm:text-5xl mb-4 animate-slide-up leading-tight">
            {t('donate_hero1')}<span className="text-gradient-lime">{t('donate_hero2')}</span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto animate-slide-up delay-200">
            {t('donate_heroDesc')}
          </p>
        </div>
      </div>

      <div className="section-wrapper py-14">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="card-luxury p-8">
            {/* Form header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-10 rounded-full" style={{ background: "linear-gradient(to bottom,#9CFC5C,#7DD940)" }} />
              <div>
                <h2 className="font-display font-bold text-forest text-xl">{t('donate_formTitle')}</h2>
                <p className="text-gray-400 text-xs">{t('donate_secure')}</p>
              </div>
            </div>

            {/*  Frequency Toggle */}
            <div className="flex rounded-2xl p-1 mb-8" style={{ background: "rgba(27,48,34,0.06)" }}>
              <button
                type="button"
                onClick={() => setFrequency("one-time")}
                className={`flex-1 py-3 rounded-xl font-display font-semibold text-sm transition-all duration-300 ${frequency === "one-time"
                  ? "text-white shadow-forest"
                  : "text-gray-500 hover:text-forest"
                  }`}
                style={frequency === "one-time" ? {
                  background: "linear-gradient(135deg,#1B3022,#2D4F37)",
                  boxShadow: "0 4px 16px rgba(27,48,34,0.3)"
                } : {}}
                id="one-time-btn"
              >
                {t('donate_optOneTime')}
              </button>
              <button
                type="button"
                onClick={() => setFrequency("monthly")}
                className={`flex-1 py-3 rounded-xl font-display font-semibold text-sm transition-all duration-300 ${frequency === "monthly"
                  ? "text-white shadow-forest"
                  : "text-gray-500 hover:text-forest"
                  }`}
                style={frequency === "monthly" ? {
                  background: "linear-gradient(135deg,#1B3022,#2D4F37)",
                  boxShadow: "0 4px 16px rgba(27,48,34,0.3)"
                } : {}}
                id="monthly-btn"
              >
                {t('donate_optMonthly')}
              </button>
            </div>

            {/*  Amount Selection */}
            <div className="mb-6">
              <label className="form-label text-base">{t('donate_selectAmt')}</label>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-3 rounded-xl font-display font-bold text-sm transition-all duration-200 border-2 ${
                      selectedAmount === amount
                        ? "border-transparent text-forest shadow-lime"
                        : "border-gray-200 text-gray-700 hover:border-lime/40 hover:text-forest"
                    }`}
                    style={selectedAmount === amount ? {
                      background: "linear-gradient(135deg,#9CFC5C,#7DD940)",
                      boxShadow: "0 4px 16px rgba(156,252,92,0.4)",
                      transform: "scale(1.05)"
                    } : {}}
                    id={`amount-${amount}-btn`}
                  >
                    LKR {amount.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">LKR</span>
                <input
                  type="number"
                  placeholder={t('donate_customAmt')}
                  value={customAmount}
                  onChange={handleCustomAmount}
                  min="1"
                  className="form-input pl-14"
                  id="custom-amount-input"
                />
              </div>
            </div>

            {/*  Project Selection  */}
            <div className="mb-6">
              <label className="form-label" htmlFor="project-select">
                {t('donate_projectLabel')}
              </label>
              <select
                id="project-select"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="form-input"
              >
                <option value="">{t('donate_projectGen')}</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/*  Impact Preview  */}
            {finalAmount > 0 && (
              <div className="rounded-2xl p-4 mb-6 border" style={{
                background: "linear-gradient(135deg,rgba(156,252,92,0.08),rgba(156,252,92,0.04))",
                borderColor: "rgba(156,252,92,0.25)"
              }}>
                <p className="text-forest font-semibold text-sm">
                  {t('donate_impact1')}<strong>${finalAmount} {frequency === "monthly" ? t('donate_optMonthly') : t('donate_optOneTime')}</strong>{t('donate_impact2')}
                  {finalAmount >= 100 ? t('donate_lvl1') :
                    finalAmount >= 50 ? t('donate_lvl2') :
                      finalAmount >= 25 ? t('donate_lvl3') :
                        t('donate_lvl4')}.
                </p>
              </div>
            )}

            {/*  Donor Information  */}
            <div className="space-y-4 mb-6">
              <h3 className="font-display font-bold text-forest text-lg">{t('donate_detailTitle')}</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="donor-name">{t('donate_fname')}</label>
                  <input
                    id="donor-name"
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="donor-phone">{t('donate_phone')}</label>
                  <input
                    id="donor-phone"
                    type="tel"
                    name="donorPhone"
                    value={formData.donorPhone}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="donor-email">{t('donate_email')}</label>
                <input
                  id="donor-email"
                  type="email"
                  name="donorEmail"
                  value={formData.donorEmail}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="donor-message">{t('donate_msgLabel')}</label>
                <textarea
                  id="donor-message"
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder={t('donate_msgPh')}
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
                  {t('donate_anon')}
                </span>
              </label>
            </div>

            {/*  Error Message  */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            {/*  Submit Button  */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
              id="donate-submit-btn"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                  {t('donate_processing')}
                </span>
              ) : (
                `${t('donate_submit1')}${finalAmount || 0}${frequency === "monthly" ? t('donate_submit2_month') : t('donate_submit2_now')}`
              )}
            </button>

            <p className="text-center text-gray-400 text-xs mt-4">
              {t('donate_secureTxt')}
            </p>
          </form>

          {/*  Payment Methods Note  */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-3">{t('donate_comingSoon')}</p>
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
