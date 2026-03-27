import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const DonationsList = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [donationToDelete, setDonationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDonations = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/donations");
      if (response.data.success) {
        setDonations(response.data.donations);
      } else {
        setError("Failed to fetch donations.");
      }
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError("Failed to load donations. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDonationToDelete(id);
  };

  const confirmDelete = async () => {
    if (!donationToDelete) return;
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/donations/${donationToDelete}`);
      if (response.data.success) {
        setDonations(donations.filter(d => d._id !== donationToDelete));
        setDonationToDelete(null);
      } else {
        setError("Failed to delete donation.");
      }
    } catch (err) {
      console.error("Error deleting donation:", err);
      setError(err.response?.data?.message || "Failed to delete from the server.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Format date utility
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-forest text-2xl">Donations</h2>
          <p className="text-gray-500 text-sm">View and manage all incoming donations.</p>
        </div>
        <button 
          onClick={fetchDonations}
          className="btn-secondary text-sm text-forest border-gray-200 hover:bg-gray-50"
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "↻ Refresh"}
        </button>
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
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Donor Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Frequency</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-gray-400">
                    <div className="flex justify-center items-center gap-3">
                      <span className="w-5 h-5 border-2 border-lime border-t-transparent rounded-full animate-spin"></span>
                      Loading donations...
                    </div>
                  </td>
                </tr>
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-gray-400">
                    No donations found.
                  </td>
                </tr>
              ) : (
                donations.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(d.createdAt)}
                    </td>
                    <td className="p-4 text-sm font-semibold text-forest">
                      {d.isAnonymous ? "Anonymous Donor" : d.donorName}
                      {d.isAnonymous && (
                        <span className="ml-2 inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {/* Hide email if donor chose anonymous */}
                      {d.isAnonymous ? "••••••••••••@" + (d.donorEmail.split("@")[1] || "hidden.com") : d.donorEmail}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-forest">${d.amount?.toLocaleString()}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 capitalize">
                      {d.frequency}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${d.paymentStatus === "completed" ? "bg-lime/20 text-forest" : 
                          d.paymentStatus === "pending" ? "bg-amber-100 text-amber-700" :
                          d.paymentStatus === "failed" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {d.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteClick(d._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Donation"
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
      {donationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto text-red-600 text-xl">
                ⚠️
              </div>
              <h3 className="font-display font-bold text-center text-forest text-lg mb-2">Delete Donation?</h3>
              <p className="text-gray-500 text-sm text-center mb-6">
                This action is permanent and cannot be undone. Any linked project totals will also be reduced. 
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDonationToDelete(null)}
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

export default DonationsList;
