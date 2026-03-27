/**
 * Campaigns.jsx — All Campaigns / Projects Listing Page
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ALL_CAMPAIGNS = [
  { id: 1, title: "Clean Water for Rural Schools", category: "Water Projects", description: "Providing clean, safe water to 500+ families in rural communities across Sri Lanka.", goal: 74000, raised: 42000, image: "https://images.unsplash.com/photo-1590318719961-6e74a0cccfcb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", status: "active" },
  { id: 2, title: "Solar Panels for Schools", category: "Education", description: "Bringing renewable energy and electricity to off-grid rural schools.", goal: 50000, raised: 31000, image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80", status: "active" },
  { id: 3, title: "Changes for Community Centers", category: "Community Development", description: "Building safe, modern community gathering spaces for local programs.", goal: 37000, raised: 28500, image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&q=80", status: "active" },
  { id: 4, title: "Renewing Opportunities", category: "Education", description: "Vocational training and micro-finance programs for women entrepreneurs.", goal: 25000, raised: 18750, image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=500&q=80", status: "active" },
  { id: 5, title: "Reforestation Initiative", category: "Reforestation", description: "Planting 100,000 trees across deforested areas in Southeast Asia.", goal: 60000, raised: 45000, image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80", status: "active" },
  { id: 6, title: "Mobile Medical Clinics", category: "Medical Aid", description: "Bringing essential healthcare services to remote villages.", goal: 90000, raised: 67500, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80", status: "active" },
];

const CATEGORIES = ["All", "Water Projects", "Education", "Medical Aid", "Reforestation", "Community Development"];

const Campaigns = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = ALL_CAMPAIGNS.filter((c) => {
    const matchCategory = activeFilter === "All" || c.category === activeFilter;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
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
            const percent = Math.round((campaign.raised / campaign.goal) * 100);
            return (
              <div key={campaign.id} className="card overflow-hidden group">
                <div className="relative h-52 overflow-hidden">
                  <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-3 left-3"><span className="badge-lime text-xs">{campaign.category}</span></div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-forest text-lg mb-2">{campaign.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-gray-500">${campaign.raised.toLocaleString()} raised</span>
                      <span className="text-forest font-bold">of ${campaign.goal.toLocaleString()}</span>
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

        {filtered.length === 0 && (
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
