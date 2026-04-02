/**
 * Footer.jsx — Global Footer Component
 * Contains: Logo, contact info, social links, Privacy Policy modal trigger,
 * subscribe form, and "Stay in the Loop" section.
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import logoImg from "../image/logo.png";
import axiosInstance from "../api/axiosInstance";

const Footer = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (subscribeEmail) {
      try {
        const response = await axiosInstance.post("/subscribers", { email: subscribeEmail });
        setSubscribeStatus(response.data.message || "Thank you for subscribing! 🎉");
      } catch (err) {
        setSubscribeStatus("Failed to subscribe. Please try again.");
      }
      setSubscribeEmail("");
      setTimeout(() => setSubscribeStatus(""), 3000);
    }
  };

  const socialLinks = [
    {
      id: "facebook",
      label: "Facebook",
      href: "https://facebook.com/togetherwise",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z" />
        </svg>
      ),
    },
    {
      id: "twitter",
      label: "Twitter / X",
      href: "https://twitter.com/togetherwise",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://instagram.com/togetherwise",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com/company/togetherwise",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      id: "youtube",
      label: "YouTube",
      href: "https://youtube.com/@togetherwise",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
        </svg>
      ),
    },
  ];

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/campaigns", label: "Campaigns" },
    { to: "/success-stories", label: "Success Stories" },
    { to: "/transparency", label: "Transparency" },
    { to: "/volunteer", label: "Volunteer" },
    { to: "/donate", label: "Donate" },
    { to: "/about", label: "About Us" },
  ];

  return (
    <>
      {/* ── Subscribe Banner ───────────────────────────────────────────── */}
      <div className="bg-forest-dark">
        <div className="section-wrapper py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white font-display font-bold text-xl uppercase tracking-wider">
            Stay in the Loop
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 sm:w-72 px-4 py-2.5 rounded-full bg-white/10 border border-white/20
                         text-white placeholder-white/50 text-sm focus:outline-none focus:border-lime
                         focus:bg-white/20 transition-all"
            />
            <button type="submit" className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap">
              Subscribe ↗
            </button>
          </form>
          {subscribeStatus && (
            <p className="text-lime text-sm font-medium">{subscribeStatus}</p>
          )}
        </div>
      </div>

      {/* ── Main Footer ────────────────────────────────────────────────── */}
      <footer className="bg-forest text-white">
        <div className="section-wrapper py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* ── Brand Column ─────────────────────────────────────────── */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 mb-4 group">
                <div className="w-12 h-12">
                  {/* Replace this src with your actual logo path, e.g., src="/logo.png" */}
                  <img
                    src={logoImg}
                    alt="Togetherwise Logo"
                    className="w-full h-full object-contain pt-1"
                  />
                </div>
                <div>
                  <span className="font-display font-bold text-white text-xl leading-none block">
                    Together<span className="text-lime">wise</span>
                  </span>
                  <span className="text-xs text-white/50 tracking-wide uppercase">
                    Empowering Communities
                  </span>
                </div>
              </Link>

              <p className="text-white/70 text-sm leading-relaxed max-w-xs mb-6">
                Village to Global is dedicated to supporting organizations and local initiatives
                that uplift communities worldwide through sustainable development.
              </p>

              {/* Contact Info */}
              <div className="space-y-2.5">
                <a
                  href="https://maps.app.goo.gl/ZoyftZRjV1BuHpMf8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/70 hover:text-lime transition-colors group"
                >
                  <span className="mt-0.5 flex-shrink-0">📍</span>
                  <span className="text-sm">No 1/C Singhapura Hokandara South</span>
                </a>
                <a
                  href="mailto:donation23@gmail.com"
                  className="flex items-center gap-3 text-white/70 hover:text-lime transition-colors"
                >
                  <span>📩</span>
                  <span className="text-sm">thilan9109@gmail.com</span>
                </a>
                <a
                  href="tel:+94772581698"
                  className="flex items-center gap-3 text-white/70 hover:text-lime transition-colors"
                >
                  <span>📞</span>
                  <span className="text-sm">+94 778821632</span>
                </a>
              </div>
            </div>

            {/* ── Quick Links ───────────────────────────────────────────── */}
            <div>
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-white/70 hover:text-lime text-sm transition-colors
                                 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-lime/50 group-hover:bg-lime transition-colors" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Social & Legal ────────────────────────────────────────── */}
            <div>
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-3 mb-8">
                {socialLinks.map(({ id, href, label, icon }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                               text-white/70 hover:bg-lime hover:text-forest
                               transition-all duration-200 hover:scale-110"
                  >
                    {icon}
                  </a>
                ))}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-white/70 hover:text-lime text-sm transition-colors underline-offset-2 hover:underline"
                  id="privacy-policy-btn"
                >
                  Privacy Policy
                </button>
                <span className="text-white/30 mx-2">/</span>
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-white/70 hover:text-lime text-sm transition-colors underline-offset-2 hover:underline"
                >
                  Terms
                </button>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ─────────────────────────────────────────────── */}
          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row
                          items-center justify-between gap-3">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Togetherwise. All rights reserved.
            </p>
            <p className="text-white/40 text-xs">
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
