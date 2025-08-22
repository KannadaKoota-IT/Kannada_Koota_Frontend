import React, { useEffect, useState } from "react";

export default function AnnouncementPanel() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", link: "", date: "" });
  const [media, setMedia] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/announcements`);
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = editingId
      ? `${API_BASE}/api/announcements/${editingId}`
      : `${API_BASE}/api/announcements`;
    const method = editingId ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("message", form.message);
    if (form.link) formData.append("link", form.link);
    if (form.date) formData.append("date", form.date);
    if (media) formData.append("media", media);

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        fetchAnnouncements();
        setForm({ title: "", message: "", link: "", date: "" });
        setMedia(null);
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to submit announcement:", err);
    }
    setLoading(false);
  };

  // Edit announcement
  const handleEdit = (announcement) => {
    setForm({
      title: announcement.title,
      message: announcement.message,
      link: announcement.link || "",
      date: announcement.date ? announcement.date.split("T")[0] : "",
    });
    setEditingId(announcement._id);
  };

  // Delete announcement
  const handleDelete = async (id) => {
    if (window.confirm("Delete this announcement?")) {
      try {
        await fetch(`${API_BASE}/api/announcements/${id}`, {
          method: "DELETE",
        });
        fetchAnnouncements();
      } catch (err) {
        console.error("Failed to delete announcement:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <span className="text-2xl">📢</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Announcements
          </h1>
          <p className="text-slate-300 text-lg">Create and manage your announcements</p>
        </div>

        {/* Form */}
        <div className="mb-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Title Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter announcement title..."
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Message Textarea */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Write your announcement message..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                />
              </div>

              {/* Link Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Link (Optional)
                </label>
                <input
                  type="url"
                  name="link"
                  placeholder="https://example.com"
                  value={form.link}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Date (Optional)
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* File Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Media (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading
                  ? editingId
                    ? "🔄 Updating..."
                    : "🔄 Adding..."
                  : editingId
                    ? "✏️ Update Announcement"
                    : "✨ Add Announcement"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm({ title: "", message: "", link: "", date: "" });
                  setMedia(null);
                  setEditingId(null);
                }}
                className="flex-1 sm:flex-none bg-slate-600 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300 shadow-lg"
              >
                🗑️ Clear
              </button>
            </div>
          </form>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No announcements yet</h3>
              <p className="text-slate-400">Create your first announcement above!</p>
            </div>
          ) : (
            announcements.map((a) => {
              const isExpanded = expandedId === a._id;
              return (
                <div
                  key={a._id}
                  onClick={() => toggleExpand(a._id)}
                  className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/15 ${
                    isExpanded ? "ring-2 ring-purple-400 shadow-2xl" : "shadow-xl"
                  }`}
                >
                  {/* Compact view */}
                  {!isExpanded && (
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-white mr-4 flex-1">
                          {a.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {a.date && (
                            <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-medium">
                              {new Date(a.date).toLocaleDateString()}
                            </span>
                          )}
                          <div className="text-slate-400 text-sm">
                            {isExpanded ? "▲" : "▼"}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-300 mb-3 line-clamp-2">{a.message}</p>
                      {a.link && (
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          🔗 View Link
                        </a>
                      )}
                    </div>
                  )}

                  {/* Expanded view */}
                  {isExpanded && (
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-white mr-4 flex-1">
                          {a.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {a.date && (
                            <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-medium">
                              {new Date(a.date).toLocaleDateString()}
                            </span>
                          )}
                          <div className="text-slate-400 text-sm">▲</div>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 mb-4 leading-relaxed">{a.message}</p>
                      
                      {a.link && (
                        <div className="mb-4">
                          <a
                            href={a.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
                            onClick={(e) => e.stopPropagation()}
                          >
                            🔗 Open Link
                          </a>
                        </div>
                      )}

                      {/* Media Display */}
                      {a.mediaUrl && (
                        <div className="mb-6">
                          {a.mediaType === "image" ? (
                            <img
                              src={a.mediaUrl}
                              alt="announcement"
                              className="rounded-xl max-h-64 w-full object-cover border border-white/20 shadow-lg"
                            />
                          ) : (
                            <video
                              src={a.mediaUrl}
                              controls
                              className="rounded-xl max-h-64 w-full object-cover border border-white/20 shadow-lg"
                            />
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(a);
                          }}
                          className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(a._id);
                          }}
                          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}