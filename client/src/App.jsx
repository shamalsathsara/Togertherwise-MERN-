/**
 * App.jsx — React Router Configuration
 * Defines all public and protected routes.
 * Admin routes are protected by ProtectedAdminRoute which checks for admin role.
 */

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ── Layout 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ── Public Pages 
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import SuccessStories from "./pages/SuccessStories";
import AboutUs from "./pages/AboutUs";
import Donate from "./pages/Donate";
import Transparency from "./pages/Transparency";
import Volunteer from "./pages/Volunteer";

// ── Admin Pages 
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProjectsList from "./pages/admin/ProjectsList";
import ProjectForm from "./pages/admin/ProjectForm";
import DonationsList from "./pages/admin/DonationsList";
import SuccessStoriesList from "./pages/admin/SuccessStoriesList";
import SuccessStoryForm from "./pages/admin/SuccessStoryForm";
import MessagesList from "./pages/admin/MessagesList";
import VolunteersList from "./pages/admin/VolunteersList";
import SubscribersList from "./pages/admin/SubscribersList";
import NewsUpdatesList from "./pages/admin/NewsUpdatesList";
import NewsUpdateForm from "./pages/admin/NewsUpdateForm";

/**
 * ProtectedAdminRoute — Wraps admin routes.
 * Redirects to /admin/login if the user is not authenticated or not an admin.
 * Shows a loading spinner while checking the session.
 */
const ProtectedAdminRoute = ({ children }) => {
  const { user, isLoading, isAdmin } = useAuth();

  // While checking auth status, show a centered spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-lime border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or not admin → redirect to login
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

/**
 * PublicLayout — Wraps all public pages with Navbar and Footer.
 */
const PublicLayout = ({ children, lang, setLang }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar lang={lang} setLang={setLang} />
    <main className="flex-1 pt-16">
      {children}
    </main>
    <Footer />
  </div>
);

/**
 * AppRoutes — The route definitions, inside AuthProvider context.
 */
const AppRoutes = () => {
  // Language state lifted here so both Navbar and pages can access it
  const [lang, setLang] = useState("en");

  return (
    <Routes>
      {/* ── Public Routes */}
      <Route path="/" element={
        <PublicLayout lang={lang} setLang={setLang}>
          <Home lang={lang} />
        </PublicLayout>
      } />

      <Route path="/campaigns" element={
        <PublicLayout lang={lang} setLang={setLang}>
          <Campaigns lang={lang} />
        </PublicLayout>
      } />

      <Route path="/success-stories" element={
        <PublicLayout lang={lang} setLang={setLang}>
          <SuccessStories lang={lang} />
        </PublicLayout>
      } />

      <Route path="/about" element={
        <PublicLayout lang={lang} setLang={setLang}>
          <AboutUs lang={lang} />
        </PublicLayout>
      } />

      <Route path="/donate" element={
        <PublicLayout lang={lang} setLang={setLang}>
          <Donate lang={lang} />
        </PublicLayout>
      } />

      <Route path="/transparency" element={
        <PublicLayout lang={lang} setLang={setLang}>
          <Transparency lang={lang} />
        </PublicLayout>
      } />

      <Route path="/volunteer" element={
        <PublicLayout lang={lang} setLang={setLang}>
          <Volunteer lang={lang} />
        </PublicLayout>
      } />

      {/* ── Admin Login (public)  */}
      <Route path="/admin/login" element={<Login />} />

      {/* ── Protected Admin Routes  */}
      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      }>
        {/* Default admin route → Dashboard */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="projects/new" element={<ProjectForm mode="create" />} />
        <Route path="projects/:id/edit" element={<ProjectForm mode="edit" />} />
        <Route path="donations" element={<DonationsList />} />
        <Route path="success-stories" element={<SuccessStoriesList />} />
        <Route path="success-stories/new" element={<SuccessStoryForm mode="create" />} />
        <Route path="success-stories/:id/edit" element={<SuccessStoryForm mode="edit" />} />
        <Route path="news" element={<NewsUpdatesList />} />
        <Route path="news/new" element={<NewsUpdateForm mode="create" />} />
        <Route path="news/:id/edit" element={<NewsUpdateForm mode="edit" />} />
        <Route path="messages" element={<MessagesList />} />
        <Route path="volunteers" element={<VolunteersList />} />
        <Route path="subscribers" element={<SubscribersList />} />
      </Route>

      {/* ── 404 → Home  */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/**
 * App — Root component. Wraps everything in Router and AuthProvider.
 */
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
