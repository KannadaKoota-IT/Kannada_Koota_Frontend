import React, { useEffect, useState } from "react";
import { Bell, Plus, Edit2, Trash2, X, Calendar, Link2, Image, ChevronDown, ChevronUp } from "lucide-react";

export default function AnnouncementPanel() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", title_k: "", message: "", message_k: "", link: "", date: "" });
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/announcements?admin=true`);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview({ url: reader.result, type: file.type });
      };
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = editingId
      ? `${API_BASE}/api/announcements/${editingId}`
      : `${API_BASE}/api/announcements`;
    const method = editingId ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("title_k", form.title_k);
    formData.append("message", form.message);
    formData.append("message_k", form.message_k);

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
        resetForm();
        setShowForm(false);
      }
    } catch (err) {
      console.error("Failed to submit announcement:", err);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ title: "", title_k: "", message: "", message_k: "", link: "", date: "" });
    setMedia(null);
    setMediaPreview(null);
    setEditingId(null);
  };

  const handleEdit = (announcement) => {
    setForm({
      title: announcement.title,
      title_k: announcement.title_k,
      message: announcement.message,
      message_k: announcement.message_k,
      link: announcement.link || "",
      date: announcement.date.split('T')[0],
    });
    setEditingId(announcement._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl mb-6 shadow-2xl shadow-purple-500/50 transform hover:scale-110 transition-transform duration-300">
            <Bell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Announcements Hub
          </h1>
        </div>

        {/* Create Button */}
        {!showForm && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl font-bold text-white text-lg shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              Create New Announcement
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-12 animate-slideDown">
            <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  {editingId ? (
                    <>
                      <Edit2 className="w-7 h-7 text-blue-400" />
                      Edit Announcement
                    </>
                  ) : (
                    <>
                      <Plus className="w-7 h-7 text-purple-400" />
                      New Announcement
                    </>
                  )}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-slate-400 hover:text-white" />
                </button>
              </div>
              <div className="space-y-8">
                {/* Title Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Announcement Title (English) *
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter a compelling title..."
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3 text-white text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:bg-slate-800/70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Announcement Title (Kannada) *
                    </label>
                    <input
                      type="text"
                      name="title_k"
                      placeholder="ಘೋಷಣೆಯ ಶೀರ್ಷಿಕೆ..."
                      value={form.title_k}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3 text-white text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:bg-slate-800/70"
                    />
                  </div>
                </div>

                {/* Message Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Message (English) *
                    </label>
                    <textarea
                      name="message"
                      placeholder="Write your announcement message..."
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3 text-white text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all hover:bg-slate-800/70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Message (Kannada) *
                    </label>
                    <textarea
                      name="message_k"
                      placeholder="ಘೋಷಣೆಯ ಸಂದೇಶವನ್ನು ಬರೆಯಿರಿ..."
                      value={form.message_k}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3 text-white text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all hover:bg-slate-800/70"
                    />
                  </div>
                </div>

                {/* Link & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <Link2 className="w-4 h-4" />
                      Link (Optional)
                    </label>
                    <input
                      type="url"
                      name="link"
                      placeholder="https://example.com"
                      value={form.link}
                      onChange={handleChange}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:bg-slate-800/70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Event Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:bg-slate-800/70"
                    />
                  </div>
                </div>

                {/* Media Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Media (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:bg-slate-800/70 cursor-pointer"
                    />
                  </div>

                  {mediaPreview && (
                    <div className="mt-4 relative group">
                      {mediaPreview.type.startsWith("image/") ? (
                        <img
                          src={mediaPreview.url}
                          alt="Preview"
                          className="rounded-2xl max-h-64 w-full object-cover border border-slate-700 shadow-xl"
                        />
                      ) : (
                        <video
                          src={mediaPreview.url}
                          controls
                          className="rounded-2xl max-h-64 w-full object-cover border border-slate-700 shadow-xl"
                        />
                      )}
                      <button
                        onClick={() => {
                          setMedia(null);
                          setMediaPreview(null);
                        }}
                        className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !form.title || !form.message}
                    className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-2xl transition-all transform hover:scale-105 focus:ring-4 focus:ring-purple-400/50 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {editingId ? "Updating..." : "Publishing..."}
                      </>
                    ) : (
                      <>
                        {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {editingId ? "Update Announcement" : "Publish Announcement"}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="sm:w-auto bg-slate-700 hover:bg-slate-600 text-white font-bold px-8 py-4 rounded-2xl transition-all transform hover:scale-105 focus:ring-4 focus:ring-slate-400/50 shadow-xl flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Clear
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Announcements List */}
        <div className="space-y-6">
          {announcements.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-slate-800 to-purple-900 rounded-full mb-6 shadow-2xl">
                <Bell className="w-16 h-16 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-300 mb-3">No Announcements Yet</h3>
              <p className="text-slate-400 text-lg mb-8">Create your first announcement to get started!</p>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                >
                  Create Announcement
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {announcements.map((a) => {
                const isExpanded = expandedId === a._id;
                return (
                  <div
                    key={a._id}
                    className={`bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl border rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 transform hover:scale-[1.01] ${isExpanded
                        ? "border-purple-500/50 shadow-purple-500/30 ring-2 ring-purple-500/30"
                        : "border-white/10 hover:border-purple-500/30"
                      }`}
                  >
                    <div
                      onClick={() => toggleExpand(a._id)}
                      className="p-6 cursor-pointer hover:bg-white/5 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="!text-2xl !font-bold !text-yellow-400 mb-2 flex items-start gap-3">
                            {a.title_k}
                            <span className="text-xl font-semibold text-red-300">{`(${a.title})`}</span>
                          </p>

                          <p className={`text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {a.message_k}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          {a.date && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm border border-red-500/30">
                              <Calendar className="w-4 h-4" />
                              {new Date(a.date).toLocaleDateString()}
                            </div>
                          )}
                          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200">
                            {isExpanded ? (
                              <ChevronUp className="w-6 h-6 text-purple-400" />
                            ) : (
                              <ChevronDown className="w-6 h-6 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-6 pb-6 space-y-6 animate-slideDown">
                          <p className={`text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {a.message}
                          </p>

                        {a.link && (
                          <a
                            href={a.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border border-blue-500/30"
                          >
                            <Link2 className="w-5 h-5" />
                            Open Link
                          </a>
                        )}

                        {a.mediaUrl && (
                          <div className="relative group">
                            {a.mediaType === "image" ? (
                              <img
                                src={a.mediaUrl}
                                alt="Announcement media"
                                className="rounded-2xl w-full max-h-96 object-cover border border-white/20 shadow-2xl"
                              />
                            ) : (
                              <video
                                src={a.mediaUrl}
                                controls
                                className="rounded-2xl w-full max-h-96 object-cover border border-white/20 shadow-2xl"
                              />
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(a);
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-300 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border border-green-500/30"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(a._id);
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border border-red-500/30"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}