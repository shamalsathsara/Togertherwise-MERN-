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
import SEO from "../components/SEO";
import { useTranslation } from "react-i18next";




// Custom tooltip for bar chart
const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const formattedVal = val >= 1000000
      ? `LKR ${(val / 1000000).toFixed(1)}M`
      : val >= 1000
        ? `LKR ${(val / 1000).toFixed(1)}k`
        : `LKR ${val}`;

    return (
      <div className="card-luxury p-3 text-sm" style={{ minWidth: "140px" }}>
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalAmount: 0 });
  const [donutData, setDonutData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [liveStories, setLiveStories] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

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
              { name: t('transpx_donut1'), value: 100, color: "#9CFC5C" },
              { name: t('transpx_donut2'), value: 0, color: "#D97706" },
              { name: t('transpx_donut3'), value: 0, color: "#F59E0B" },
              { name: t('transpx_donut4'), value: 0, color: "#D1D5DB" },
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
              
              const catKeys = {
                "Water Projects": t('camp_water'),
                "Education": t('camp_edu'),
                "Medical Aid": t('camp_med'),
                "Reforestation": t('camp_forest'),
                "Community Development": t('camp_dev')
              };
              progName = catKeys[progName] || progName;

              return {
                program: progName,
                amount: item.amount,
                percent: `${perc}%`
              };
            });
            setBarData(newBarData);
          }
        }
        // Fetch success stories for this page
        const storiesRes = await axiosInstance.get("/success-stories");
        if (storiesRes.data.success) {
          setLiveStories(storiesRes.data.data.slice(0, 2));
        }
      } catch (err) {
        console.error("Failed to fetch donation stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #f5f8f5 0%, #eef4ef 100%)" }}>
      <SEO
        title="Trust & Transparency"
        description="Our promise to you: verified accountability and 100% transparency in how your donations are used to empower communities."
        path="/transparency"
      />

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="relative py-28 text-center overflow-hidden" style={{
        background: "linear-gradient(135deg, #111E16 0%, #1B3022 55%, #2D4F37 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.1)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.07)", transform: "translate(-20%,20%)" }} />
          <div className="absolute top-8 right-12 w-40 h-40 rounded-full border border-lime/10 hidden lg:block" />
          <div className="absolute bottom-8 left-12 w-24 h-24 rounded-full border border-white/6 hidden lg:block" />
          {/* Lock icon floating */}
          <div className="absolute top-1/2 right-16 hidden xl:flex items-center justify-center text-lime/15 w-16 h-16 animate-float" style={{ transform:"translateY(-50%)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div className="absolute top-1/2 left-16 hidden xl:flex items-center justify-center text-lime/10 w-12 h-12 animate-float" style={{ transform:"translateY(-50%)", animationDelay:"1.5s" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>

        <div className="section-wrapper relative z-10">
          <span className="badge-lime mb-5 inline-block animate-fade-in">{t('transpx_badge')}</span>
          <h1 className="font-display font-black text-white text-4xl sm:text-5xl mb-4 animate-slide-up leading-tight">
            {t('transpx_hero1')}
            <span className="text-gradient-lime">{t('transpx_hero2')}</span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto animate-slide-up delay-200">
            {t('transpx_heroDesc')}
          </p>
        </div>
      </div>

      <div className="section-wrapper py-14">

        {/* */}
        {/* CHARTS ROW  */}
        {/*  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/*  Donut Chart: Financial Overview */}
          <div className="card-luxury p-7">
            {/* Card header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(to bottom,#9CFC5C,#7DD940)" }} />
              <h2 className="font-display font-bold text-forest text-xl">
                {t('transpx_donutTitle')}
              </h2>
            </div>

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
                      paddingAngle={3}
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
                <div className="rounded-2xl p-4 space-y-2" style={{ background: "rgba(27,48,34,0.04)", border: "1px solid rgba(27,48,34,0.06)" }}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">{t('transpx_totInc')}</span>
                    <span className="font-bold text-forest">${stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">{t('transpx_totExp')}</span>
                    <span className="font-bold text-red-500">${(stats.totalAmount * 0.85).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="pt-2 flex justify-between text-sm" style={{ borderTop: "1px solid rgba(27,48,34,0.08)" }}>
                    <span className="text-gray-600 font-medium">{t('transpx_net')}</span>
                    <span className="font-bold" style={{ color: "#7DD940" }}>+${(stats.totalAmount * 0.15).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  Bar Chart: Donation Allocation */}
          <div className="card-luxury p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(to bottom,#9CFC5C,#7DD940)" }} />
              <h2 className="font-display font-bold text-forest text-xl">
                {t('transpx_barTitle')}
              </h2>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,48,34,0.06)" />
                <XAxis
                  dataKey="program"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  tickFormatter={(v) => v >= 1000000 ? `LKR ${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `LKR ${(v / 1000).toFixed(0)}k` : `LKR ${v}`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="amount" fill="#D97706" radius={[8, 8, 0, 0]}>
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

        {/* SUCCESS STORIES + ANNUAL REPORTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">

          {/* Success Stories (2/5) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(to bottom,#9CFC5C,#7DD940)" }} />
              <h2 className="font-display font-bold text-forest text-xl">{t('transpx_storiesTitle')}</h2>
            </div>

            {liveStories.length === 0 ? (
              <div className="card-luxury p-10 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(27,48,34,0.05)", color: "#1B3022" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                </div>
                <p className="text-gray-400 text-sm">{t('transpx_storiesEmpty')}</p>
                <button onClick={() => navigate("/success-stories")} className="mt-4 text-xs text-forest font-semibold hover:text-lime-dark transition-colors">{t('transpx_storiesViewAll')}</button>
              </div>
            ) : (
              <div className="space-y-4">
                {liveStories.map((story) => (
                  <div key={story._id} className="card-luxury overflow-hidden">
                    <div className="relative h-40">
                      <img
                        src={story.image.startsWith("http") ? story.image : `${API_BASE_URL}${story.image}`}
                        alt="Success story"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest/80 to-transparent" />
                      <span className="absolute bottom-3 left-3 badge-lime text-xs">{story.location}</span>
                    </div>
                    <div className="p-5">
                      {/* Quote accent */}
                      <div className="w-5 h-0.5 rounded-full mb-2" style={{ background: "linear-gradient(90deg,#9CFC5C,#7DD940)" }} />
                      <p className="text-gray-500 text-xs italic mb-4 line-clamp-2">"{story.quote}"</p>
                      <button
                        onClick={() => navigate("/success-stories")}
                        className="text-forest font-semibold text-xs transition-colors hover:text-lime-dark flex items-center gap-1"
                      >
                        {t('transpx_storyRead')} <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Annual Reports + CTA (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Annual Reports — Coming Soon */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(to bottom,#9CFC5C,#7DD940)" }} />
                <h2 className="font-display font-bold text-forest text-xl">{t('transpx_annualTitle')}</h2>
              </div>
              <div className="card-luxury p-10 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(27,48,34,0.05)", color: "#1B3022" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <p className="font-semibold text-forest text-base mb-2">{t('transpx_comingSoon')}</p>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">
                  {t('transpx_annualDesc')}
                </p>
              </div>
            </div>

            {/* CTA Box */}
            <div className="rounded-2xl p-8 text-center relative overflow-hidden" style={{
              background: "linear-gradient(135deg, #111E16 0%, #1B3022 55%, #2D4F37 100%)"
            }}>
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl" style={{ background: "rgba(156,252,92,0.1)", transform: "translate(20%,-20%)" }} />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl" style={{ background: "rgba(156,252,92,0.08)", transform: "translate(-20%,20%)" }} />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4" style={{ background: "rgba(156,252,92,0.12)", border: "1px solid rgba(156,252,92,0.25)" }}>
                  <span className="text-lime text-xs font-semibold">{t('transpx_ctaBadge')}</span>
                </div>

                <h3 className="font-display font-bold text-white text-2xl mb-3 leading-tight">
                  {t('home_ctaTitle3')}
                  <span className="text-gradient-lime">{t('home_ctaTitle4')}</span>
                </h3>
                <p className="text-white/65 text-sm mb-6 leading-relaxed">
                  {t('home_ctaDesc')}
                </p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => navigate("/donate")} className="btn-primary text-sm">
                    {t('home_donateNowCta')}
                  </button>
                  <button onClick={() => navigate("/volunteer")} className="btn-secondary text-sm">
                    {t('home_joinBtn')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transparency;
