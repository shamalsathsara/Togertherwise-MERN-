import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const SubscribersList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubscribers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/subscribers");
      if (response.data.success) {
        setSubscribers(response.data.subscribers);
      }
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      setError("Failed to load subscribers from the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this subscriber?")) {
      try {
        const response = await axiosInstance.delete(`/subscribers/${id}`);
        if (response.data.success) {
          setSubscribers(subscribers.filter((s) => s._id !== id));
        }
      } catch (err) {
        console.error("Error deleting subscriber:", err);
        alert("Failed to delete subscriber.");
      }
    }
  };

  const downloadCSV = () => {
    if (subscribers.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8,Email,Status,Subscribed Date\n" 
      + subscribers.map(e => `${e.email},${e.status},${new Date(e.createdAt).toLocaleDateString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "togetherwise_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">Newsletter Subscribers</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">Manage users who subscribed through your website.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadCSV} className="admin-btn-primary" disabled={subscribers.length === 0}>
            ↓ Export CSV
          </button>
          <button onClick={fetchSubscribers} className="admin-btn-outline" disabled={isLoading}>
            ↻ Refresh
          </button>
        </div>
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
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">Subscribed</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-400">
                    <div className="flex justify-center items-center gap-3">
                      <span className="w-5 h-5 border-2 border-lime/40 border-t-lime rounded-full animate-spin"></span>
                      <span className="text-sm">Loading subscribers…</span>
                    </div>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <div className="text-gray-300 text-3xl mb-2">📬</div>
                    <p className="text-gray-400 text-sm">No subscribers yet.</p>
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {sub.email}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        sub.status === 'subscribed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 text-center whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Remove subscriber"
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
    </div>
  );
};

export default SubscribersList;
