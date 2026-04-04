/**
 * SuccessStoryForm.jsx — Admin: Add / Edit Success Story
 * Supports create mode (mode="create") and edit mode (mode="edit").
 * In edit mode, reads :id from URL params, pre-fills the form,
 * and allows updating text fields and/or replacing the image.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const TAGS = [
  "Water Projects",
  "Education",
  "Community Development",
  "Reforestation",
  "Medical Aid",
  "Other",
];

const SuccessStoryForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = mode === "edit" && id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStory, setIsLoadingStory] = useState(isEditing);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // existing image in DB
  const [file, setFile] = useState(null);                      // newly selected file
  const [filePreview, setFilePreview] = useState(null);        // local preview URL

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    tag: "",
    quote: "",
    person: "",
    role: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  // ── Load existing story when editing ─────────────────────────────────────────
  useEffect(() => {
    if (!isEditing) return;

    const fetchStory = async () => {
      try {
        const { data } = await axiosInstance.get(`/success-stories`);
        if (data.success) {
          const story = data.data.find((s) => s._id === id);
          if (!story) {
            setError("Story not found.");
            return;
          }
          setFormData({
            title:    story.title    || "",
            location: story.location || "",
            tag:      story.tag      || "",
            quote:    story.quote    || "",
            person:   story.person   || "",
            role:     story.role     || "",
          });
          // Store the existing image path so we can show a thumbnail
          setCurrentImageUrl(
            story.image.startsWith("http")
              ? story.image
              : `${API_BASE_URL}${story.image}`
          );
        }
      } catch {
        setError("Failed to load story. Check server connection.");
      } finally {
        setIsLoadingStory(false);
      }
    };

    fetchStory();
  }, [isEditing, id]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      setError("File must be smaller than 5MB.");
      setFile(null);
      setFilePreview(null);
      e.target.value = null;
      return;
    }

    setError("");
    setFile(selected);
    setFilePreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Image required only when creating
    if (!isEditing && !file) {
      setError("Please attach an image (Max 5MB).");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("title",    formData.title);
      submitData.append("location", formData.location);
      submitData.append("tag",      formData.tag);
      submitData.append("quote",    formData.quote);
      submitData.append("person",   formData.person);
      submitData.append("role",     formData.role);
      if (file) submitData.append("image", file);

      if (isEditing) {
        await axiosInstance.put(`/success-stories/${id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/success-stories", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess(true);
      setTimeout(() => navigate("/admin/success-stories"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save story.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading state (edit mode fetching data) ───────────────────────────────────
  if (isLoadingStory) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-lime/40 border-t-lime rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading story…</p>
        </div>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────────
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
            Story {isEditing ? "Updated" : "Published"}!
          </h3>
          <p className="text-gray-400 text-sm mt-1">Redirecting to stories…</p>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl">
      {/* Back link */}
      <button
        onClick={() => navigate("/admin/success-stories")}
        className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm mb-5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Stories
      </button>

      <div className="bg-white rounded-xl border border-gray-100 p-7">
        <h2 className="font-semibold text-gray-800 text-lg mb-1">
          {isEditing ? "Edit Success Story" : "New Success Story"}
        </h2>
        <p className="text-gray-400 text-[13px] mb-6">
          {isEditing
            ? "Update the story details. Leave the image field empty to keep the current image."
            : "Add a new inspiring story to the platform."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
              <span className="text-red-400">⚠</span> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Story Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. Clean Water Changes Everything"
              />
            </div>

            {/* Category Tag */}
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Category Tag *</label>
              <select
                name="tag"
                required
                value={formData.tag}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="" disabled>Select Category</option>
                {TAGS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Quote */}
            <div className="md:col-span-2">
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Quote / Story *</label>
              <textarea
                name="quote"
                required
                rows="3"
                value={formData.quote}
                onChange={handleInputChange}
                className="input-field resize-none"
                placeholder="Enter the main quote or short story paragraph…"
              />
            </div>

            {/* Person */}
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Person's Name *</label>
              <input
                type="text"
                name="person"
                required
                value={formData.person}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. Kumari Navaratne"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Role / Title *</label>
              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. Village Elder, Hambantota"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Location *</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. Hambantota, Sri Lanka"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
                Story Image{isEditing ? " (optional — replaces current)" : " (Max 5MB) *"}
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="input-field text-sm file:bg-lime file:text-forest file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:text-xs file:font-semibold file:cursor-pointer file:mr-3 hover:file:bg-lime-dark"
              />
            </div>
          </div>

          {/* Image preview area */}
          {(filePreview || currentImageUrl) && (
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              {filePreview ? (
                <>
                  <img src={filePreview} alt="New preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                  <div>
                    <p className="text-xs font-medium text-gray-600">New image selected</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">This will replace the current image when saved.</p>
                  </div>
                </>
              ) : currentImageUrl ? (
                <>
                  <img src={currentImageUrl} alt="Current" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                  <div>
                    <p className="text-xs font-medium text-gray-600">Current image</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Upload a new file above to replace it.</p>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-gray-50 flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/admin/success-stories")}
              className="flex-1 admin-btn-outline py-2.5"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 admin-btn-lime py-2.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
                  {isEditing ? "Saving…" : "Uploading…"}
                </span>
              ) : (
                isEditing ? "Save Changes" : "Publish Story"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuccessStoryForm;
