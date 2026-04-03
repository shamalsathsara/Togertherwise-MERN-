/**
 * Dashboard.jsx — Admin Dashboard
 * Summary cards for Active Projects and Recent Success Stories.
 * Clean, modern card layout with live data from the API.
 */

import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

/* ── Stat Card ────────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon, accent = "lime" }) => {
  const accents = {
    lime: "bg-lime/10 text-lime-dark",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    forest: "bg-forest/5 text-forest",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-[13px] font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base ${accents[accent]}`}>
          {icon}
        </div>
      </div>
      <p className="font-display font-black text-[32px] text-gray-800 leading-none tracking-tight">{value}</p>
    </div>
  );
};

/* ── Activity List ────────────────────────────────────────────────────────── */
const ActivityList = ({ title, icon, items }) => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow">
    <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2.5">
      <span className="text-base">{icon}</span>
      <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
      <span className="ml-auto text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{items.length} items</span>
    </div>
    {items.length === 0 ? (
      <p className="text-gray-400 text-sm text-center py-8">No data available yet.</p>
    ) : (
      <div className="divide-y divide-gray-50">
        {items.map((item, i) => (
          <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/40 transition-colors">
            <div className="min-w-0 flex-1 mr-4">
              <p className="text-sm font-medium text-gray-700 truncate">{item.title}</p>
              <p className="text-[12px] text-gray-400 mt-0.5 truncate">{item.subtitle}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
              item.status === 'active' ? 'bg-lime/15 text-forest' :
              item.status === 'completed' ? 'bg-blue-50 text-blue-600' :
              'bg-gray-50 text-gray-500'
            }`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ active: 0, completed: 0, featured: 0, total: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

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
            subtitle: `Goal: $${p.goal?.toLocaleString()} · Raised: $${p.currentFunds?.toLocaleString() || 0}`,
            status: p.status,
          })));
        }
        setIsConnected(true);
      } catch {
        setIsConnected(false);
        setRecentProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-lime/30 border-t-lime rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── Welcome Banner ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-forest to-[#1f5f3a] rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-lime/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-lime/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h2 className="font-display font-bold text-xl mb-1">Welcome back 👋</h2>
          <p className="text-white/50 text-sm">Here's an overview of your platform's activity.</p>
        </div>
      </div>

      {/* ── Summary Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Projects" value={stats.active} icon="📊" accent="lime" />
        <StatCard label="Completed" value={stats.completed} icon="✅" accent="blue" />
        <StatCard label="Featured" value={stats.featured} icon="⭐" accent="amber" />
        <StatCard label="Total Projects" value={stats.total} icon="📁" accent="forest" />
      </div>

      {/* ── Activity Panels ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityList title="Recent Projects" icon="📋" items={recentProjects} />
        <ActivityList title="Quick Stats" icon="📊" items={[
          { title: "Visit the Projects page", subtitle: "Manage all your campaigns and track progress", status: `${stats.active} active` },
          { title: "Stories & Impact", subtitle: "Publish stories to showcase your work", status: `${stats.completed} done` },
          { title: "Donations Overview", subtitle: "Track incoming donations and payment status", status: "View →" },
          { title: "Volunteer Applications", subtitle: "Review and approve pending applicants", status: "View →" },
        ]} />
      </div>

      {/* ── Connection Status ──────────────────────────────────────── */}
      {!isConnected && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl px-4 py-3 text-sm flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse flex-shrink-0" />
          <p className="text-amber-700">
            <strong>Database unavailable.</strong> Run <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">npm run dev</code> in <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">/server</code> to see live data.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
