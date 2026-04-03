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
    <div className="space-y-5 max-w-6xl">
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">Donations</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">View and manage all incoming donations.</p>
        </div>
        <button 
          onClick={fetchDonations}
          className="admin-btn-outline"
          disabled={isLoading}
        >
          ↻ {isLoading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* ── Error ────────────────────────────────────────────────── */}
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
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Donor</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Frequency</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    <div className="flex justify-center items-center gap-3">
                      <span className="w-5 h-5 border-2 border-lime/40 border-t-lime rounded-full animate-spin"></span>
                      <span className="text-sm">Loading donations…</span>
                    </div>
                  </td>
                </tr>
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="text-gray-300 text-3xl mb-2">💸</div>
                    <p className="text-gray-400 text-sm">No donations found.</p>
                  </td>
                </tr>
              ) : (
                donations.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(d.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-gray-800">
                        {d.isAnonymous ? "Anonymous Donor" : d.donorName}
                      </span>
                      {d.isAnonymous && (
                        <span className="ml-1.5 inline-block px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[10px] font-medium rounded">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {d.isAnonymous ? "••••••••@" + (d.donorEmail.split("@")[1] || "hidden") : d.donorEmail}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-forest tabular-nums">${d.amount?.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 capitalize">
                      {d.frequency}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize
                        ${d.paymentStatus === "completed" ? "bg-emerald-50 text-emerald-700" : 
                          d.paymentStatus === "pending" ? "bg-amber-50 text-amber-600" :
                          d.paymentStatus === "failed" ? "bg-red-50 text-red-600" :
                          "bg-gray-50 text-gray-500"
                        }`}
                      >
                        {d.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button 
                        onClick={() => handleDeleteClick(d._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Delete Donation"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Delete Modal ─────────────────────────────────────────── */}
      {donationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="p-6">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              </div>
              <h3 className="font-semibold text-center text-gray-800 text-base mb-1">Delete Donation?</h3>
              <p className="text-gray-400 text-sm text-center mb-6">This action is permanent. Linked project totals will be reduced.</p>
              <div className="flex gap-2">
                <button onClick={() => setDonationToDelete(null)} className="flex-1 admin-btn-outline py-2.5" disabled={isDeleting}>
                  Cancel
                </button>
                <button onClick={confirmDelete} className="flex-1 admin-btn-danger py-2.5" disabled={isDeleting}>
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

export default DonationsList;
