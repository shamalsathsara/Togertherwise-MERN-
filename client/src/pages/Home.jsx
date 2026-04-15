/**
 * Home.jsx — Landing Page (Split-Hero Diagonal Design)
 * Sections: Hero (split layout), Impact Stats, Mission, Campaigns,
 *           Success Stories, How It Works, News & Updates, CTA Banner
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import axiosInstance from "../api/axiosInstance";
import SEO from "../components/SEO";

// ─── Hero thumbnail images ─────────────────────────────────────────────────────
const heroThumbs = [
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80", alt: "Kids smiling" },
  { src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&q=80", alt: "Clean water" },
  { src: "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?w=400&q=80", alt: "Community" },
];

// ─── Hero slides (full right-panel image) ─────────────────────────────────────
const heroSlides = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=85",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=85",
  "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&q=85",
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&q=85",
];

// ─── How It Works steps ────────────────────────────────────────────────────────
const HOW_STEPS = [
  { num: "01", icon: "🎯", title: "Choose a Cause", desc: "Browse active campaigns and select the cause that resonates with you." },
  { num: "02", icon: "💳", title: "Make a Donation", desc: "Securely donate any amount — every contribution creates real impact." },
  { num: "03", icon: "🌱", title: "Track Impact", desc: "See exactly how your donation is used via our transparency dashboard." },
  { num: "04", icon: "🤝", title: "Join the Community", desc: "Volunteer, fundraise, and grow alongside thousands of changemakers." },
];

// ─── Campaign Card ─────────────────────────────────────────────────────────────
const CampaignCard = ({ campaign }) => {
  const percent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
  return (
    <div className="group overflow-hidden rounded-2xl bg-white transition-all duration-300"
      style={{ boxShadow: "0 4px 24px rgba(27,48,34,0.08)", border: "1px solid rgba(27,48,34,0.06)" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(27,48,34,0.14)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(27,48,34,0.08)"; }}>
      <div className="relative h-48 overflow-hidden">
        <img src={campaign.image} alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(27,48,34,0.7), transparent)" }} />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-forest"
          style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)", boxShadow: "0 2px 8px rgba(156,252,92,0.4)" }}>
          {campaign.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-forest text-base mb-2 line-clamp-1">{campaign.title}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{campaign.description}</p>
        <div className="mb-4">
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-gray-500">Raised: <span className="text-forest">${campaign.raised.toLocaleString()}</span></span>
            <span style={{ color: "#7DD940" }}>{percent}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${percent}%`, background: "linear-gradient(90deg,#9CFC5C,#7DD940)", boxShadow: "0 0 8px rgba(156,252,92,0.4)" }} />
          </div>
        </div>
        <button onClick={() => window.location.href = "/donate"}
          className="w-full py-2.5 rounded-xl font-display font-bold text-sm text-forest transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)", boxShadow: "0 4px 16px rgba(156,252,92,0.3)" }}>
          Donate Now ↗
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Home = ({ lang }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liveStories, setLiveStories] = useState([]);
  const [liveCampaigns, setLiveCampaigns] = useState([]);
  const [liveStats, setLiveStats] = useState([]);
  const [liveNews, setLiveNews] = useState([]);

  const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.3, triggerOnce: true });

  // Auto-advance hero slideshow
  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const storiesRes = await axiosInstance.get("/success-stories/featured");
        if (storiesRes.data.success && storiesRes.data.data.length > 0) setLiveStories(storiesRes.data.data);

        const projectsRes = await axiosInstance.get("/projects?status=active");
        if (projectsRes.data.success) setLiveCampaigns(projectsRes.data.projects.slice(0, 4));

        const statsRes = await axiosInstance.get("/projects/public-stats");
        if (statsRes.data.success) {
          const s = statsRes.data.stats;
          setLiveStats([
            { value: s.completed, suffix: "+", label: "home_stat_completed", icon: "✅" },
            { value: s.active, suffix: "+", label: "home_stat_active", icon: "🤝" },
            { value: s.total, suffix: "+", label: "home_stat_total", icon: "📋" },
            { value: s.featured, suffix: "+", label: "home_stat_featured", icon: "🌟" },
          ]);
        }

        const newsRes = await axiosInstance.get("/news");
        if (newsRes.data.success) setLiveNews(newsRes.data.data);
      } catch (err) {
        console.error("Failed to fetch home data", err);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div style={{ background: "#ffffff" }}>
      <SEO
        title="Empowering Communities"
        description="Togetherwise — From village to global. Join us in transforming lives through donations, volunteering, and community empowerment."
        path="/"
      />

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* HERO — SPLIT DIAGONAL LAYOUT                                   */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[85vh] lg:h-[80vh] min-h-[660px] overflow-hidden flex flex-col">

        {/* ── Split layout container ──────────────────────────────────── */}
        <div className="flex flex-1 h-full">

          {/* LEFT PANEL — Forest Green Content */}
          <div className="relative z-10 flex flex-col justify-center w-full lg:w-[52%] px-8 sm:px-14 lg:px-20 pt-16 xl:pt-24 pb-8 xl:pb-12"
            style={{ background: "linear-gradient(160deg, #0D1F13 0%, #1B3022 55%, #243D2C 100%)" }}>

            {/* Decorative corner top-left */}
            <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none" style={{ background: "radial-gradient(circle at 0% 0%, rgba(156,252,92,0.12) 0%, transparent 65%)" }} />
            {/* Decorative dots */}
            <div className="absolute bottom-24 left-8 grid grid-cols-5 gap-2.5 opacity-20 pointer-events-none hidden lg:grid">
              {Array.from({ length: 20 }).map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-lime" />)}
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full w-fit px-4 py-1.5 mt-6 lg:mt-8 mb-6 xl:mb-8 animate-fade-in"
              style={{ background: "rgba(156,252,92,0.12)", border: "1px solid rgba(156,252,92,0.3)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              <span className="text-lime text-sm font-medium">{t('home_badge')}</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display font-black text-white leading-[1.05] mb-6 animate-slide-up"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}>
              {t('home_hero1')}
              <span style={{ color: "#9CFC5C" }}>{t('home_hero2')}</span>{t('home_hero3')}
              <br className="hidden sm:block" />
              {t('home_hero4')}
            </h1>

            <p className="text-white/65 text-lg leading-relaxed mb-6 xl:mb-10 max-w-lg animate-slide-up delay-200">
              {t('home_heroDesc')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8 xl:mb-14 animate-slide-up delay-300">
              <button onClick={() => navigate("/campaigns")}
                id="hero-explore-btn"
                className="inline-flex items-center gap-3 font-display font-bold text-forest px-7 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-1"
                style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)", boxShadow: "0 6px 24px rgba(156,252,92,0.45)" }}>
                <span className="w-8 h-8 rounded-full bg-forest/20 flex items-center justify-center text-sm">→</span>
                {t('home_exploreBtn')}
              </button>
              <button onClick={() => navigate("/donate")}
                id="hero-donate-btn"
                className="inline-flex items-center gap-2 font-display font-bold text-white px-7 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                style={{ border: "2px solid rgba(255,255,255,0.35)" }}>
                {t('home_donateBtn')}
              </button>
            </div>

            {/* Thumbnail strip — small photos at hero bottom */}
            <div className="flex gap-3 animate-fade-in delay-500 lg:-translate-y-8">
              {heroThumbs.map((t, i) => (
                <div key={i} className="relative group cursor-pointer"
                  style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="w-28 h-20 rounded-xl overflow-hidden"
                    style={{ border: "2px solid rgba(156,252,92,0.3)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
                    <img src={t.src} alt={t.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  {/* Lime overlay on hover */}
                  <div className="absolute inset-0 rounded-xl bg-lime/0 group-hover:bg-lime/15 transition-all duration-300" />
                </div>
              ))}
              {/* More indicator */}
              <div className="w-20 h-20 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-1"
                style={{ border: "2px dashed rgba(156,252,92,0.35)", background: "rgba(156,252,92,0.06)" }}
                onClick={() => navigate("/success-stories")}>
                <span className="text-lime text-xl font-bold">+</span>
                <span className="text-white/50 text-xs mt-0.5">{t('home_moreBtn')}</span>
              </div>
            </div>
          </div>

          {/* DIAGONAL DIVIDER - angled stripe between panels */}
          <div className="absolute inset-y-0 z-20 hidden lg:block pointer-events-none"
            style={{ left: "49%", width: "50px" }}>
            {/* Main diagonal stripe (lime/green) */}
            <div className="absolute inset-y-0" style={{
              width: "32px",
              background: "linear-gradient(135deg,#9CFC5C,#7DD940)",
              clipPath: "polygon(40% 0%, 100% 0%, 60% 100%, 0% 100%)",
              opacity: 0.9,
            }} />
            {/* Secondary stripe overlay */}
            <div className="absolute inset-y-0" style={{
              left: "12px",
              width: "18px",
              background: "rgba(27,48,34,0.4)",
              clipPath: "polygon(40% 0%, 100% 0%, 60% 100%, 0% 100%)",
            }} />
          </div>

          {/* RIGHT PANEL — Full-bleed image slideshow */}
          <div className="hidden lg:block relative w-[51%] overflow-hidden">
            {heroSlides.map((src, i) => (
              <div key={i} className="absolute inset-0 transition-opacity duration-[2000ms]"
                style={{ opacity: currentSlide === i ? 1 : 0 }}>
                <img src={src} alt="Hero"
                  className="w-full h-full object-cover"
                  style={{ animation: currentSlide === i ? "kenburns 10s ease-in-out forwards" : "none" }} />
              </div>
            ))}
            {/* Subtle dark overlay bottom for polish */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent)" }} />

            {/* Slide dots */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-10">
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: currentSlide === i ? "8px" : "6px",
                    height: currentSlide === i ? "24px" : "6px",
                    background: currentSlide === i ? "#9CFC5C" : "rgba(255,255,255,0.4)",
                    boxShadow: currentSlide === i ? "0 0 8px rgba(156,252,92,0.6)" : "none"
                  }} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile hero image (shows below on small screens) */}
        <div className="lg:hidden relative h-64 overflow-hidden">
          {heroSlides.map((src, i) => (
            <div key={i} className="absolute inset-0 transition-opacity duration-[2000ms]"
              style={{ opacity: currentSlide === i ? 1 : 0 }}>
              <img src={src} alt="Hero" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(27,48,34,0.6), transparent)" }} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* STATS BAND — Full-width green bar                              */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="relative py-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1B3022 0%, #2D4F37 50%, #1B3022 100%)" }}>
        {/* Diagonal accent line top */}
        <div className="absolute top-0 left-0 right-0 h-1"
          style={{ background: "linear-gradient(90deg, transparent, #9CFC5C, transparent)" }} />
        {/* Diagonal accent line bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: "linear-gradient(90deg, transparent, #9CFC5C, transparent)" }} />

        <div className="section-wrapper">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {liveStats.map((stat, i) => (
              <div key={i} className="text-center group transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
                <div className="font-display font-black text-4xl sm:text-5xl text-white mb-1">
                  {statsInView ? (
                    <CountUp start={0} end={stat.value} duration={2.5} separator="," delay={i * 0.2} />
                  ) : "0"}
                  <span style={{ color: "#9CFC5C" }}>{stat.suffix}</span>
                </div>
                <p className="text-white/55 text-sm font-medium tracking-wide">{t(stat.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* HOW IT WORKS — Steps with alternating accent                   */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Corner fills */}
        <div className="absolute top-0 left-0 w-72 h-72 pointer-events-none" style={{ background: "radial-gradient(circle at 0% 0%, rgba(156,252,92,0.06) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 100%, rgba(27,48,34,0.04) 0%, transparent 60%)" }} />

        <div className="section-wrapper relative z-10">
          {/* Section label */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-forest mb-4"
              style={{ background: "linear-gradient(135deg,rgba(156,252,92,0.2),rgba(156,252,92,0.08))", border: "1px solid rgba(156,252,92,0.35)" }}>
              {t('home_howBadge')}
            </span>
            <h2 className="font-display font-black text-forest text-4xl">
              {t('home_howTitle1')}<span style={{ color: "#7DD940" }}>{t('home_howTitle2')}</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">{t('home_howDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="relative group">
                {/* Connector line */}
                {i < HOW_STEPS.length - 1 && (
                  <div className="absolute top-10 left-full w-8 h-0.5 hidden lg:block z-10"
                    style={{ background: "linear-gradient(90deg,#9CFC5C,transparent)" }} />
                )}
                <div className="p-6 rounded-2xl transition-all duration-300 group-hover:-translate-y-2"
                  style={{ background: "linear-gradient(145deg,#ffffff,#f5f8f5)", border: "1px solid rgba(27,48,34,0.07)", boxShadow: "0 4px 20px rgba(27,48,34,0.07)" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 48px rgba(156,252,92,0.2), 0 4px 12px rgba(27,48,34,0.1)"; e.currentTarget.style.borderColor = "rgba(156,252,92,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(27,48,34,0.07)"; e.currentTarget.style.borderColor = "rgba(27,48,34,0.07)"; }}>
                  {/* Number badge */}
                  <div className="font-display font-black text-xs tracking-widest mb-4" style={{ color: "rgba(156,252,92,0.6)" }}>
                    {step.num}
                  </div>
                  {/* Icon circle */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg,rgba(156,252,92,0.15),rgba(156,252,92,0.05))", border: "1px solid rgba(156,252,92,0.2)" }}>
                    {step.icon}
                  </div>
                  <h3 className="font-display font-bold text-forest text-lg mb-2">{t(`home_step${i+1}_title`)}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t(`home_step${i+1}_desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* OUR MISSION — Split layout with image + content                */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1F13 0%, #1B3022 60%, #2D4F37 100%)" }}>
        {/* Angled clip top */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden h-16 pointer-events-none">
          <svg viewBox="0 0 1440 64" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="0,0 1440,0 1440,64 0,0" fill="white" />
          </svg>
        </div>

        <div className="section-wrapper pt-28 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Images collage left */}
            <div className="relative h-[480px] hidden lg:block">
              <div className="absolute top-0 left-0 w-64 h-80 rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.4)", border: "3px solid rgba(156,252,92,0.2)" }}>
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" alt="Mission" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-56 h-64 rounded-2xl overflow-hidden animate-float"
                style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.4)", border: "3px solid rgba(156,252,92,0.2)" }}>
                <img src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=500&q=80" alt="Water" className="w-full h-full object-cover" />
              </div>
              {/* Lime stat card floating */}
              <div className="absolute top-1/2 left-52 -translate-y-1/2 rounded-2xl p-5 z-10 animate-float"
                style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)", boxShadow: "0 12px 36px rgba(156,252,92,0.5)", animationDelay: "1s" }}>
                <p className="font-display font-black text-forest text-3xl">100%</p>
                <p className="text-forest/70 text-sm font-semibold">{t('home_missionTrans')}</p>
              </div>
              {/* Deco ring */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-2 border-lime/15 animate-spin-slow pointer-events-none" />
            </div>

            {/* Right: text content */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-forest mb-5"
                style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)", boxShadow: "0 2px 10px rgba(156,252,92,0.3)" }}>
                {t('home_missionBadge')}
              </span>
              <h2 className="font-display font-black text-white text-4xl lg:text-5xl leading-tight mb-6">
                {t('home_missionTitle1')}
                <span style={{ color: "#9CFC5C" }}>{t('home_missionTitle2')}</span>
              </h2>
              <p className="text-white/65 leading-relaxed mb-6">
                {t('home_missionDesc1')}
              </p>
              <p className="text-white/65 leading-relaxed mb-8">
                {t('home_missionDesc2_1')}<strong className="text-lime">{t('home_missionDesc2_2')}</strong>{t('home_missionDesc2_3')}
                <strong className="text-lime">{t('home_missionDesc2_4')}</strong>{t('home_missionDesc2_5')}
                <strong className="text-lime">{t('home_missionDesc2_6')}</strong>.
              </p>

              {/* Feature list */}
              {[t('home_feature1'), t('home_feature2'), t('home_feature3')].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)" }}>
                    <span className="text-forest text-xs font-black">✓</span>
                  </div>
                  <span className="text-white/75 text-sm">{item}</span>
                </div>
              ))}

              <button onClick={() => navigate("/about")}
                className="mt-8 inline-flex items-center gap-3 font-display font-bold text-forest px-8 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-1"
                style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)", boxShadow: "0 6px 24px rgba(156,252,92,0.45)" }}>
                {t('home_learnMoreBtn')}
              </button>
            </div>
          </div>
        </div>

        {/* Angled clip bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-16 pointer-events-none">
          <svg viewBox="0 0 1440 64" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="0,64 1440,0 1440,64 0,64" fill="white" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* CURRENT CAMPAIGNS                                              */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Side accent bars */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #9CFC5C, transparent, #9CFC5C)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-1.5 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #9CFC5C, transparent)" }} />

        <div className="section-wrapper">
          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
                style={{ background: "linear-gradient(135deg,#1B3022,#2D4F37)" }}>
                <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse" />
                {t('home_campaignsBadge')}
              </span>
              <h2 className="font-display font-black text-forest text-4xl">{t('home_campaignsTitle')}</h2>
            </div>
            <Link to="/campaigns"
              className="hidden sm:flex items-center gap-2 font-display font-semibold text-sm text-forest hover:text-lime-dark transition-colors group">
              {t('home_viewAll')}
              <span className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:-translate-x-0.5"
                style={{ background: "rgba(27,48,34,0.07)" }}>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveCampaigns.map((campaign) => {
              const mapped = {
                ...campaign,
                image: campaign.coverImage || campaign.image,
                raised: campaign.currentFunds ?? campaign.raised,
                description: campaign.shortDescription || campaign.description
              };
              return <CampaignCard key={mapped._id || mapped.id} campaign={mapped} />;
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* SUCCESS STORIES — Masonry-style dark section                   */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #111E16 0%, #1B3022 50%, #243D2C 100%)" }}>
        {/* Angled separator top */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden h-12 pointer-events-none">
          <svg viewBox="0 0 1440 48" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="0,0 1440,48 1440,0 0,0" fill="white" />
          </svg>
        </div>

        {/* Decorative dots top-right */}
        <div className="absolute top-12 right-8 grid grid-cols-5 gap-2.5 opacity-15 pointer-events-none hidden xl:grid">
          {Array.from({ length: 25 }).map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-lime" />)}
        </div>

        <div className="section-wrapper pt-8">
          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-forest mb-4"
                style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)", boxShadow: "0 2px 10px rgba(156,252,92,0.3)" }}>
                {t('home_storiesBadge')}
              </span>
              <h2 className="font-display font-black text-white text-4xl">
                {t('home_storiesTitle1')}<span style={{ color: "#9CFC5C" }}>{t('home_storiesTitle2')}</span>
              </h2>
            </div>
            <Link to="/success-stories"
              className="hidden sm:flex items-center gap-2 text-lime/70 font-semibold text-sm hover:text-lime transition-colors">
              {t('home_readAll')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveStories.map((story) => (
              <div key={story._id || story.id}
                className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{ border: "1px solid rgba(156,252,92,0.15)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(156,252,92,0.4)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(156,252,92,0.15)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)"; }}>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={story.image.startsWith("http") ? story.image : `${import.meta.env.VITE_API_URL || ""}${story.image}`}
                    alt={`Story from ${story.location}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(17,30,22,0.9) 0%, transparent 60%)" }} />
                  <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-forest"
                    style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)" }}>
                    {story.location}
                  </span>
                </div>
                <div className="p-5" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}>
                  <div className="w-6 h-0.5 rounded-full mb-3" style={{ background: "linear-gradient(90deg,#9CFC5C,#7DD940)" }} />
                  <p className="text-white/90 text-sm italic leading-relaxed mb-4 line-clamp-3">"{story.quote}"</p>
                  <Link to="/success-stories"
                    className="inline-flex items-center gap-2 text-lime font-semibold text-sm hover:text-lime-light transition-colors">
                    {t('home_readStory')} <span className="text-xs">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Angled separator bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-12 pointer-events-none">
          <svg viewBox="0 0 1440 48" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="0,48 1440,0 1440,48 0,48" fill="white" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* NEWS & UPDATES — White section, cards with left accent bar     */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Pattern corner decoration */}
        <div className="absolute top-8 right-8 hidden xl:grid grid-cols-6 gap-3 opacity-10 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-forest" />)}
        </div>
        <div className="absolute bottom-8 left-8 hidden xl:grid grid-cols-4 gap-3 opacity-10 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-lime/60" />)}
        </div>

        <div className="section-wrapper relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-forest mb-3"
                style={{ background: "linear-gradient(135deg,rgba(156,252,92,0.2),rgba(156,252,92,0.08))", border: "1px solid rgba(156,252,92,0.35)" }}>
                {t('home_newsBadge')}
              </span>
              <h2 className="font-display font-black text-forest text-4xl">{t('home_newsTitle')}</h2>
            </div>
          </div>

          {liveNews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(27,48,34,0.05)" }}>
                <span className="text-4xl">📰</span>
              </div>
              <p className="text-gray-400">{t('home_noNews')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {liveNews.map((item) => {
                const API_BASE = import.meta.env.VITE_API_URL || "";
                const badgeStyle =
                  item.status === "complete" ? { bg: "linear-gradient(135deg,#9CFC5C,#7DD940)", color: "#1B3022" }
                    : item.status === "upcoming" ? { bg: "#FEF3C7", color: "#92400E" }
                      : item.status === "paused" ? { bg: "#F3F4F6", color: "#6B7280" }
                        : { bg: "#DBEAFE", color: "#1D40AF" };

                const imageUrl = item.image
                  ? item.image.startsWith("http") ? item.image : `${API_BASE}${item.image}`
                  : null;

                return (
                  <div key={item._id}
                    className="flex items-start gap-4 p-4 rounded-2xl cursor-pointer group transition-all duration-200"
                    style={{ background: "#ffffff", border: "1px solid rgba(27,48,34,0.07)", boxShadow: "0 2px 12px rgba(27,48,34,0.06)" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(156,252,92,0.35)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(156,252,92,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(27,48,34,0.07)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(27,48,34,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    {/* Left color bar */}
                    <div className="w-1 self-stretch rounded-full flex-shrink-0"
                      style={{ background: "linear-gradient(to bottom,#9CFC5C,#7DD940)" }} />

                    {imageUrl && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={imageUrl} alt="News" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold mb-1.5"
                        style={{ background: badgeStyle.bg, color: badgeStyle.color }}>
                        {item.tag}
                      </span>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{item.label}</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-lime group-hover:translate-x-1 transition-all duration-200 text-sm flex-shrink-0">→</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* CTA BANNER — Full-fill diagonal split                          */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1F13 0%, #1B3022 55%, #2D4F37 100%)" }}>

        {/* Angled top */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden h-12 pointer-events-none">
          <svg viewBox="0 0 1440 48" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="0,0 1440,48 1440,0 0,0" fill="white" />
          </svg>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-8 w-48 h-48 rounded-full border border-lime/10 animate-pulse-ring hidden lg:block" style={{ transform: "translateY(-50%)" }} />
          <div className="absolute top-1/2 right-8 w-32 h-32 rounded-full border border-white/6 animate-spin-slow hidden lg:block" style={{ transform: "translateY(-50%)" }} />
          <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.07)", transform: "translateY(-50%)" }} />
          {/* Dot strip */}
          <div className="absolute bottom-12 left-1/2 hidden xl:flex gap-3 opacity-15" style={{ transform: "translateX(-50%)" }}>
            {Array.from({ length: 16 }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-lime" />)}
          </div>
        </div>

        <div className="section-wrapper relative z-10 text-center">
          {/* Pill label */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{ background: "rgba(156,252,92,0.12)", border: "1px solid rgba(156,252,92,0.28)" }}>
            <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse" />
            <span className="text-lime text-xs font-semibold tracking-widest uppercase">{t('home_ctaBadge')}</span>
          </div>

          <h2 className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl mb-5 leading-tight">
            {t('home_ctaTitle1')}
            <span style={{ color: "#9CFC5C" }}>{t('home_ctaTitle2')}</span>
            <br />{t('home_ctaTitle3')}
            <span style={{ color: "#9CFC5C" }}>{t('home_ctaTitle4')}</span>
          </h2>

          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            {t('home_ctaDesc')}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate("/volunteer")}
              className="inline-flex items-center gap-2 font-display font-bold text-white px-9 py-4 rounded-full transition-all duration-300 hover:-translate-y-1"
              style={{ border: "2px solid rgba(255,255,255,0.35)", backdropFilter: "blur(4px)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
              {t('home_joinBtn')}
            </button>
            <button onClick={() => navigate("/donate")}
              id="cta-donate-btn"
              className="inline-flex items-center gap-3 font-display font-bold text-forest px-9 py-4 rounded-full transition-all duration-300 hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)", boxShadow: "0 8px 32px rgba(156,252,92,0.5)" }}>
              <span className="w-6 h-6 rounded-full bg-forest/20 flex items-center justify-center text-sm">↗</span>
              {t('home_donateNowCta')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
