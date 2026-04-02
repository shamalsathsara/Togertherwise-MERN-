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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-forest text-2xl">Inquiries & Messages</h2>
          <p className="text-gray-500 text-sm">Review messages and inquiries submitted via the Contact form.</p>
        </div>
        <button onClick={fetchMessages} className="btn-secondary text-sm border-gray-200" disabled={isLoading}>
          ↻ Refresh
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">From</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Message Details</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-400">
                    <span className="w-5 h-5 border-2 border-lime border-t-transparent rounded-full animate-spin inline-block align-middle mr-2"></span>
                    Loading messages...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-400">
                    No messages yet. When a user submits the form, it will appear here.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-forest mb-1">
                        {msg.firstName} {msg.lastName}
                      </p>
                      <p className="text-xs text-gray-500">✉️ {msg.email}</p>
                      <p className="text-xs text-gray-500">📞 {msg.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className="badge-forest text-xs whitespace-nowrap">{msg.type}</span>
                    </td>
                    <td className="p-4 text-sm leading-relaxed max-w-md">
                      <p className="text-gray-600 line-clamp-3">{msg.message}</p>
                    </td>
                    <td className="p-4 text-right align-top">
                      <button
                        onClick={() => setMessageToDelete(msg._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Message"
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

      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 overflow-hidden animate-slide-up">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto text-red-600 text-xl">⚠️</div>
            <h3 className="font-display font-bold text-center text-forest text-lg mb-2">Delete Message?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">This message will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setMessageToDelete(null)}
                className="flex-1 btn-secondary text-sm border-gray-200 text-gray-600 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-xl hover:bg-red-600 text-sm flex justify-center items-center"
                disabled={isDeleting}
              >
                {isDeleting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesList;
