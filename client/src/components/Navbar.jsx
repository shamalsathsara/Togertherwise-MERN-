/**
 * Navbar.jsx — Global Navigation Header
 * Includes: Top announcement bar + sticky glassmorphism nav
 */

import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoImg from "../image/logo.png";

const Navbar = ({ lang, setLang }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: t('nav_home') },
    { to: "/campaigns", label: t('nav_campaigns') },
    { to: "/success-stories", label: t('nav_successStories') },
    { to: "/transparency", label: t('nav_transparency') },
    { to: "/about", label: t('nav_aboutUs') },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">

      {/* ══ Top Announcement Bar ════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden transition-all duration-500"
        style={{
          background: "linear-gradient(135deg, #0D1F13 0%, #1B3022 60%, #2D4F37 100%)",
          height: isScrolled ? "0px" : "36px",
          opacity: isScrolled ? 0 : 1,
        }}
      >
        <div className="section-wrapper h-full flex items-center justify-between text-xs">
          {/* Left: welcome text */}
          <div className="flex items-center gap-4 text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              {t('nav_welcome')}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-white/40">
              <span>📍</span> {t('nav_location')}
            </span>
          </div>
          {/* Right: social icons + language */}
          <div className="flex items-center gap-4">
            <span className="text-white/40 hidden sm:block">{t('nav_followUs')}</span>
            {[
              { label: "Facebook", href: "https://facebook.com", icon: "f" },
              { label: "Twitter", href: "https://twitter.com", icon: "𝕏" },
              { label: "Instagram", href: "https://instagram.com", icon: "◈" },
              { label: "YouTube", href: "https://youtube.com", icon: "▶" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="text-white/50 hover:text-lime transition-colors text-sm font-bold"
                aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(156,252,92,0.25), transparent)" }} />
      </div>

      {/* ══ Main Navigation Bar ════════════════════════════════════════ */}
      <nav
        className="transition-all duration-400"
        style={{
          background: isScrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.98)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: isScrolled ? "1px solid rgba(27,48,34,0.1)" : "1px solid rgba(27,48,34,0.06)",
          boxShadow: isScrolled ? "0 4px 24px rgba(27,48,34,0.1)" : "none",
          padding: isScrolled ? "10px 0" : "14px 0",
        }}
      >
        <div className="section-wrapper flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img
              src={logoImg}
              alt="TogetherWErise Logo"
              className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div>
              <span className="font-display font-black text-forest text-xl leading-none block">
                TogetherWE<span style={{ color: "#7DD940" }}>rise</span>
              </span>
              <span className="text-[9px] text-gray-400 tracking-widest uppercase leading-none">
                Empowering Communities
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `relative text-sm font-semibold px-3.5 py-2 rounded-lg transition-all duration-200 block
                    ${isActive ? "text-forest bg-forest/6" : "text-gray-600 hover:text-forest hover:bg-forest/5"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                          style={{ background: "linear-gradient(90deg,#9CFC5C,#7DD940)" }} />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => {
                const newLang = lang === "en" ? "sn" : "en";
                setLang(newLang);
                i18n.changeLanguage(newLang === "sn" ? "si" : "en");
              }}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-forest transition-all duration-200 hover:bg-forest/5"
              style={{ border: "1px solid rgba(27,48,34,0.12)" }}
              aria-label="Toggle language"
            >
              <span style={{ color: lang === "en" ? "#1B3022" : "" }}>En</span>
              <span className="text-gray-300 mx-0.5">|</span>
              <span style={{ color: lang === "sn" ? "#1B3022" : "" }}>සිං</span>
            </button>

            {/* Donate Now CTA */}
            <button
              onClick={() => navigate("/donate")}
              id="navbar-donate-btn"
              className="inline-flex items-center gap-2 font-display font-bold text-forest text-sm px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#9CFC5C,#7DD940)",
                boxShadow: "0 4px 16px rgba(156,252,92,0.4)"
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(156,252,92,0.6)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(156,252,92,0.4)"}
            >
              <span className="w-6 h-6 rounded-full bg-forest/15 flex items-center justify-center text-xs">↗</span>
              {t('nav_donateNow')}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-forest/5 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span className={`block h-0.5 rounded-full bg-forest transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block h-0.5 rounded-full bg-forest transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block h-0.5 rounded-full bg-forest transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-400 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="border-t px-4 py-4 space-y-1"
            style={{ background: "rgba(255,255,255,0.99)", borderColor: "rgba(27,48,34,0.08)" }}>
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? "bg-forest text-white" : "text-gray-700 hover:bg-forest/5 hover:text-forest"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {/* Language toggle mobile */}
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => { setLang("en"); i18n.changeLanguage("en"); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${lang === "en" ? "bg-forest text-white" : "bg-gray-100 text-gray-500"}`}>
                English
              </button>
              <button 
                onClick={() => { setLang("sn"); i18n.changeLanguage("si"); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${lang === "sn" ? "bg-forest text-white" : "bg-gray-100 text-gray-500"}`}>
                සිංහල
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
