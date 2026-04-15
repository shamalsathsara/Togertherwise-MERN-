/**
 * Footer.jsx — Global Footer Component
 * Contains: Logo, contact info, social links, Privacy Policy modal trigger,
 * subscribe form, and "Stay in the Loop" section.
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import logoImg from "../image/logo.png";
import axiosInstance from "../api/axiosInstance";

const Footer = () => {
  const { t } = useTranslation();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (subscribeEmail) {
      try {
        const response = await axiosInstance.post("/subscribers", { email: subscribeEmail });
        setSubscribeStatus(response.data.message || t('footer_subSuccess'));
      } catch (err) {
        setSubscribeStatus(t('footer_subError'));
      }
      setSubscribeEmail("");
      setTimeout(() => setSubscribeStatus(""), 3000);
    }
  };

  const socialLinks = [
    {
      id: "facebook",
      label: "Facebook",
      href: "https://facebook.com/Togertherwerise",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z" />
        </svg>
      ),
    },
    {
      id: "twitter",
      label: "Twitter / X",
      href: "https://twitter.com/Togertherwerise",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://instagram.com/Togertherwerise",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com/company/Togertherwerise",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      id: "youtube",
      label: "YouTube",
      href: "https://youtube.com/@Togertherwerise",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
        </svg>
      ),
    },
  ];

  const quickLinks = [
    { to: "/", label: t('footer_home') },
    { to: "/campaigns", label: t('footer_campaigns') },
    { to: "/success-stories", label: t('footer_successStories') },
    { to: "/transparency", label: t('footer_transparency') },
    { to: "/volunteer", label: t('footer_volunteer') },
    { to: "/donate", label: t('footer_donate') },
    { to: "/about", label: t('footer_aboutUs') },
  ];

  return (
    <>
      {/* ── Subscribe Banner ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #111E16 0%, #1B3022 60%, #2D4F37 100%)"
      }}>
        {/* Decorative corners */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(156,252,92,0.08)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: "rgba(156,252,92,0.05)", transform: "translate(-20%, 20%)" }} />

        <div className="section-wrapper py-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <p className="text-white font-display font-black text-2xl leading-none">
              {t('footer_stayLoop')}
            </p>
            <p className="text-white/50 text-sm mt-1">{t('footer_getUpdates')}</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder={t('footer_emailPlaceholder')}
              className="flex-1 sm:w-72 px-4 py-3 rounded-xl bg-white/8 border border-white/15
                         text-white placeholder-white/40 text-sm focus:outline-none focus:border-lime
                         focus:bg-white/12 transition-all"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <button type="submit" className="btn-primary text-sm px-5 py-3 whitespace-nowrap">
              {t('footer_subscribeBtn')}
            </button>
          </form>
          {subscribeStatus && (
            <p className="text-lime text-sm font-medium animate-fade-in">{subscribeStatus}</p>
          )}
        </div>
      </div>

      {/* ── Main Footer ────────────────────────────────────────────────── */}
      <footer className="relative overflow-hidden text-white" style={{
        background: "linear-gradient(180deg, #1B3022 0%, #111E16 100%)"
      }}>
        {/* Decorative mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.04)", transform: "translate(-30%, -30%)" }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(45,79,55,0.3)", transform: "translate(20%, 20%)" }} />
          {/* Geometric rings */}
          <div className="absolute top-16 right-16 w-48 h-48 rounded-full border border-white/4 hidden xl:block" />
          <div className="absolute bottom-20 left-16 w-32 h-32 rounded-full border border-lime/6 hidden xl:block" />
        </div>

        <div className="section-wrapper py-14 relative z-10">
          {/* Top luxury divider */}
          <div className="luxury-divider mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* ── Brand Column ─────────────────────────────────────────── */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
                <div className="w-12 h-12 rounded-xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  {/* Replace this src with your actual logo path, e.g., src="/logo.png" */}
                  <img
                    src={logoImg}
                    alt="Togertherwerise Logo"
                    className="w-full h-full object-contain pt-1 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div>
                  <span className="font-display font-bold text-white text-xl leading-none block">
                    TogetherWE<span className="text-lime">rise</span>
                  </span>
                  <span className="text-xs text-white/40 tracking-wide uppercase">
                    Empowering Communities
                  </span>
                </div>
              </Link>

              <p className="text-white/55 text-sm leading-relaxed max-w-xs mb-7">
                {t('footer_desc')}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href="https://maps.app.goo.gl/ZoyftZRjV1BuHpMf8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/55 hover:text-lime transition-colors group"
                >
                  <span className="mt-0.5 flex-shrink-0 text-lime/60">📍</span>
                  <span className="text-sm">{t('footer_address')}</span>
                </a>
                <a
                  href="mailto:donation23@gmail.com"
                  className="flex items-center gap-3 text-white/55 hover:text-lime transition-colors"
                >
                  <span className="text-lime/60">📩</span>
                  <span className="text-sm">thilan9109@gmail.com</span>
                </a>
                <a
                  href="tel:+94772581698"
                  className="flex items-center gap-3 text-white/55 hover:text-lime transition-colors"
                >
                  <span className="text-lime/60">📞</span>
                  <span className="text-sm">+94 778821632</span>
                </a>
              </div>
            </div>

            {/* ── Quick Links ───────────────────────────────────────────── */}
            <div>
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-5">
                {t('footer_quickLinks')}
              </h3>
              <ul className="space-y-2.5">
                {quickLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-white/55 hover:text-lime text-sm transition-all duration-200
                                 flex items-center gap-2.5 group"
                    >
                      <span className="w-4 h-0.5 rounded-full bg-lime/30 group-hover:bg-lime group-hover:w-6 transition-all duration-300" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Social & Legal ────────────────────────────────────────── */}
            <div>
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-5">
                {t('footer_followUs')}
              </h3>
              <div className="flex flex-wrap gap-2.5 mb-8">
                {socialLinks.map(({ id, href, label, icon }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl flex items-center justify-center
                               text-white/60 hover:text-forest
                               transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.1)"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "linear-gradient(135deg,#9CFC5C,#7DD940)";
                      e.currentTarget.style.border = "1px solid transparent";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(156,252,92,0.3)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-white/55 hover:text-lime text-sm transition-colors underline-offset-2 hover:underline"
                  id="privacy-policy-btn"
                >
                  {t('footer_privacy')}
                </button>
                <span className="text-white/20 mx-2">/</span>
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-white/55 hover:text-lime text-sm transition-colors underline-offset-2 hover:underline"
                >
                  {t('footer_terms')}
                </button>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ─────────────────────────────────────────────── */}
          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} {t('footer_rights')}
            </p>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-lime/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              </div>
              <p className="text-white/30 text-xs">{t('footer_madeWithLove')}</p>
            </div>
            <p className="text-white/30 text-xs">
              {/*Registered NGO — Sri Lanka*/}
            </p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
};

export default Footer;
