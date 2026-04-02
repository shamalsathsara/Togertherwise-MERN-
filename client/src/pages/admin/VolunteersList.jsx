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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-forest text-2xl">Volunteer Applications</h2>
          <p className="text-gray-500 text-sm">Review and approve new volunteer sign-ups.</p>
        </div>
        <button onClick={fetchVolunteers} className="btn-secondary text-sm border-gray-200" disabled={isLoading}>
          ↻ Refresh
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Applied Date</th>
                <th className="p-4 font-medium">Applicant Details</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-400">
                    <span className="w-5 h-5 border-2 border-lime border-t-transparent rounded-full animate-spin inline-block align-middle mr-2"></span>
                    Loading applicants...
                  </td>
                </tr>
              ) : volunteers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-400">
                    No volunteer applications yet.
                  </td>
                </tr>
              ) : (
                volunteers.map((vol) => (
                  <tr key={vol._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(vol.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-forest mb-1">
                        {vol.firstName} {vol.lastName}
                      </p>
                      <p className="text-xs text-gray-500">✉️ {vol.email}</p>
                      <p className="text-xs text-gray-500">📞 {vol.phone}</p>
                    </td>
                    <td className="p-4 text-sm capitalize">
                      <span className={`badge-lime text-xs whitespace-nowrap ${vol.role !== 'volunteer' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}`}>
                         {vol.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm max-w-[150px]">
                      <p className="text-gray-600 truncate" title={vol.streetAddress}>{vol.city}, {vol.country}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        vol.status === 'approved' ? 'bg-green-100 text-green-700' :
                        vol.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {vol.status}
                      </span>
                    </td>
                    <td className="p-4 text-right align-middle">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleStatusChange(vol._id, 'approved')}
                          disabled={vol.status === 'approved'}
                          className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs hover:bg-green-100 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(vol._id, 'rejected')}
                          disabled={vol.status === 'rejected'}
                          className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100 disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleDelete(vol._id)}
                          className="px-2 py-1 text-red-500 rounded text-xs hover:bg-red-50 border border-red-200"
                        >
                          Delete
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
