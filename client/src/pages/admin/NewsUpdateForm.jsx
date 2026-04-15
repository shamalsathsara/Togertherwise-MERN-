/**
 * NewsUpdateForm.jsx — Admin: Add / Edit News Update
 * Supports create (mode="create") and edit (mode="edit") modes.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const STATUS_OPTIONS = [
  { value: "complete",    label: "Complete",    badge: "bg-lime/20 text-forest" },
  { value: "in-progress", label: "In Progress", badge: "bg-blue-100 text-blue-700" },
  { value: "upcoming",    label: "Upcoming",    badge: "bg-orange-100 text-orange-700" },
  { value: "paused",      label: "Paused",      badge: "bg-gray-100 text-gray-500" },
];

const NewsUpdateForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = mode === "edit" && id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const [formData, setFormData] = useState({
    label:     "",
    tag:       "",
    status:    "in-progress",
    image:     "",
    order:     "0",
    isVisible: true,
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  // Load existing item in edit mode
  useEffect(() => {
    if (!isEditing) return;
    const fetchItem = async () => {
      try {
        const { data } = await axiosInstance.get("/news/admin");
        if (data.success) {
          const item = data.data.find((n) => n._id === id);
          if (!item) { setError("News item not found."); return; }
          setFormData({
            label:     item.label     || "",
            tag:       item.tag       || "",
            status:    item.status    || "in-progress",
            image:     item.image     || "",
            order:     String(item.order ?? 0),
            isVisible: item.isVisible !== false,
          });
          if (item.image) {
            setCurrentImageUrl(
              item.image.startsWith("http") ? item.image : `${API_BASE_URL}${item.image}`
            );
          }
        }
      } catch {
        setError("Failed to load news item.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) {
      setError("File must be smaller than 5MB.");
      return;
    }
    setError("");
    setFile(selected);
    setFilePreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.label || !formData.tag) {
      setError("Content and tag are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("label",     formData.label);
      submitData.append("tag",       formData.tag);
      submitData.append("status",    formData.status);
      submitData.append("imageUrl",  formData.image);  // text URL field (renamed to avoid clash with file)
      submitData.append("order",     formData.order);
      submitData.append("isVisible", formData.isVisible);
      if (file) submitData.append("image", file); // uploaded file always wins

      if (isEditing) {
        await axiosInstance.put(`/news/${id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/news", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess(true);
      setTimeout(() => navigate("/admin/news"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save news item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-lime/40 border-t-lime rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 text-lg">
            News Item {isEditing ? "Updated" : "Created"}!
          </h3>
          <p className="text-gray-400 text-sm mt-1">Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate("/admin/news")}
        className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm mb-5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to News
      </button>

      <div className="bg-white rounded-xl border border-gray-100 p-7">
        <h2 className="font-semibold text-gray-800 text-lg mb-1">
          {isEditing ? "Edit News Item" : "New News Item"}
        </h2>
        <p className="text-gray-400 text-[13px] mb-6">
          {isEditing
            ? "Update the news item. Leave the image field empty to keep the current image."
            : "Add a new item to the homepage News & Updates section."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Tag */}
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Tag Label *</label>
            <input
              type="text"
              name="tag"
              required
              value={formData.tag}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. COMPLETE, IN PROGRESS, NEW"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">News Content *</label>
            <textarea
              name="label"
              required
              rows="3"
              value={formData.label}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="e.g. Clean Water Project in Village 1 — A new solar pump is providing clean water to 500+ families."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Status */}
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Status (Badge Colour)</label>
              <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Display Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
                className="input-field"
                placeholder="0 = first"
              />
              <p className="text-[11px] text-gray-400 mt-1">Lower number appears first on the page.</p>
            </div>

            {/* Image */}
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
                Image {isEditing ? "(optional)" : "(optional)"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input-field text-sm file:bg-lime file:text-forest file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:text-xs file:font-semibold file:cursor-pointer file:mr-3 hover:file:bg-lime-dark"
              />
            </div>

            {/* Or External Image URL */}
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Or Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-[11px] text-gray-400 mt-1">Uploaded file takes priority over URL.</p>
            </div>
          </div>

          {/* Image preview */}
          {(filePreview || currentImageUrl) && (
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <img
                src={filePreview || currentImageUrl}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
              <div>
                <p className="text-xs font-medium text-gray-600">
                  {filePreview ? "New image selected" : "Current image"}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {filePreview ? "This will replace the current image when saved." : "Upload a new file to replace it."}
                </p>
              </div>
            </div>
          )}

          {/* Visibility toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
              className="w-4 h-4 text-lime focus:ring-lime border-gray-300 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
              Show this item on the homepage
            </span>
          </label>

          {/* Badge preview */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-[11px] text-gray-400 mb-2 font-medium uppercase tracking-wider">Homepage preview</p>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
              {(filePreview || currentImageUrl || formData.image) && (
                <img
                  src={filePreview || currentImageUrl || formData.image}
                  alt=""
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold mb-1 ${
                  STATUS_OPTIONS.find(s => s.value === formData.status)?.badge || "bg-gray-100 text-gray-500"
                }`}>
                  {formData.tag || "TAG"}
                </span>
                <p className="text-gray-600 text-xs line-clamp-2">{formData.label || "Your news content will appear here."}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-50 flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/admin/news")}
              className="flex-1 admin-btn-outline py-2.5"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 admin-btn-lime py-2.5" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
                  Saving…
                </span>
              ) : (
                isEditing ? "Save Changes" : "Publish Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsUpdateForm;
