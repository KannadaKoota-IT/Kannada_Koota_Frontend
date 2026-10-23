import React, { useEffect, useState } from "react";
import { 
  Bell, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Calendar, 
  Link2, 
  UploadCloud, 
  ExternalLink,
  CheckCircle2,
  Film
} from "lucide-react";

export default function AnnouncementPanel() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", title_k: "", message: "", message_k: "", link: "", date: "" });
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/announcements?admin=true`);
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements || []);
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
        headers: {
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
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
      title_k: announcement.title_k || "",
      message: announcement.message,
      message_k: announcement.message_k || "",
      link: announcement.link || "",
      date: announcement.date ? announcement.date.split('T')[0] : "",
    });
    setEditingId(announcement._id);
    if (announcement.mediaUrl) {
      setMediaPreview({ url: announcement.mediaUrl, type: announcement.mediaType === 'video' ? 'video/mp4' : 'image/jpeg' });
    }
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await fetch(`${API_BASE}/api/announcements/${id}`, {
          method: "DELETE",
          headers: {
            ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
          },
        });
        fetchAnnouncements();
      } catch (err) {
        console.error("Failed to delete announcement:", err);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFEBE4]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#9B000E]">
            ಪ್ರಕಟಣೆಗಳ ನಿರ್ವಹಣೆ
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1B1B] font-kannada">
            Announcements Console
          </h1>
          <p className="text-xs sm:text-sm text-[#5C403D]">
            Broadcast official club circulars, auditions, and general notifications.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm && editingId) resetForm();
            setShowForm(!showForm);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#9B000E] hover:bg-[#7D000B] text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showForm ? "Close Form" : "New Announcement"}</span>
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-[#EFEBE4] p-6 sm:p-8 elevation-1 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE4]">
            <h2 className="text-lg sm:text-xl font-bold text-[#1C1B1B] font-kannada">
              {editingId ? "ಪ್ರಕಟಣೆ ತಿದ್ದಿ (Edit Announcement)" : "ಹೊಸ ಪ್ರಕಟಣೆ ರಚಿಸಿ (Create Announcement)"}
            </h2>
            <button
              type="button"
              onClick={() => { resetForm(); setShowForm(false); }}
              className="text-xs text-[#9B000E] font-semibold hover:underline"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
                Notice Title (English) *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Auditions for Kannada Drama Team"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
                ಶೀರ್ಷಿಕೆ (ಕನ್ನಡದಲ್ಲಿ) *
              </label>
              <input
                type="text"
                name="title_k"
                placeholder="ಉದಾ: ನಾಟಕ ತಂಡದ ಆಯ್ಕೆ ಪ್ರಕ್ರಿಯೆ"
                value={form.title_k}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E] font-kannada"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
                Notice Message (English) *
              </label>
              <textarea
                name="message"
                placeholder="Detailed announcement text..."
                value={form.message}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
                ಸಂದೇಶ (ಕನ್ನಡದಲ್ಲಿ) *
              </label>
              <textarea
                name="message_k"
                placeholder="ವಿವರವಾದ ಸಂದೇಶ..."
                value={form.message_k}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E] font-kannada"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
                Publish Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
                Attachment / Registration Link (Optional)
              </label>
              <input
                type="url"
                name="link"
                placeholder="https://drive.google.com/..."
                value={form.link}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
              />
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Poster / Video Attachment
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <input
                type="file"
                name="media"
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="text-xs text-[#5C403D] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-[#EFEBE4] file:bg-[#FCF9F8] file:text-xs file:font-semibold file:text-[#1C1B1B] hover:file:bg-[#F6F3F2]"
              />
              {mediaPreview && (
                <div className="w-24 h-16 rounded-xl overflow-hidden border border-[#EFEBE4] bg-[#F6F3F2] shrink-0 flex items-center justify-center">
                  {mediaPreview.type && mediaPreview.type.startsWith("video") ? (
                    <Film className="w-6 h-6 text-[#9B000E]" />
                  ) : (
                    <img src={mediaPreview.url} alt="preview" className="w-full h-full object-cover" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#EFEBE4]">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#9B000E] hover:bg-[#7D000B] text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? "Publishing..." : editingId ? "Update Notice" : "Broadcast Notice"}
            </button>
            <button
              type="button"
              onClick={() => { resetForm(); setShowForm(false); }}
              className="px-5 py-2.5 rounded-xl border border-[#EFEBE4] bg-white text-[#5C403D] hover:bg-[#F6F3F2] font-semibold text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#1C1B1B] font-kannada">
          ಇತ್ತೀಚಿನ ಪ್ರಕಟಣೆಗಳು ({announcements.length})
        </h2>

        {announcements.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#EFEBE4] text-sm text-[#5C403D]">
            No announcements found. Click "New Announcement" to publish one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {announcements.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 flex flex-col justify-between"
              >
                <div>
                  {item.mediaUrl && (
                    <div className="aspect-video w-full overflow-hidden bg-[#F6F3F2]">
                      {item.mediaType === 'video' ? (
                        <video src={item.mediaUrl} className="w-full h-full object-cover" />
                      ) : (
                        <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#916F6B]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#9B000E]" />
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#9B000E] font-semibold"
                        >
                          <span>Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#1C1B1B] font-kannada line-clamp-1">
                      {item.title_k || item.title}
                    </h3>
                    {item.title_k && item.title && (
                      <p className="text-xs text-[#5C403D] truncate">
                        ({item.title})
                      </p>
                    )}

                    <p className="text-xs text-[#5C403D] line-clamp-2 leading-relaxed font-kannada">
                      {item.message}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 py-1.5 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] hover:bg-[#F6F3F2] text-xs font-semibold text-[#1C1B1B] flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#9B000E]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="py-1.5 px-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}