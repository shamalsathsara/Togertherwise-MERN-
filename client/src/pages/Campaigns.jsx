/**
 * Campaigns.jsx — All Campaigns / Projects Listing Page
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import axiosInstance from "../api/axiosInstance";

const CATEGORIES = ["All", "Water Projects", "Education", "Medical Aid", "Reforestation", "Community Development"];

const Campaigns = () => {
  const navigate = useNavigate();
  const [dbCampaigns, setDbCampaigns] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axiosInstance.get("/projects?status=active");
        if (res.data.success) {
          setDbCampaigns(res.data.projects);
        }
      } catch (err) {
        console.error("Failed to load campaigns", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const filtered = dbCampaigns.filter((c) => {
    const matchCategory = activeFilter === "All" || c.category === activeFilter;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Active Campaigns" 
        description="Browse our active community projects and campaigns. Choose where your support goes and help us empower villages."
        path="/campaigns"
      />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="relative py-28 text-center overflow-hidden" style={{
        background: "linear-gradient(135deg, #111E16 0%, #1B3022 55%, #2D4F37 100%)"
      }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.08)", transform: "translate(-30%,-30%)" }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.06)", transform: "translate(20%,20%)" }} />
          <div className="absolute top-8 right-8 w-40 h-40 rounded-full border border-lime/10 hidden lg:block" />
          <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full border border-white/6 hidden lg:block" />
          {/* Dot pattern */}
          <div className="absolute top-10 left-1/2 hidden xl:grid grid-cols-8 gap-3 opacity-10 pointer-events-none" style={{ transform: "translateX(-50%)" }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-lime" />
            ))}
          </div>
        </div>

        <div className="section-wrapper relative z-10">
          <span className="badge-lime mb-5 inline-block animate-fade-in">Active Now</span>
          <h1 className="font-display font-black text-white text-5xl sm:text-6xl mb-4 animate-slide-up leading-tight">
            Our <span className="text-gradient-lime">Campaigns</span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto animate-slide-up delay-200">
            Browse our active campaigns and choose where your support goes.
          </p>
        </div>
      </div>

      <div className="section-wrapper py-12">
        {/* ── Filters ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-shrink-0">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 max-w-xs"
              style={{ minWidth: "220px" }}
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeFilter === cat
                    ? "text-forest shadow-lime"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-forest/30 hover:shadow-sm"
                }`}
                style={activeFilter === cat ? {
                  background: "linear-gradient(135deg,#9CFC5C,#7DD940)",
                  boxShadow: "0 4px 16px rgba(156,252,92,0.35)"
                } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((campaign) => {
            const percent = campaign.goal === 0 ? 0 : Math.min(Math.round((campaign.currentFunds / campaign.goal) * 100), 100);
            return (
              <div key={campaign._id} className="card-luxury overflow-hidden group">
                <div className="relative h-52 overflow-hidden">
                  {/\.(mp4|webm|ogg|mov|avi)$/i.test(campaign.coverImage) ? (
                    <video src={campaign.coverImage.startsWith("http") ? campaign.coverImage : `${import.meta.env.VITE_API_URL || ""}${campaign.coverImage}`} preload="metadata" autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <img src={campaign.coverImage.startsWith("http") ? campaign.coverImage : `${import.meta.env.VITE_API_URL || ""}${campaign.coverImage}`} alt={campaign.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3"><span className="badge-lime text-xs">{campaign.category}</span></div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-forest text-lg mb-2 line-clamp-1">{campaign.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium mb-2">
                      <span className="text-gray-500">LKR {(campaign.currentFunds || 0).toLocaleString()} raised</span>
                      <span className="font-bold" style={{ color: "#7DD940" }}>of LKR {(campaign.goal || 0).toLocaleString()}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="text-right text-xs font-bold mt-1" style={{ color: "#7DD940" }}>{percent}%</p>
                  </div>
                  <button onClick={() => navigate("/donate")} className="btn-primary w-full text-sm py-2.5">
                    Donate Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="relative w-14 h-14 mx-auto mb-4">
              <div className="w-14 h-14 border-4 border-gray-100 rounded-full" />
              <div className="absolute inset-0 w-14 h-14 border-4 border-t-lime rounded-full animate-spin" />
            </div>
            <p className="text-gray-400 font-medium">Loading campaigns...</p>
          </div>
        ) : filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <p className="text-4xl">🔍</p>
            </div>
            <p className="text-gray-400 font-medium text-lg">No campaigns match your search.</p>
            <p className="text-gray-300 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
