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
    <div className="space-y-5 max-w-6xl">
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">Projects</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">Manage campaigns and view funding progress.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchProjects}
            className="admin-btn-outline"
            disabled={isLoading}
          >
            ↻ {isLoading ? "Refreshing…" : "Refresh"}
          </button>
          <button 
            onClick={() => navigate("/admin/projects/new")}
            className="admin-btn-lime"
          >
            + Add Project
          </button>
        </div>
      </div>

      {/* ── Error Message ────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
          <span className="text-red-400">⚠</span> {error}
        </div>
      )}

      {/* ── Data Table ──────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Project Title</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Goal</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Raised</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400">
                    <div className="flex justify-center items-center gap-3">
                      <span className="w-5 h-5 border-2 border-lime/40 border-t-lime rounded-full animate-spin"></span>
                      <span className="text-sm">Loading projects…</span>
                    </div>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="text-gray-300 text-3xl mb-2">📁</div>
                    <p className="text-gray-400 text-sm">No projects found.</p>
                    <p className="text-gray-300 text-xs mt-1">Click "Add Project" to create one.</p>
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-gray-800">{p.title}</span>
                      {p.isFeatured && (
                        <span className="ml-2 inline-block px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-semibold rounded">
                          ⭐ Featured
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {p.category}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 font-medium tabular-nums">
                      ${p.goal?.toLocaleString() || 0}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-forest tabular-nums">
                      ${p.currentFunds?.toLocaleString() || 0}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize
                        ${p.status === "active" ? "bg-emerald-50 text-emerald-700" : 
                          p.status === "completed" ? "bg-blue-50 text-blue-600" :
                          p.status === "paused" ? "bg-amber-50 text-amber-600" :
                          "bg-gray-50 text-gray-500"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => navigate(`/admin/projects/${p._id}/edit`)}
                          className="p-1.5 text-gray-400 hover:text-forest hover:bg-forest/5 rounded-md transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(p._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Project"
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

      {/* ── Delete Confirmation Modal ────────────────────────────── */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="p-6">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              </div>
              <h3 className="font-semibold text-center text-gray-800 text-base mb-1">Delete Project?</h3>
              <p className="text-gray-400 text-sm text-center mb-6">This action is permanent and cannot be undone.</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setProjectToDelete(null)}
                  className="flex-1 admin-btn-outline py-2.5"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 admin-btn-danger py-2.5"
                  disabled={isDeleting}
                >
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

export default ProjectsList;
