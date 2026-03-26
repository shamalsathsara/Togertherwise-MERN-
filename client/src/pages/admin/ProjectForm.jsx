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

  // Handle file selection and preview generation
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
    // Generate preview URLs for images
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
      // Use FormData to support both JSON fields and file uploads
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
        navigate("/admin/dashboard");
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
          <div className="w-16 h-16 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="font-display font-bold text-forest text-2xl">
            Project {isEditing ? "Updated" : "Created"}!
          </h3>
          <p className="text-gray-400 text-sm mt-1">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="font-display font-bold text-forest text-2xl mb-6">
          {isEditing ? "✏️ Edit Project" : "➕ Add New Project"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Project Title */}
          <div>
            <label className="form-label" htmlFor="proj-title">Project Title *</label>
            <input
              id="proj-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Community Garden Initiative"
              className="form-input"
              required
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="form-label" htmlFor="proj-short-desc">Short Description *</label>
            <input
              id="proj-short-desc"
              name="shortDescription"
              type="text"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Connecting people through shared gardening. (Max 150 chars)"
              maxLength={300}
              className="form-input"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="form-label" htmlFor="proj-desc">Full Description *</label>
            <textarea
              id="proj-desc"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Detailed project description..."
              className="form-input resize-none"
              required
            />
          </div>

          {/* Goal + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="proj-goal">Funding Goal (USD) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                  id="proj-goal"
                  name="goal"
                  type="number"
                  value={formData.goal}
                  onChange={handleChange}
                  placeholder="50000"
                  min="0"
                  className="form-input pl-8"
                  required
                />
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="proj-category">Category</label>
              <select id="proj-category" name="category" value={formData.category} onChange={handleChange} className="form-input">
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="proj-start">Start Date</label>
              <select
                id="proj-start"
                name="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="form-input"
              >
                {/* Generate month-year options */}
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
              <label className="form-label" htmlFor="proj-status">Status</label>
              <select id="proj-status" name="status" value={formData.status} onChange={handleChange} className="form-input">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="form-label">Upload Media (Images / Videos)</label>
            <div
              className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center
                         hover:border-lime hover:bg-lime/5 transition-all cursor-pointer"
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
              <div className="text-4xl mb-2">📸</div>
              <p className="text-gray-600 text-sm font-medium">Click to upload images or videos</p>
              <p className="text-gray-400 text-xs mt-1">JPEG, PNG, WebP, MP4, MOV — Max 50MB each</p>
            </div>

            {/* Preview thumbnails */}
            {previewUrls.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {previewUrls.map((url, i) =>
                  url ? (
                    <div key={i} className="relative w-20 h-20">
                      <img src={url} alt="" className="w-full h-full object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrls(prev => prev.filter((_, idx) => idx !== i));
                          setMediaFiles(prev => prev.filter((_, idx) => idx !== i));
                        }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div key={i} className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400">
                      🎥 Video
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Featured Toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-lime focus:ring-lime border-gray-300 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600 group-hover:text-forest transition-colors font-medium">
              ⭐ Mark as Featured / Success Story
            </span>
          </label>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-500
                         hover:border-forest hover:text-forest transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-forest py-3 text-sm disabled:opacity-60 uppercase tracking-wide font-bold"
              id="save-project-btn"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-lime border-t-transparent rounded-full animate-spin"/>
                  Saving...
                </span>
              ) : (
                "Save & Continue"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
