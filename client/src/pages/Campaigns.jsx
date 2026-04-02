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
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Active Campaigns" 
        description="Browse our active community projects and campaigns. Choose where your support goes and help us empower villages."
        path="/campaigns"
      />
      {/* Header */}
      <div className="bg-forest py-16 text-center">
        <div className="section-wrapper">
          <span className="badge-lime mb-4 inline-block">Active Now</span>
          <h1 className="font-display font-black text-white text-5xl mb-4">Our Campaigns</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Browse our active campaigns and choose where your support goes.
          </p>
        </div>
      </div>

      <div className="section-wrapper py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeFilter === cat
                  ? "bg-forest text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-forest"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((campaign) => {
            const percent = campaign.goal === 0 ? 0 : Math.min(Math.round((campaign.currentFunds / campaign.goal) * 100), 100);
            return (
              <div key={campaign._id} className="card overflow-hidden group">
                <div className="relative h-52 overflow-hidden">
                  <img src={campaign.coverImage.startsWith("http") ? campaign.coverImage : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${campaign.coverImage}`} alt={campaign.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-3 left-3"><span className="badge-lime text-xs">{campaign.category}</span></div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-forest text-lg mb-2 line-clamp-1">{campaign.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-gray-500">${(campaign.currentFunds || 0).toLocaleString()} raised</span>
                      <span className="text-forest font-bold">of ${(campaign.goal || 0).toLocaleString()}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="text-right text-xs text-lime-dark font-bold mt-1">{percent}%</p>
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
          <div className="text-center py-20 text-gray-400">
            <div className="w-10 h-10 border-4 border-lime border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Loading campaigns...</p>
          </div>
        ) : filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-medium">No campaigns match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
