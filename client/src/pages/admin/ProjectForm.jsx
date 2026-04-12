/**
 * ProjectForm.jsx — Admin: Add / Edit Project Form
 * Provides a form to create or update community projects.
 * Supports file upload for images and videos via the Multer backend.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const CATEGORIES = [
  "Water Projects", "Reforestation", "Medical Aid",
  "Education", "Community Development", "Other",
];

const STATUS_OPTIONS = ["active", "upcoming", "paused", "completed"];

const ProjectForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = mode === "edit" && id;

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    goal: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    category: "Other",
    status: "active",
    isFeatured: false,
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Load existing project data when editing
  useEffect(() => {
    if (isEditing) {
      const fetchProject = async () => {
        try {
          const { data } = await axiosInstance.get(`/projects/${id}`);
          if (data.success) {
            const p = data.project;
            setFormData({
              title: p.title || "",
              shortDescription: p.shortDescription || "",
              description: p.description || "",
              goal: p.goal || "",
              startDate: p.startDate ? p.startDate.split("T")[0] : "",
              endDate: p.endDate ? p.endDate.split("T")[0] : "",
              category: p.category || "Other",
              status: p.status || "active",
              isFeatured: p.isFeatured || false,
            });
          }
        } catch {
          setError("Failed to load project. Check server connection.");
        }
      };
      fetchProject();
    }
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
    const urls = files.map((f) => {
      if (f.type.startsWith("image/")) {
        return URL.createObjectURL(f);
      }
      return null;
    });
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.description || !formData.goal) {
      setError("Title, description, and goal amount are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, val);
      });
      mediaFiles.forEach((file) => data.append("media", file));

      if (isEditing) {
        await axiosInstance.put(`/projects/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/projects", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/projects");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to save project. Ensure the server is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="font-semibold text-gray-800 text-lg">
            Project {isEditing ? "Updated" : "Created"}!
          </h3>
          <p className="text-gray-400 text-sm mt-1">Redirecting to projects…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Back link */}
      <button 
        onClick={() => navigate("/admin/projects")}
        className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm mb-5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to Projects
      </button>

      <div className="bg-white rounded-xl border border-gray-100 p-7">
        <h2 className="font-semibold text-gray-800 text-lg mb-6">
          {isEditing ? "Edit Project" : "New Project"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Project Title */}
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5" htmlFor="proj-title">Project Title *</label>
            <input
              id="proj-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Community Garden Initiative"
              className="input-field"
              required
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5" htmlFor="proj-short-desc">Short Description</label>
            <input
              id="proj-short-desc"
              name="shortDescription"
              type="text"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief overview (max 150 chars)"
              maxLength={300}
              className="input-field"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5" htmlFor="proj-desc">Full Description *</label>
            <textarea
              id="proj-desc"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed project description…"
              className="input-field resize-none"
              required
            />
          </div>

          {/* Goal + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5" htmlFor="proj-goal">Funding Goal (LKR) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">LKR</span>
                <input
                  id="proj-goal"
                  name="goal"
                  type="number"
                  value={formData.goal}
                  onChange={handleChange}
                  placeholder="50000"
                  min="0"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5" htmlFor="proj-category">Category</label>
              <select id="proj-category" name="category" value={formData.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5" htmlFor="proj-start">Start Date</label>
              <select
                id="proj-start"
                name="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="input-field"
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const d = new Date();
                  d.setMonth(d.getMonth() - 12 + i);
                  const val = d.toISOString().split("T")[0];
                  const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
                  return <option key={val} value={val}>{label}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5" htmlFor="proj-status">Status</label>
              <select id="proj-status" name="status" value={formData.status} onChange={handleChange} className="input-field">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Upload Media</label>
            <div
              className="border border-dashed border-gray-200 rounded-xl p-6 text-center
                         hover:border-lime hover:bg-lime/[0.02] transition-all cursor-pointer"
              onClick={() => document.getElementById("media-upload").click()}
            >
              <input
                id="media-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-gray-300">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <p className="text-gray-500 text-sm font-medium">Click to upload images or videos</p>
                <p className="text-gray-300 text-xs">JPEG, PNG, WebP, MP4 — Max 50MB each</p>
              </div>
            </div>

            {previewUrls.length > 0 && (
              <div className="flex gap-2.5 mt-3 flex-wrap">
                {previewUrls.map((url, i) =>
                  url ? (
                    <div key={i} className="relative w-16 h-16">
                      <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrls(prev => prev.filter((_, idx) => idx !== i));
                          setMediaFiles(prev => prev.filter((_, idx) => idx !== i));
                        }}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div key={i} className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-300">
                        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Featured Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-lime focus:ring-lime border-gray-300 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
              Mark as Featured Project
            </span>
          </label>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-600 flex items-center gap-2">
              <span className="text-red-400">⚠</span> {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/projects")}
              className="flex-1 admin-btn-outline py-2.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 admin-btn-lime py-2.5"
              id="save-project-btn"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-forest/30 border-t-forest rounded-full animate-spin"/>
                  Saving…
                </span>
              ) : (
                isEditing ? "Update Project" : "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
