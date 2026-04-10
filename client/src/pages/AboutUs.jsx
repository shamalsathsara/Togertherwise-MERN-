/**
 * AboutUs.jsx — About Togetherwise Page
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import axiosInstance from "../api/axiosInstance";

const TEAM = [
  { name: "Dr. priyanka", role: "Executive Director", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80" },
  { name: "Arun Wickramasinghe", role: "Programs Director", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" },
  { name: "Fatima Al-Rashid", role: "Community Engagement", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80" },
  { name: "James Okonkwo", role: "Field Operations Lead", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
];

const IconGlobe = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);
const IconHeart = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);
const IconShield = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const IconHandshake = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20.5 14.5l-5.19 5.19a2 2 0 0 1-2.83 0L3 10.4a2 2 0 0 1 0-2.83L8.34 2.73a2 2 0 0 1 2.83 0l.88.88"/><path d="M14 14.5l-4-4"/><path d="M10.5 10l7.08-7.08a2 2 0 0 1 2.83 2.83L13 13"/><path d="M20.5 14.5l-6 .5"/></svg>);
const IconMessage = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);

const VALUES = [
  { Icon: IconGlobe, title: "Global Reach", desc: "We work across 15+ countries, connecting communities worldwide." },
  { Icon: IconHeart, title: "Community First", desc: "Every decision centers on the people we serve, not institutional interests." },
  { Icon: IconShield, title: "Transparency", desc: "100% financial accountability — you always know where your money goes." },
  { Icon: IconHandshake, title: "Partnership", desc: "We build lasting relationships with local leaders and organizations." },
];

const AboutUs = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    type: "Volunteer inquiry",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/messages", formData);
      setStatusMsg({ text: "Message sent successfully! We will get back to you soon.", type: "success" });
      setFormData({
        type: "Volunteer inquiry",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
      // Clear success message after 5 seconds
      setTimeout(() => setStatusMsg({ text: "", type: "" }), 5000);
    } catch (error) {
      setStatusMsg({
        text: error.response?.data?.message || "Failed to send message. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="About Us"
        description="Learn about Togetherwise — our mission, our values, and the team working to empower communities across the globe."
        path="/about"
      />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden" style={{
        background: "linear-gradient(135deg, #111E16 0%, #1B3022 55%, #2D4F37 100%)"
      }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.1)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.06)", transform: "translate(-20%,20%)" }} />
          <div className="absolute top-1/2 left-8 w-40 h-40 rounded-full border border-lime/10 hidden lg:block" style={{ transform: "translateY(-50%)" }} />
          <div className="absolute top-1/2 right-8 w-24 h-24 rounded-full border border-white/6 hidden lg:block" style={{ transform: "translateY(-50%)" }} />
          {/* Dot grid */}
          <div className="absolute bottom-8 right-1/4 hidden xl:grid grid-cols-6 gap-3 opacity-15">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-lime" />
            ))}
          </div>
        </div>

        <div className="section-wrapper relative z-10 text-center">
          <span className="badge-lime mb-5 inline-block animate-fade-in">Our Story</span>
          <h1 className="font-display font-black text-white text-4xl sm:text-6xl mb-6 animate-slide-up leading-tight">
            About <span className="text-gradient-lime">Togetherwise</span>
          </h1>
          <p className="text-white/65 text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up delay-200">
            Founded in 2026, Togetherwise bridges the gap between global resources and local needs,
            creating lasting change in communities across the world.
          </p>
        </div>
      </section>

      {/* ── Mission + Vision ───────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{
        background: "linear-gradient(180deg, #f5f8f5 0%, #ffffff 100%)"
      }}>
        {/* Corner decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(156,252,92,0.07), transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none" style={{ background: "radial-gradient(circle at 0% 100%, rgba(27,48,34,0.04), transparent 60%)" }} />

        <div className="section-wrapper relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge-forest mb-4 inline-block">Our Mission</span>
              <h2 className="section-title mb-5">Empowering Communities From Village to Global</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Village to Global is dedicated to supporting organizations and local initiatives that uplift
                communities. We focus on empowering people through sustainable development, access to essential
                resources, and community-driven programs that create lasting positive change.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Since our founding, we've impacted over <strong className="text-forest">0 families</strong>,
                completed more than <strong className="text-forest">0 projects</strong>, and built a
                global network of <strong className="text-forest">0+ volunteers</strong> committed to
                building a better world.
              </p>

              {/* Feature list */}
              {["Sustainable community development", "100% financial transparency", "Local leader partnerships"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)" }}>
                    <span className="text-forest text-xs font-black">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{item}</span>
                </div>
              ))}

              <button onClick={() => navigate("/donate")} className="btn-primary mt-6">
                Support Our Work
              </button>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-luxury group">
                <img
                  src="https://images.unsplash.com/photo-1542884748-2b87b36c6b90?w=700&q=80"
                  alt="Community empowerment"
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
              </div>

              {/* Floating year card */}
              <div className="absolute -bottom-8 -left-8 rounded-2xl p-6 shadow-lime animate-float" style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)" }}>
                <p className="font-display font-black text-forest text-3xl">2026</p>
                <p className="text-forest/70 text-sm font-medium">Founded</p>
              </div>

              {/* Corner decorative ring */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-2 border-forest/10 hidden lg:block animate-spin-slow" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Pattern decoration */}
        <div className="absolute top-8 left-8 hidden lg:grid grid-cols-4 gap-3 opacity-15 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-forest" />
          ))}
        </div>
        <div className="absolute bottom-8 right-8 hidden lg:grid grid-cols-4 gap-3 opacity-10 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-lime" />
          ))}
        </div>

        <div className="section-wrapper relative z-10">
          <div className="text-center mb-14">
            <span className="badge-lime mb-4 inline-block">What We Stand For</span>
            <h2 className="section-title">Our Core Values</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="card-luxury p-7 text-center group">
                {/* Top accent line */}
                <div className="h-0.5 w-0 group-hover:w-full rounded-full mb-6 -mt-1 transition-all duration-500 mx-auto" style={{ background: "linear-gradient(90deg,#9CFC5C,#7DD940)" }} />

                <div className="icon-circle mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{ color: "#1B3022" }}>
                  {v.Icon && <v.Icon />}
                </div>
                <h3 className="font-display font-bold text-forest text-lg mb-3 group-hover:text-lime-dark transition-colors">
                  {v.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{
        background: "linear-gradient(180deg, #f0f4f1 0%, #e8f0ea 100%)"
      }}>
        {/* Decorative rings */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-forest/8 hidden xl:block pointer-events-none" />
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full border border-lime/10 hidden xl:block pointer-events-none" />

        <div className="section-wrapper relative z-10">
          <div className="text-center mb-14">
            <span className="badge-forest mb-4 inline-block">The People Behind It</span>
            <h2 className="section-title">Our Leadership Team</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <div key={i} className="card-luxury text-center p-7 group">
                <div className="relative w-28 h-28 mx-auto mb-5">
                  {/* Spinning gradient ring */}
                  <div className="absolute inset-0 rounded-full p-0.5 animate-spin-slow" style={{ background: "linear-gradient(135deg,#9CFC5C,transparent,#9CFC5C)", opacity: 0.4 }} />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full relative z-10 transition-transform duration-500 group-hover:scale-105"
                    style={{ border: "3px solid rgba(156,252,92,0.3)" }}
                  />
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "0 0 20px rgba(156,252,92,0.4)" }} />
                </div>
                <h3 className="font-display font-bold text-forest text-base mb-1">{member.name}</h3>
                <p className="text-gray-400 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Section ───────────────────────────────────────────── */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Corner fills */}
        <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(156,252,92,0.06), transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none" style={{ background: "radial-gradient(circle at 0% 100%, rgba(27,48,34,0.04), transparent 60%)" }} />

        <div className="section-wrapper relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="badge-lime mb-4 inline-block">Contact Us</span>
              <h2 className="section-title mb-3">How can we help?</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Togetherwise is the most guaranteed estimated and most believed of community benefits shared up.
              </p>
              <div className="space-y-4 mb-8">
                {["Volunteer Opportunities", "Donate & Support", "Raise a request", "Join our Community"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)", boxShadow: "0 2px 8px rgba(156,252,92,0.3)" }}>
                      <span className="text-forest text-xs font-black">✓</span>
                    </div>
                    <span className="text-gray-600 font-medium group-hover:text-forest transition-colors">{item}</span>
                  </div>
                ))}
              </div>

              {/* Visual accent */}
              <div className="rounded-2xl p-5 mt-4" style={{ background: "linear-gradient(135deg,rgba(27,48,34,0.04),rgba(156,252,92,0.06))", border: "1px solid rgba(156,252,92,0.15)" }}>
                <p className="text-forest font-semibold text-sm flex items-center gap-2">
                  <span style={{ color: "#1B3022" }}><IconMessage /></span>
                  Quick response guaranteed
                </p>
                <p className="text-gray-500 text-xs mt-1">We typically respond within 24 hours on business days</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card-luxury p-8">
              {/* Form header accent */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(to bottom,#9CFC5C,#7DD940)" }} />
                <h3 className="font-display font-bold text-forest text-lg">Send a Message</h3>
              </div>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-input mb-4"
                required
              >
                <option>Join as a member</option>
                <option>Make a donation inquiry</option>
                <option>Volunteer inquiry</option>
                <option>Partnership inquiry</option>
                <option>Other</option>
              </select>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="form-input" required />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="form-input" required />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="form-input" required />
              </div>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={3} placeholder="Your request" className="form-input resize-none mb-4" required />

              {statusMsg.text && (
                <div className={`p-3 rounded-xl text-sm mb-4 border ${statusMsg.type === "success"
                    ? "bg-green-50 text-green-700 border-green-100"
                    : "bg-red-50 text-red-700 border-red-100"
                  }`}>
                  {statusMsg.text}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 uppercase tracking-wide font-bold">
                {loading ? "Sending..." : "Send Message ↗"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
