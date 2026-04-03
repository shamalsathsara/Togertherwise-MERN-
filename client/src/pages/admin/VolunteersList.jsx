import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const VolunteersList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVolunteers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/volunteers");
      if (response.data.success) {
        setVolunteers(response.data.volunteers);
      }
    } catch (err) {
      console.error("Error fetching volunteers:", err);
      setError("Failed to load volunteers from the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axiosInstance.put(`/volunteers/${id}/status`, { status: newStatus });
      if (response.data.success) {
        setVolunteers(volunteers.map(v => v._id === id ? { ...v, status: newStatus } : v));
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this volunteer application?")) {
      try {
        const response = await axiosInstance.delete(`/volunteers/${id}`);
        if (response.data.success) {
          setVolunteers(volunteers.filter(v => v._id !== id));
        }
      } catch (err) {
        console.error("Error deleting volunteer:", err);
        alert(err.response?.data?.message || "Failed to delete volunteer.");
      }
    }
  };

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">Volunteer Applications</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">Review and approve new volunteer sign-ups.</p>
        </div>
        <button onClick={fetchVolunteers} className="admin-btn-outline" disabled={isLoading}>
          ↻ Refresh
        </button>
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
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Applied</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Applicant</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400">
                    <div className="flex justify-center items-center gap-3">
                      <span className="w-5 h-5 border-2 border-lime/40 border-t-lime rounded-full animate-spin"></span>
                      <span className="text-sm">Loading applicants…</span>
                    </div>
                  </td>
                </tr>
              ) : volunteers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="text-gray-300 text-3xl mb-2">🤝</div>
                    <p className="text-gray-400 text-sm">No volunteer applications yet.</p>
                  </td>
                </tr>
              ) : (
                volunteers.map((vol) => (
                  <tr key={vol._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(vol.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-800">{vol.firstName} {vol.lastName}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{vol.email}</p>
                      <p className="text-[12px] text-gray-400">{vol.phone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                        vol.role === 'volunteer' ? 'bg-lime/10 text-forest' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {vol.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 max-w-[150px]">
                      <p className="truncate" title={vol.streetAddress}>{vol.city}, {vol.country}</p>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        vol.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                        vol.status === 'rejected' ? 'bg-red-50 text-red-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {vol.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right align-middle">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleStatusChange(vol._id, 'approved')}
                          disabled={vol.status === 'approved'}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[11px] font-semibold hover:bg-emerald-100 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(vol._id, 'rejected')}
                          disabled={vol.status === 'rejected'}
                          className="px-2.5 py-1 bg-red-50 text-red-500 rounded-md text-[11px] font-semibold hover:bg-red-100 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleDelete(vol._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
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
    </div>
  );
};

export default VolunteersList;
