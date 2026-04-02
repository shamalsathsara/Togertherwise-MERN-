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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-forest text-2xl">Newsletter Subscribers</h2>
          <p className="text-gray-500 text-sm">Manage users who subscribed through your website footer.</p>
        </div>
        <div className="flex gap-2">
            <button onClick={downloadCSV} className="btn-primary text-sm px-4 py-2" disabled={subscribers.length === 0}>
            Download CSV
            </button>
            <button onClick={fetchSubscribers} className="btn-secondary text-sm border-gray-200" disabled={isLoading}>
            ↻ Refresh
            </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium text-center">Subscribed Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-400">
                    <span className="w-5 h-5 border-2 border-lime border-t-transparent rounded-full animate-spin inline-block align-middle mr-2"></span>
                    Loading subscribers...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-400">
                    No active newsletter subscribers.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-forest whitespace-nowrap">
                      {sub.email}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        sub.status === 'subscribed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 text-center whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right align-middle">
                      <button
                          onClick={() => handleDelete(sub._id)}
                          className="px-2 py-1 text-red-500 rounded text-xs hover:bg-red-50"
                        >
                          Delete
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
