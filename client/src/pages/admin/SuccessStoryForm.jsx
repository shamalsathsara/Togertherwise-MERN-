import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const SuccessStoryForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    tag: "",
    quote: "",
    person: "",
    role: "",
  });
  
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError("File must be smaller than 5MB");
      setFile(null);
      e.target.value = null;
    } else {
      setError("");
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please attach an image (Max 5MB).");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("location", formData.location);
      submitData.append("tag", formData.tag);
      submitData.append("quote", formData.quote);
      submitData.append("person", formData.person);
      submitData.append("role", formData.role);
      submitData.append("image", file);

      const response = await axiosInstance.post("/success-stories", submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      if (response.data.success) {
        navigate("/admin/success-stories");
      }
    } catch (err) {
      console.error("Error creating story:", err);
      setError(err.response?.data?.message || err.message || "Failed to create story.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Back link */}
      <button 
        onClick={() => navigate("/admin/success-stories")}
        className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm mb-5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to Stories
      </button>

      <div className="bg-white rounded-xl border border-gray-100 p-7">
        <h2 className="font-semibold text-gray-800 text-lg mb-1">New Success Story</h2>
        <p className="text-gray-400 text-[13px] mb-6">Add a new inspiring story to the platform.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
              <span className="text-red-400">⚠</span> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                <option value="Water Projects">Water Projects</option>
                <option value="Education">Education</option>
                <option value="Community Development">Community Development</option>
                <option value="Reforestation">Reforestation</option>
                <option value="Medical Aid">Medical Aid</option>
                <option value="Other">Other</option>
              </select>
            </div>

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

            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Role / Title *</label>
              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. Village Elder"
              />
            </div>

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
            
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Story Image (Max 5MB) *</label>
              <input
                type="file"
                name="image"
                required
                accept="image/*"
                onChange={handleFileChange}
                className="input-field text-sm file:bg-lime file:text-forest file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:text-xs file:font-semibold file:cursor-pointer file:mr-3 hover:file:bg-lime-dark"
              />
            </div>
          </div>

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
                  <span className="w-4 h-4 border-2 border-forest/30 border-t-forest rounded-full animate-spin"/>
                  Uploading…
                </span>
              ) : "Publish Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuccessStoryForm;
