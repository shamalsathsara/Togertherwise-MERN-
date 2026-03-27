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
      e.target.value = null; // reset input
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
      // Must use FormData since we are uploading a file (multipart/form-data)
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("location", formData.location);
      submitData.append("tag", formData.tag);
      submitData.append("quote", formData.quote);
      submitData.append("person", formData.person);
      submitData.append("role", formData.role);
      submitData.append("image", file);

      // Tell axios to send it as multipart form data
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
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate("/admin/success-stories")}
          className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors text-forest"
        >
          ← Back
        </button>
        <div>
          <h2 className="font-display font-bold text-forest text-2xl">New Success Story</h2>
          <p className="text-gray-500 text-sm">Add a new inspiring story to the platform.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start gap-3">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-forest">Story Title</label>
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

            <div className="space-y-1">
              <label className="text-sm font-semibold text-forest">Category Tag</label>
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

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold text-forest">The Quote / Story</label>
              <textarea
                name="quote"
                required
                rows="3"
                value={formData.quote}
                onChange={handleInputChange}
                className="input-field resize-none"
                placeholder="Enter the main quote or short story paragraph..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-forest">Person's Name</label>
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

            <div className="space-y-1">
              <label className="text-sm font-semibold text-forest">Person's Role / Title</label>
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

            <div className="space-y-1">
              <label className="text-sm font-semibold text-forest">Location</label>
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
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-forest">Story Image (Max 5MB)</label>
              <input
                type="file"
                name="image"
                required
                accept="image/*"
                onChange={handleFileChange}
                className="input-field file:bg-lime file:text-forest file:border-0 file:rounded-xl file:px-4 file:py-2 file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-lime-dark"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("-1")}
              className="px-6 py-2 rounded-xl text-forest font-semibold border-2 border-forest hover:bg-forest hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading & Saving..." : "Publish Success Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuccessStoryForm;
