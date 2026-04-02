/**
 * AboutUs.jsx — About Togetherwise Page
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import axiosInstance from "../api/axiosInstance";

const TEAM = [
  { name: "shamal sathsara", role: "Executive Director", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80" },
  { name: "Arun Wickramasinghe", role: "Programs Director", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" },
  { name: "Fatima Al-Rashid", role: "Community Engagement", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80" },
  { name: "James Okonkwo", role: "Field Operations Lead", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
];

const VALUES = [
  { icon: "🌍", title: "Global Reach", desc: "We work across 15+ countries, connecting communities worldwide." },
  { icon: "💚", title: "Community First", desc: "Every decision centers on the people we serve, not institutional interests." },
  { icon: "🔍", title: "Transparency", desc: "100% financial accountability — you always know where your money goes." },
  { icon: "🤝", title: "Partnership", desc: "We build lasting relationships with local leaders and organizations." },
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
      {/* Hero */}
      <section className="relative py-24 bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-96 h-96 bg-lime rounded-full absolute -top-20 right-20 blur-3xl" />
        </div>
        <div className="section-wrapper relative z-10 text-center">
          <span className="badge-lime mb-4 inline-block">Our Story</span>
          <h1 className="font-display font-black text-white text-4xl sm:text-5xl mb-6">
            About <span className="text-lime">Togetherwise</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
            Founded in 2026, Togetherwise bridges the gap between global resources and local needs,
            creating lasting change in communities across the world.
          </p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-20 bg-gray-50">
        <div className="section-wrapper">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-forest mb-3 inline-block">Our Mission</span>
              <h2 className="section-title mb-4">Empowering Communities From Village to Global</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
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
              <button onClick={() => navigate("/donate")} className="btn-primary">
                Support Our Work
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1542884748-2b87b36c6b90?w=700&q=80"
                alt="Community empowerment"
                className="rounded-3xl shadow-2xl w-full h-80 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-lime rounded-2xl p-6 shadow-xl">
                <p className="font-display font-black text-forest text-3xl">2026</p>
                <p className="text-forest/70 text-sm">Founded</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="section-wrapper">
          <div className="text-center mb-12">
            <span className="badge-lime mb-3 inline-block">What We Stand For</span>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="p-6 rounded-2xl border-2 border-gray-100 hover:border-lime
                                      hover:shadow-md transition-all duration-300 text-center group">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-display font-bold text-forest text-lg mb-2 group-hover:text-lime-dark transition-colors">
                  {v.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="section-wrapper">
          <div className="text-center mb-12">
            <span className="badge-forest mb-3 inline-block">The People Behind It</span>
            <h2 className="section-title">Our Leadership Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <div key={i} className="card text-center p-6 group">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full ring-4 ring-lime/20 group-hover:ring-lime transition-all duration-300"
                  />
                </div>
                <h3 className="font-display font-bold text-forest text-base">{member.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="section-wrapper">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-lime mb-3 inline-block">Contact Us</span>
              <h2 className="section-title mb-2">How can we help?</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Togetherwise is the most guaranteed estimated and most believed of community benefits shared up.
              </p>
              <div className="space-y-3 mb-8">
                {["Volunteer Opportunities", "Donate & Support", "Raise a request", "Join our Community"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-lime rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-forest text-xs font-bold">✓</span>
                    </span>
                    <span className="text-gray-600 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
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
                <div className={`p-3 rounded-xl text-sm mb-4 border ${
                  statusMsg.type === "success" 
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
