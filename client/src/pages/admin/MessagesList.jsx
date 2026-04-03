import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/messages");
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages from the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/messages/${messageToDelete}`);
      if (response.data.success) {
        setMessages(messages.filter((m) => m._id !== messageToDelete));
        setMessageToDelete(null);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      setError(err.response?.data?.message || "Failed to delete from the server.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">Messages & Inquiries</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">Review messages submitted via the contact form.</p>
        </div>
        <button onClick={fetchMessages} className="admin-btn-outline" disabled={isLoading}>
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
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">From</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Message</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400">
                    <div className="flex justify-center items-center gap-3">
                      <span className="w-5 h-5 border-2 border-lime/40 border-t-lime rounded-full animate-spin"></span>
                      <span className="text-sm">Loading messages…</span>
                    </div>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="text-gray-300 text-3xl mb-2">💬</div>
                    <p className="text-gray-400 text-sm">No messages yet.</p>
                    <p className="text-gray-300 text-xs mt-1">Messages from your contact form will appear here.</p>
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-800">{msg.firstName} {msg.lastName}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{msg.email}</p>
                      <p className="text-[12px] text-gray-400">{msg.phone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-forest/10 text-forest whitespace-nowrap">{msg.type}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 max-w-md">
                      <p className="line-clamp-2 leading-relaxed">{msg.message}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right align-top">
                      <button
                        onClick={() => setMessageToDelete(msg._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Delete Message"
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

      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="p-6">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              </div>
              <h3 className="font-semibold text-center text-gray-800 text-base mb-1">Delete Message?</h3>
              <p className="text-gray-400 text-sm text-center mb-6">This message will be permanently removed.</p>
              <div className="flex gap-2">
                <button onClick={() => setMessageToDelete(null)} className="flex-1 admin-btn-outline py-2.5" disabled={isDeleting}>
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

export default MessagesList;
