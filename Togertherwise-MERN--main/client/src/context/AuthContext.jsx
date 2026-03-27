/**
 * AuthContext.jsx — Global Authentication State
 *
 * Provides authentication state to all components via React Context.
 * - Stores the current user object
 * - Exposes login, logout, and loading state
 * - Automatically checks for an existing session on app load
 *
 * Usage:
 *   import { useAuth } from '../context/AuthContext';
 *   const { user, login, logout, isLoading } = useAuth();
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

// Create the context with a default value
const AuthContext = createContext(null);

/**
 * AuthProvider — Wraps the application and provides auth state.
 * Place this as high as possible in the component tree (in App.jsx).
 */
export const AuthProvider = ({ children }) => {
  // The logged-in user object (null if not authenticated)
  const [user, setUser] = useState(null);

  // True while we're checking if the user is already logged in on page load
  const [isLoading, setIsLoading] = useState(true);

  // ─── Check Existing Session on Mount ────────────────────────────────────
  // On app load, call /api/auth/me to see if the JWT cookie is still valid.
  // This restores the user's session after a page refresh.
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/me");
        if (data.success) {
          setUser(data.user);
        }
      } catch {
        // No valid session — user is logged out (this is normal)
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // ─── Login ───────────────────────────────────────────────────────────────
  /**
   * Sends login credentials to the server. On success, the server sets
   * the JWT as an HttpOnly cookie, and we store the user in state.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", { email, password });
      if (data.success) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return { success: false, error: message };
    }
  };

  // ─── Logout ──────────────────────────────────────────────────────────────
  /**
   * Calls the logout endpoint to clear the HttpOnly cookie on the server,
   * then clears the user from local state.
   */
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Even if the request fails, clear the local state
    } finally {
      setUser(null);
    }
  };

  // The value exposed to all consumers of this context
  const contextValue = {
    user,           // Current user object (null = not logged in)
    isLoading,      // True while checking for existing session
    isAdmin: user?.role === "admin", // Convenience flag
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth — Custom hook for consuming AuthContext.
 * Throws an error if used outside of AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
