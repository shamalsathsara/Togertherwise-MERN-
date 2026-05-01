/**
 * AdminLayout.jsx — Admin Portal Layout
 * Provides the sidebar navigation, header, and Outlet for nested admin routes.
 * All admin routes render their content inside this layout.
 */

import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoImg from "../../image/logo.png";

/* ── SVG Icon Components ──────────────────────────────────────────────────── */
const Icon = ({ d, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] flex-shrink-0" {...props}>
    <path d={d} />
  </svg>
);

const Icons = {
  dashboard: (p) => <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" {...p} />,
  projects: (p) => <Icon d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" {...p} />,
  add: (p) => <Icon d="M12 5v14 M5 12h14" {...p} />,
  donations: (p) => <Icon d="M12 2v20 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" {...p} />,
  stories: (p) => <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01z" {...p} />,
  messages: (p) => <Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" {...p} />,
  volunteers: (p) => <Icon d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75" {...p} />,
  subscribers: (p) => <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" {...p} />,
  logout: (p) => <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9" {...p} />,
  menu: (p) => <Icon d="M3 12h18 M3 6h18 M3 18h18" {...p} />,
  site: (p) => <Icon d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3" {...p} />,
  news: (p) => <Icon d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM12 12H8M16 8H8M16 16H8" {...p} />,
  students: (p) => <Icon d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75" {...p} />,
  addUser: (p) => <Icon d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M12.5 7a4 4 0 11-8 0 4 4 0 018 0zM20 8v6M23 11h-6" {...p} />,
};

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: Icons.dashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/projects", label: "Projects", icon: Icons.projects },
      { to: "/admin/projects/new", label: "New Project", icon: Icons.add },
      { to: "/admin/success-stories", label: "Stories", icon: Icons.stories },
      { to: "/admin/news", label: "News & Updates", icon: Icons.news },
    ],
  },
  {
    label: "Engagement",
    items: [
      { to: "/admin/donations", label: "Donations", icon: Icons.donations },
      { to: "/admin/messages", label: "Messages", icon: Icons.messages },
      { to: "/admin/volunteers", label: "Volunteers", icon: Icons.volunteers },
      { to: "/admin/subscribers", label: "Subscribers", icon: Icons.subscribers },
    ],
  },
  {
    label: "Community",
    items: [
      { to: "/admin/students", label: "Students", icon: Icons.students },
      { to: "/admin/students/new", label: "Register Student", icon: Icons.addUser },
    ],
  },
];

/* ── Page title helper ────────────────────────────────────────────────────── */
const PAGE_TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/projects": "Projects",
  "/admin/projects/new": "New Project",
  "/admin/donations": "Donations",
  "/admin/success-stories": "Success Stories",
  "/admin/success-stories/new": "New Story",
  "/admin/news": "News & Updates",
  "/admin/news/new": "New News Item",
  "/admin/messages": "Messages",
  "/admin/volunteers": "Volunteers",
  "/admin/subscribers": "Subscribers",
  "/admin/students": "Students",
  "/admin/students/new": "Register Student",
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const pageTitle = PAGE_TITLES[location.pathname] || "Admin";

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={`${isSidebarOpen ? "w-60" : "w-[68px]"
          } bg-gradient-to-b from-[#1a3a2a] to-[#0f2419] flex flex-col transition-all duration-300 flex-shrink-0 border-r border-white/5`}
      >
        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-lime/15 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={logoImg} alt="Togertherwerise Logo" className="w-7 h-7 object-contain" />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-display font-bold text-white text-[15px] leading-none tracking-tight">TogetherWErise</p>
                <p className="text-white/30 text-[10px] mt-1 font-medium tracking-widest uppercase">Admin Portal</p>
              </div >
            )}
          </div >
        </div >

  {/* Navigation */ }
  < nav className = "flex-1 py-4 px-3 space-y-5 overflow-y-auto custom-scrollbar" >
  {
    NAV_SECTIONS.map((section) => (
      <div key={section.label}>
        {isSidebarOpen && (
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em] px-3 mb-2">
            {section.label}
          </p>
        )}
        <div className="space-y-0.5">
          {section.items.map(({ to, label, icon: IconComp }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 text-[13px] font-medium group ${isActive
                  ? "bg-lime/90 text-[#1a3a2a] shadow-sm shadow-lime/20"
                  : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
                }`
              }
            >
              <IconComp />
              {isSidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </div>
      </div>
    ))
  }
        </nav >

  {/* Bottom Actions */ }
  < div className = "px-3 py-3 border-t border-white/[0.06] space-y-1" >
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/40 hover:bg-white/[0.06] hover:text-white/70 transition-all duration-150 text-[13px] font-medium"
          >
            <Icons.site />
            {isSidebarOpen && <span>View Website</span>}
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg
                       text-white/40 hover:bg-red-500/10 hover:text-red-400
                       transition-all duration-150 text-[13px] font-medium"
          >
            <Icons.logout />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div >
      </aside >

  {/* ── Main Content ──────────────────────────────────────────────── */ }
  < div className = "flex-1 flex flex-col overflow-hidden" >
    {/* Top Header */ }
    < header className = "bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-3.5 flex items-center justify-between flex-shrink-0 sticky top-0 z-30" >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <Icons.menu />
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 font-medium">Admin</span>
          <span className="text-gray-300">/</span>
          <span className="text-forest font-semibold">{pageTitle}</span>
        </div>
      </div>

{/* Admin User Badge */ }
<div className="flex items-center gap-3">
  <div className="text-right hidden sm:block">
    <p className="font-semibold text-gray-700 text-[13px] leading-none">{user?.name || "Administrator"}</p>
    <p className="text-gray-400 text-[11px] mt-0.5">{user?.email || ""}</p>
  </div>
  <div className="w-8 h-8 bg-gradient-to-br from-forest to-forest-light rounded-lg flex items-center justify-center text-white text-xs font-bold">
    {(user?.name || "A").charAt(0).toUpperCase()}
  </div>
</div>
        </header >

  {/* Page Content */ }
  < main className = "flex-1 overflow-auto p-6" >
    <Outlet />
        </main >
      </div >
    </div >
  );
};

export default AdminLayout;
