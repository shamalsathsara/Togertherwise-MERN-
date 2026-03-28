/**
 * Transparency.jsx — Transparency & Financial Dashboard
 * Shows donation allocation charts, financial overview, success stories, and annual reports.
 * Uses Recharts for the donut and bar charts.
 */

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

// ─── Chart Data ───────────────────────────────────────────────────────────────

// Annual Financial Overview — donut chart
const financialBreakdownData = [
  { name: "Donations", value: 0, color: "#9CFC5C" },
  { name: "Grants", value: 0, color: "#D97706" },
  { name: "Corporate Partnerships", value: 0, color: "#F59E0B" },
  { name: "Other", value: 0, color: "#D1D5DB" },
];

// Donation allocation by program — bar chart
const allocationData = [
  { program: "Water\nProjects", amount: 110, percent: "10%" },
  { program: "Reforestation", amount: 0, percent: "0%" },
  { program: "Medical Aid", amount: 0, percent: "0%" },
  { program: "Education", amount: 0, percent: "0%" },
];

// Success stories
const successStories = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80",
    quote: "People here benefit to both through in a village in India and seem they was people.",
    location: "India",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=400&q=80",
    quote: "The community to benefits; impact from the community in Africa and we value people.",
    location: "Africa",
  },
];

// Annual reports
const annualReports = [
  { year: 2025, label: "2025 Annual Report", url: "/reports/annual-report-2025.pdf" }, //Add reports to this
  { year: 2024, label: "2024 Annual Report", url: "/reports/annual-report-2024.pdf" },
  { year: 2023, label: "2023 Annual Report", url: "/reports/annual-report-2023.pdf" },
  { year: 2022, label: "2022 Annual Report", url: "/reports/annual-report-2022.pdf" },
];

// Custom tooltip for bar chart
const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const formattedVal = val >= 1000000
      ? `$${(val / 1000000).toFixed(1)}M`
      : val >= 1000
        ? `$${(val / 1000).toFixed(1)}k`
        : `$${val}`;

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-bold text-forest">{payload[0].payload.program.replace("\n", " ")}</p>
        <p className="text-gray-600">
          {formattedVal} ({payload[0].payload.percent})
        </p>
      </div>
    );
  }
  return null;
};

