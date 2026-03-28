import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/projects");
      if (response.data.success) {
        setProjects(response.data.projects);
      } else {
        setError("Failed to fetch projects.");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setProjectToDelete(id);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/projects/${projectToDelete}`);
      if (response.data.success) {
        setProjects(projects.filter(p => p._id !== projectToDelete));
        setProjectToDelete(null);
      } else {
        setError("Failed to delete project.");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      setError(err.response?.data?.message || "Failed to delete from the server.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-forest text-2xl">Projects</h2>
          <p className="text-gray-500 text-sm">Manage campaigns and view funding progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchProjects}
            className="btn-secondary py-2 text-sm text-forest border-gray-200 hover:bg-gray-50 flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "↻ Refresh"}
          </button>
          <button 
            onClick={() => navigate("/admin/projects/new")}
            className="btn-primary py-2 text-sm flex items-center gap-2"
          >
            ➕ Add New Project
          </button>
        </div>
      </div>

      {/* ── Error Message ────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* ── Data Table ──────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium min-w-[200px]">Project Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Goal</th>
                <th className="p-4 font-medium">Raised</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-400">
                    <div className="flex justify-center items-center gap-3">
                      <span className="w-5 h-5 border-2 border-lime border-t-transparent rounded-full animate-spin"></span>
                      Loading projects...
                    </div>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-400">
                    No projects found. Click "Add New Project" to create one.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-forest">
                      {p.title}
                      {p.isFeatured && (
                        <span className="ml-2 inline-block px-2 py-0.5 bg-lime/20 text-forest text-[10px] rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {p.category}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-600">
                      ${p.goal?.toLocaleString() || 0}
                    </td>
                    <td className="p-4 text-sm font-bold text-forest">
                      ${p.currentFunds?.toLocaleString() || 0}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${p.status === "active" ? "bg-lime/20 text-forest" : 
                          p.status === "completed" ? "bg-blue-100 text-blue-700" :
                          p.status === "paused" ? "bg-amber-100 text-amber-700" :
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/admin/projects/${p._id}/edit`)}
                        className="p-1.5 text-form hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <span className="text-lg text-gray-500">✏️</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(p._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Project"
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

      {/* ── Delete Confirmation Modal ────────────────────────────── */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto text-red-600 text-xl">
                ⚠️
              </div>
              <h3 className="font-display font-bold text-center text-forest text-lg mb-2">Delete Project?</h3>
              <p className="text-gray-500 text-sm text-center mb-6">
                This action is permanent and cannot be undone. Are you sure you want to delete this specific project?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setProjectToDelete(null)}
                  className="flex-1 btn-secondary text-sm border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-xl hover:bg-red-600 transition-colors text-sm disabled:opacity-50 flex justify-center items-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
