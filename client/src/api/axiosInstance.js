/**
 * axiosInstance.js — Configured Axios HTTP Client
 *
 * Key configuration:
 * - baseURL: Points to our Express API (proxied by Vite in development)
 * - withCredentials: true — ensures cookies (JWT) are sent with every request
 *   This is CRITICAL for the HttpOnly cookie authentication to work.
 */

import axios from "axios";

const axiosInstance = axios.create({
  // In development, Vite proxies /api → http://localhost:5000
  // In production, this should be your deployed API URL
  baseURL: "/api",

  // Send cookies with every cross-origin request
  // Required for HttpOnly JWT cookies to be included automatically
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    "Bypass-Tunnel-Reminder": "true",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Add any extra headers or logging before each request
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add request timing, logging, etc. here
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handle global errors (e.g., 401 Unauthorized → redirect to login)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401 (token expired or invalid), redirect to login
    // BUT only if the user is currently on an admin page — public pages
    // should never be affected by auth failures (e.g. the /auth/me session check)
    if (error.response?.status === 401) {
      const isOnAdminPage = window.location.pathname.startsWith("/admin");
      const isAlreadyOnLogin = window.location.pathname.includes("/admin/login");
      if (isOnAdminPage && !isAlreadyOnLogin) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
