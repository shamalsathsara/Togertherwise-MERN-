/**
 * AdminLayout.jsx — Admin Portal Layout
 * Provides the sidebar navigation, header, and Outlet for nested admin routes.
 * All admin routes render their content inside this layout.
 */

import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/admin/projects", label: "Projects", icon: "📁" },
  { to: "/admin/projects/new", label: "New Project", icon: "➕" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={`${
          isSidebarOpen ? "w-56" : "w-16"
        } bg-forest flex flex-col transition-all duration-300 flex-shrink-0`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 flex-shrink-0">
              <path d="M12 28 C8 22, 6 16, 10 10 C12 7, 15 8, 16 11 L17 16" stroke="#9CFC5C" strokeWidth="2" strokeLinecap="round"/>
              <path d="M28 28 C32 22, 34 16, 30 10 C28 7, 25 8, 24 11 L23 16" stroke="#9CFC5C" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 11 L20 6 L24 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <ellipse cx="20" cy="5" rx="3" ry="4" fill="#9CFC5C" opacity="0.8"/>
              <path d="M10 30 Q20 35 30 30" stroke="#9CFC5C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {isSidebarOpen && (
              <div>
                <p className="font-display font-bold text-white text-sm leading-none">Togetherwise</p>
                <p className="text-white/40 text-[10px] mt-0.5">Administration Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold ${
                  isActive
                    ? "bg-lime text-forest"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-base flex-shrink-0">{icon}</span>
              {isSidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl
                       text-white/70 hover:bg-red-500/20 hover:text-red-300
                       transition-all duration-200 text-sm font-semibold"
          >
            <span className="text-base flex-shrink-0">🚪</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              ☰
            </button>
            <h1 className="font-display font-bold text-forest text-xl">OVERVIEW</h1>
          </div>

          {/* Admin User Badge */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">👤</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-forest text-sm">{user?.name || "Administrator"}</p>
              <p className="text-gray-400 text-xs">{user?.email || ""}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-600 transition-colors ml-2"
            >
              ↗ Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
