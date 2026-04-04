/**
 * NewsUpdatesList.jsx — Admin: News & Updates List
 * Lists all news items with edit and delete actions.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const STATUS_BADGE = {
  complete:    "bg-lime/20 text-forest",
  "in-progress": "bg-blue-100 text-blue-700",
  upcoming:    "bg-orange-100 text-orange-700",
  paused:      "bg-gray-100 text-gray-500",
};

const NewsUpdatesList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const fetchItems = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/news/admin");
      if (res.data.success) setItems(res.data.data);
    } catch (err) {
      setError("Failed to load news updates from the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/news/${itemToDelete}`);
      setItems((prev) => prev.filter((i) => i._id !== itemToDelete));
      setItemToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">News &amp; Updates</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">Manage the homepage News &amp; Updates section.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchItems} className="admin-btn-outline" disabled={isLoading}>↻ Refresh</button>
          <button onClick={() => navigate("/admin/news/new")} className="admin-btn-lime">+ New Item</button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
          <span className="text-red-400">⚠</span> {error}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Image</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tag / Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Content</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Visible</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400">
                    <div className="flex justify-center items-center gap-3">
                      <span className="w-5 h-5 border-2 border-lime/40 border-t-lime rounded-full animate-spin" />
                      <span className="text-sm">Loading…</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="text-gray-300 text-3xl mb-2">📰</div>
                    <p className="text-gray-400 text-sm">No news items yet.</p>
                    <p className="text-gray-300 text-xs mt-1">Click "+ New Item" to add one.</p>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const imageUrl = item.image
                    ? item.image.startsWith("http") ? item.image : `${API_BASE_URL}${item.image}`
                    : null;
                  return (
                    <tr key={item._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        {imageUrl ? (
                          <img src={imageUrl} alt="" className="w-14 h-14 object-cover rounded-lg border border-gray-100" />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xl">📷</div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-gray-700 mb-1">{item.tag}</p>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${STATUS_BADGE[item.status] || "bg-gray-100 text-gray-500"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 max-w-[280px]">
                        <p className="text-sm text-gray-600 line-clamp-2">{item.label}</p>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="text-sm text-gray-500">{item.order}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${item.isVisible ? "bg-lime/10 text-forest" : "bg-gray-100 text-gray-400"}`}>
                          {item.isVisible ? "Visible" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/admin/news/${item._id}/edit`)}
                            className="p-1.5 text-gray-400 hover:text-lime-dark hover:bg-lime/10 rounded-md transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setItemToDelete(item._id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="p-6">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-center text-gray-800 text-base mb-1">Delete News Item?</h3>
              <p className="text-gray-400 text-sm text-center mb-6">This action is permanent and cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => setItemToDelete(null)} className="flex-1 admin-btn-outline py-2.5" disabled={isDeleting}>Cancel</button>
                <button onClick={confirmDelete} className="flex-1 admin-btn-danger py-2.5" disabled={isDeleting}>
                  {isDeleting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsUpdatesList;