const Transparency = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAmount: 0, // Fallback demo data
  });
  const [donutData, setDonutData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/donations/stats");
        if (res.data.success && res.data.stats) {
          const s = res.data.stats;
          setStats(s);

          // Update Donut Chart
          if (s.totalAmount > 0) {
            setDonutData([
              { name: "Donations", value: 100, color: "#9CFC5C" },
              { name: "Grants", value: 0, color: "#D97706" },
              { name: "Corporate Partnerships", value: 0, color: "#F59E0B" },
              { name: "Other", value: 0, color: "#D1D5DB" },
            ]);
          }

          // Update Bar Chart
          if (s.allocation) {
            // Ensure default staple categories are always shown
            const defaultCategories = [
              { _id: "Water Projects", amount: 0 },
              { _id: "Reforestation", amount: 0 },
              { _id: "Medical Aid", amount: 0 },
              { _id: "Education", amount: 0 },
            ];

            // Merge fetched database stats into the defaults
            s.allocation.forEach(dbItem => {
              const existing = defaultCategories.find(c => c._id === dbItem._id);
              if (existing) {
                existing.amount = dbItem.amount;
              } else if (dbItem._id) {
                // Include any other category that might exist in the DB
                defaultCategories.push(dbItem);
              }
            });

            const totalAllocated = defaultCategories.reduce((sum, item) => sum + item.amount, 0);

            const newBarData = defaultCategories.map(item => {
              const perc = totalAllocated > 0 ? ((item.amount / totalAllocated) * 100).toFixed(1) : "0";
              let progName = item._id;
              if (progName === "Water Projects") progName = "Water\nProjects";

              return {
                program: progName,
                amount: item.amount,
                percent: `${perc}%`
              };
            });
            setBarData(newBarData);
          }
        }
      } catch (err) {
        console.error("Failed to fetch donation stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="bg-forest py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-64 h-64 bg-lime rounded-full absolute -top-20 -right-20" />
          <div className="w-48 h-48 bg-lime rounded-full absolute -bottom-10 -left-10" />
        </div>
        <div className="section-wrapper relative z-10">
          <span className="badge-lime mb-4 inline-block">100% Transparent</span>
          <h1 className="font-display font-black text-white text-4xl sm:text-5xl mb-4">
            A Global Commitment To{" "}
            <span className="text-lime">Trust & Transparency</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Our Promise. Verified Accountability. Your Impact.
          </p>
        </div>
      </div>

      <div className="section-wrapper py-14">

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* CHARTS ROW                                                     */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* ── Donut Chart: Financial Overview ──────────────────────── */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-forest text-xl mb-6">
              Annual Financial Overview
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1">
                {/* Legend */}
                <div className="space-y-2 mb-6">
                  {donutData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600 text-sm">{item.name}</span>
                      <span className="ml-auto font-bold text-sm text-forest">{item.value}%</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Total Income</span>
                    <span className="font-bold text-forest">${stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Total Expense</span>
                    <span className="font-bold text-red-500">${(stats.totalAmount * 0.85).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Net</span>
                    <span className="font-bold text-lime-dark">+${(stats.totalAmount * 0.15).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bar Chart: Donation Allocation ───────────────────────── */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-forest text-xl mb-6">
              Donation Allocation by Program
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="program"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  tickFormatter={(v) => v >= 1000000 ? `$${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="amount" fill="#D97706" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={index === 0 ? "#9CFC5C" : index === 1 ? "#D97706" : index === 2 ? "#F59E0B" : "#1B3022"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Data labels */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {barData.map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs text-gray-500">{item.program.replace("\n", " ")}</p>
                  <p className="text-xs font-bold text-forest">{item.percent}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SUCCESS STORIES + ANNUAL REPORTS ROW                          */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">

          {/* Success Stories (2/5) */}
          <div className="lg:col-span-2">
            <h2 className="font-display font-bold text-forest text-xl mb-5">Success Stories</h2>
            <div className="space-y-4">
              {successStories.map((story) => (
                <div key={story.id} className="card overflow-hidden">
                  <div className="relative h-40">
                    <img
                      src={story.image}
                      alt="Success story"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/70 to-transparent" />
                    <span className="absolute bottom-3 left-3 badge-lime text-xs">{story.location}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-500 text-xs italic mb-3">"{story.quote}"</p>
                    <button
                      onClick={() => navigate("/success-stories")}
                      className="text-forest font-semibold text-xs bg-lime/20 hover:bg-lime rounded-lg px-3 py-1.5 transition-colors"
                    >
                      Read Story →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Annual Reports + CTA (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Annual Reports Grid */}
            <div>
              <h2 className="font-display font-bold text-forest text-xl mb-5">Annual Reports</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {annualReports.map((report) => (
                  <div
                    key={report.year}
                    className="card p-4 text-center cursor-pointer hover:border-lime border-2 border-transparent"
                  >
                    <div className="w-16 h-16 mx-auto mb-3 relative">
                      {/* Book icon */}
                      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <rect x="8" y="8" width="48" height="48" rx="4" fill="#f0fdf4" stroke="#1B3022" strokeWidth="2" />
                        <path d="M20 20h24M20 28h24M20 36h16" stroke="#1B3022" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="42" cy="42" r="10" fill="#9CFC5C" />
                        <path d="M38 42 l3 3 5-5" stroke="#1B3022" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="font-display font-bold text-forest text-xs mb-1">{report.year}</p>
                    <p className="text-gray-400 text-xs mb-3">Annual Report</p>
                    <button
                      onClick={() => window.open(report.url, "_blank", "noopener,noreferrer")}
                      className="w-full text-xs bg-lime text-forest font-semibold py-1.5 rounded-lg hover:bg-lime-dark transition-colors"
                    >
                      Read more
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-forest rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime/10 rounded-full -translate-y-1/2 translate-x-1/4" />
              <h3 className="font-display font-bold text-white text-2xl mb-3">
                Be a Catalyst for Change.{" "}
                <span className="text-lime">Together, we can make a difference.</span>
              </h3>
              <p className="text-white/70 text-sm mb-6">
                Join us in transforming lives. Whether through donations, volunteering, or partnerships,
                your support helps build stronger communities and a better world.
              </p>
              <div className="flex justify-center gap-3">
                <button onClick={() => navigate("/donate")} className="btn-primary text-sm">
                  Donate Now
                </button>
                <button onClick={() => navigate("/volunteer")} className="btn-secondary text-sm">
                  Join with Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transparency;
