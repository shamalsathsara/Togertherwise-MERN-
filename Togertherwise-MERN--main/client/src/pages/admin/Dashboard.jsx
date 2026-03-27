/**
 * Dashboard.jsx — Admin Dashboard
 * Summary cards for Active Projects and Recent Success Stories.
 * Matches the reference design with the dark green card layout.
 */

import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ label, value, icon, color = "bg-forest" }) => (
  <div className={`${color} rounded-2xl p-8 text-white flex flex-col gap-2 shadow-lg`}>
    <div className="flex items-center justify-between">
      <span className="text-white/70 font-medium text-base">{label}:</span>
      <span className="text-3xl">{icon}</span>
    </div>
    <p className="font-display font-black text-6xl">{value}</p>
  </div>
);

// ─── Recent Donations Table ───────────────────────────────────────────────────
const RecentActivity = ({ title, items }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h3 className="font-display font-bold text-forest text-lg mb-4">{title}</h3>
    {items.length === 0 ? (
      <p className="text-gray-400 text-sm text-center py-6">No data yet. Records will appear here as they are added.</p>
    ) : (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-forest">{item.title}</p>
              <p className="text-xs text-gray-400">{item.subtitle}</p>
            </div>
            <span className={`badge-lime text-xs ${item.statusColor || ""}`}>{item.status}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ active: 5, completed: 12, featured: 3, total: 17 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch real stats from the API (falls back to demo data if server is not running)
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const statsRes = await axiosInstance.get("/projects/stats");
        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
        const projectsRes = await axiosInstance.get("/projects?status=active");
        if (projectsRes.data.success) {
          setRecentProjects(projectsRes.data.projects.slice(0, 5).map(p => ({
            title: p.title,
            subtitle: `Goal: $${p.goal?.toLocaleString()} | Raised: $${p.currentFunds?.toLocaleString()}`,
            status: p.status,
          })));
        }
      } catch {
        // Server not connected — use demo data
        setRecentProjects([
          { title: "Clean Water for Rural Schools", subtitle: "Goal: $74,000 | Raised: $42,000", status: "active" },
          { title: "Solar Panels for Schools", subtitle: "Goal: $50,000 | Raised: $31,000", status: "active" },
          { title: "Reforestation Initiative", subtitle: "Goal: $60,000 | Raised: $45,000", status: "active" },
          { title: "Mobile Medical Clinics", subtitle: "Goal: $90,000 | Raised: $67,500", status: "active" },
          { title: "Community Centers", subtitle: "Goal: $37,000 | Raised: $28,500", status: "active" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SummaryCard label="Active Projects" value={stats.active} icon="📊" color="bg-forest" />
        <SummaryCard label="Recent Success Stories" value={stats.completed} icon="🌟" color="bg-forest-light" />
        <SummaryCard label="Featured Projects" value={stats.featured} icon="⭐" color="bg-lime text-forest" />
        <SummaryCard label="Total Projects" value={stats.total} icon="🗂️" color="bg-forest-dark" />
      </div>

      {/* ── Recent Activity ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity
          title="📋 Recent Projects"
          items={recentProjects}
        />
        <RecentActivity
          title="📊 Quick Stats"
          items={[
            { title: "Total Donations This Month", subtitle: "Manual + Online", status: "$12,500" },
            { title: "New Volunteers Registered", subtitle: "Last 30 days", status: "47" },
            { title: "Pending Volunteer Applications", subtitle: "Awaiting review", status: "8" },
            { title: "Projects Nearing Goal", subtitle: "Within 80% of target", status: "3" },
          ]}
        />
      </div>

      {/* ── Server Status ────────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm">
        <p className="text-amber-700 font-medium">
          <span className="mr-2">ℹ️</span>
          <strong>Database Status:</strong> Run{" "}
          <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">npm run dev</code>{" "}
          in the <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">/server</code>{" "}
          directory and ensure MongoDB is running to see live data.
          Currently showing demo data.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
