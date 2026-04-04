import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const SuccessStoriesList = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const fetchStories = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/success-stories");
      if (response.data.success) {
        setStories(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError("Failed to load success stories from the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const confirmDelete = async () => {
    if (!storyToDelete) return;
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/success-stories/${storyToDelete}`);
      if (response.data.success) {
        setStories(stories.filter(s => s._id !== storyToDelete));
        setStoryToDelete(null);
      }
    } catch (err) {
      console.error("Error deleting story:", err);
      setError(err.response?.data?.message || "Failed to delete from the server.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">Success Stories</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">Manage stories of people your platform has impacted.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchStories} className="admin-btn-outline" disabled={isLoading}>
            ↻ Refresh
          </button>
          <Link to="/admin/success-stories/new" className="admin-btn-lime">
            + New Story
          </Link>
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
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Photo</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Title & Quote</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Person</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400">
                    <div className="flex justify-center items-center gap-3">
                      <span className="w-5 h-5 border-2 border-lime/40 border-t-lime rounded-full animate-spin"></span>
                      <span className="text-sm">Loading stories…</span>
                    </div>
                  </td>
                </tr>
              ) : stories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="text-gray-300 text-3xl mb-2">⭐</div>
                    <p className="text-gray-400 text-sm">No success stories yet.</p>
                    <p className="text-gray-300 text-xs mt-1">Click "+ New Story" to add one.</p>
                  </td>
                </tr>
              ) : (
                stories.map((story) => (
                  <tr key={story._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <img 
                        src={story.image.startsWith("http") ? story.image : `${API_BASE_URL}${story.image}`} 
                        alt={story.title} 
                        className="w-14 h-14 object-cover rounded-lg border border-gray-100"
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-800 mb-0.5 line-clamp-1">{story.title}</p>
                      <p className="text-[12px] text-gray-400 italic line-clamp-1 max-w-[220px]">"{story.quote}"</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-lime/10 text-forest">{story.tag}</span>
                      <p className="text-[12px] text-gray-400 mt-1">📍 {story.location}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-700">{story.person}</p>
                      <p className="text-[12px] text-gray-400">{story.role}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => navigate(`/admin/success-stories/${story._id}/edit`)}
                          className="p-1.5 text-gray-400 hover:text-lime-dark hover:bg-lime/10 rounded-md transition-colors cursor-pointer"
                          title="Edit Story"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button 
                          onClick={() => setStoryToDelete(story._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Story"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {storyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="p-6">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              </div>
              <h3 className="font-semibold text-center text-gray-800 text-base mb-1">Delete Story?</h3>
              <p className="text-gray-400 text-sm text-center mb-6">This action is permanent and cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => setStoryToDelete(null)} className="flex-1 admin-btn-outline py-2.5" disabled={isDeleting}>
                  Cancel
                </button>
                <button onClick={confirmDelete} className="flex-1 admin-btn-danger py-2.5" disabled={isDeleting}>
                  {isDeleting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStoriesList;
