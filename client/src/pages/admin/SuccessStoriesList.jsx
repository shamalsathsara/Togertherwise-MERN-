import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const SuccessStoriesList = () => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use the full URL for development image loading since /uploads is on the server
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-forest text-2xl">Success Stories</h2>
          <p className="text-gray-500 text-sm">Manage stories of people your platform has impacted.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchStories} className="btn-secondary text-sm border-gray-200" disabled={isLoading}>
            ↻ Refresh
          </button>
          <Link to="/admin/success-stories/new" className="btn-primary text-sm shadow-none">
            + New Story
          </Link>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Photo</th>
                <th className="p-4 font-medium">Title & Quote</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Person</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-400">
                    <span className="w-5 h-5 border-2 border-lime border-t-transparent rounded-full animate-spin inline-block align-middle mr-2"></span>
                    Loading stories...
                  </td>
                </tr>
              ) : stories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-400">
                    No success stories yet. Click "+ New Story" to add one!
                  </td>
                </tr>
              ) : (
                stories.map((story) => (
                  <tr key={story._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      {/* Check if image is an external URL or an uploaded file */}
                      <img 
                        src={story.image.startsWith("http") ? story.image : `${API_BASE_URL}${story.image}`} 
                        alt={story.title} 
                        className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                      />
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-forest mb-1 line-clamp-1">{story.title}</p>
                      <p className="text-xs text-gray-500 italic line-clamp-1 max-w-[200px]">"{story.quote}"</p>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      <span className="badge-lime text-xs bg-lime/10">{story.tag}</span>
                      <br />📍 {story.location}
                    </td>
                    <td className="p-4 text-sm">
                      <p className="font-semibold text-forest">{story.person}</p>
                      <p className="text-xs text-gray-400">{story.role}</p>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setStoryToDelete(story._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Story"
                      >
                        <span className="text-lg">🗑️</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {storyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 overflow-hidden animate-slide-up">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto text-red-600 text-xl">⚠️</div>
            <h3 className="font-display font-bold text-center text-forest text-lg mb-2">Delete Success Story?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">This action is permanent and cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setStoryToDelete(null)}
                className="flex-1 btn-secondary text-sm border-gray-200 text-gray-600 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-xl hover:bg-red-600 text-sm flex justify-center items-center"
                disabled={isDeleting}
              >
                {isDeleting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStoriesList;
