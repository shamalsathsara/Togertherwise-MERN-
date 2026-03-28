/**
 * Navbar.jsx — Global Navigation Header
 * Features: Logo, nav links, Language Toggle (En/Sn), and Donate Now CTA button.
 * Becomes fixed/transparent on scroll, with a white background when scrolled.
 */

import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

// Language translations for the toggle
const translations = {
  en: {
    home: "Home",
    campaigns: "Campaigns",
    successStories: "Success Stories",
    aboutUs: "About Us",
    donateNow: "Donate Now",
    transparency: "Transparency",
    join: "Join Us",
  },
  sn: {
    home: "මුල් පිටුව",
    campaigns: "ව්‍යාපාර",
    successStories: "සාර්ථක කථා",
    aboutUs: "අප ගැන",
    donateNow: "දැන් පරිත්‍යාග කරන්න",
    transparency: "විනිවිදභාවය",
    join: "එකතු වන්න",
  },
};

const Navbar = ({ lang, setLang }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const t = translations[lang];

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: t.home },
    { to: "/campaigns", label: t.campaigns },
    { to: "/success-stories", label: t.successStories },
    { to: "/transparency", label: t.transparency },
    { to: "/about", label: t.aboutUs },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/95 backdrop-blur-sm py-3"
        }`}
    >
      <nav className="section-wrapper flex items-center justify-between">
        {/* ── Logo ───────────────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2 group">
          {/* SVG Logo — Hands reaching up with leaf motif */}
          <div className="w-10 h-10 relative">
            {/* Replace this src with your actual logo path, e.g., src="/logo.png" */}
            <img 
              src="https://placehold.co/100x100?text=Logo" 
              alt="Togetherwise Logo" 
              className="w-full h-full object-contain pt-1"
            />
          </div>
          <div>
            <span className="font-display font-bold text-forest text-lg leading-none block">
              Together<span className="text-lime-dark">wise</span>
            </span>
            <span className="text-[10px] text-gray-400 tracking-wide uppercase leading-none">
              Empowering Communities
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav Links ───────────────────────────────────────────── */}
        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `nav-link text-sm ${isActive ? "nav-link-active" : ""}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ── Right Controls ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "sn" : "en")}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200
                       text-xs font-semibold text-gray-600 hover:border-forest hover:text-forest
                       transition-all duration-200"
            aria-label="Toggle language"
          >
            <span className={lang === "en" ? "text-forest font-bold" : "text-gray-400"}>En</span>
            <span className="text-gray-300">|</span>
            <span className={lang === "sn" ? "text-forest font-bold" : "text-gray-400"}>සිං</span>
          </button>

          {/* Donate Now CTA */}
          <button
            onClick={() => navigate("/donate")}
            className="btn-primary text-sm px-5 py-2.5"
            id="navbar-donate-btn"
          >
            {t.donateNow}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1">
              <span className={`block h-0.5 bg-forest transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block h-0.5 bg-forest transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-forest transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ──────────────────────────────────────────────────── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-forest text-white" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {/* Mobile Language Toggle */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === "en" ? "bg-forest text-white" : "bg-gray-100 text-gray-500"
                }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("sn")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === "sn" ? "bg-forest text-white" : "bg-gray-100 text-gray-500"
                }`}
            >
              සිංහල
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
