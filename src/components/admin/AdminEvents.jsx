import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { getMediaUrl, handleImageError, DEFAULT_EVENT_IMAGE } from "../../utils/mediaUtils";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    title_k: "",
    description: "",
    description_k: "",
    date: "",
    eventTime: "",
    location: "",
    link: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [token, setToken] = useState(null);
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const API = `${API_BASE}/api/events`;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const t = localStorage.getItem("adminToken");
    if (!t) {
      alert("Please log in first.");
      window.location.href = "/admin-login";
      return;
    }

    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminToken");
        alert("Session expired. Please log in again.");
        window.location.href = "/admin-login";
        return;
      }
      setToken(t);
      fetchEvents();
    } catch (err) {
      localStorage.removeItem("adminToken");
      alert("Invalid token. Please log in again.");
      window.location.href = "/admin-login";
    }
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}?admin=true`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("title_k", form.title_k);
    formData.append("description", form.description);
    formData.append("description_k", form.description_k);

    formData.append("date", form.date);
    formData.append("eventTime", form.eventTime);
    formData.append("location", form.location);
    if (form.link) formData.append("link", form.link);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/${editingId}` : API;

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        fetchEvents();
        clearForm();
        setStatus({
          type: "success",
          message: editingId ? "Event updated successfully!" : "Event created successfully!",
        });
        setTimeout(() => setStatus(""), 4000);
      } else {
        const err = await res.json();
        setStatus({ type: "error", message: err.error || "Failed to save event" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      title_k: event.title_k || "",
      description: event.description,
      description_k: event.description_k || "",
      date: event.date ? event.date.split("T")[0] : "",
      eventTime: event.eventTime || "",
      location: event.location || "",
      link: event.link || "",
    });
    setEditingId(event._id);
    setPreview(event.imageUrl || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchEvents();
        setStatus({ type: "success", message: "Event deleted successfully!" });
        setTimeout(() => setStatus(""), 4000);
      } else {
        setStatus({ type: "error", message: "Failed to delete event" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server error occurred" });
    }
  };

  const clearForm = () => {
    setForm({ title: "", title_k: "", description: "", description_k: "", date: "", eventTime: "", location: "", link: "" });
    setImageFile(null);
    setPreview(null);
    setEditingId(null);
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFEBE4]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#9B000E]">
            ಕಾರ್ಯಕ್ರಮ ನಿರ್ವಹಣೆ
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1B1B] font-kannada">
            Event Management Console
          </h1>
          <p className="text-xs sm:text-sm text-[#5C403D]">
            Create and manage campus celebrations, theatre auditions, and festivals.
          </p>
        </div>
      </div>

      {/* Status Alert */}
      {status && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 border ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white rounded-3xl border border-[#EFEBE4] p-6 sm:p-8 elevation-1 space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE4]">
          <h2 className="text-lg sm:text-xl font-bold text-[#1C1B1B] font-kannada">
            {editingId ? "ಕಾರ್ಯಕ್ರಮ ಸಂಪಾದಿಸಿ (Edit Event)" : "ಹೊಸ ಕಾರ್ಯಕ್ರಮ ಸೇರಿಸಿ (Create Event)"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={clearForm}
              className="text-xs text-[#9B000E] font-semibold hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Event Title (English) *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Kannada Rajyotsava 2026"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Event Title (ಕನ್ನಡ) *
            </label>
            <input
              type="text"
              name="title_k"
              placeholder="ಉದಾ: ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ ಸಂಭ್ರಮ"
              value={form.title_k}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E] font-kannada"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Description (English) *
            </label>
            <textarea
              name="description"
              placeholder="Provide event details, schedule highlights, chief guests..."
              value={form.description}
              onChange={handleChange}
              rows="3"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              ವಿವರಣೆ (ಕನ್ನಡದಲ್ಲಿ) *
            </label>
            <textarea
              name="description_k"
              placeholder="ಕಾರ್ಯಕ್ರಮದ ಸವಿವರ ಮಾಹಿತಿ..."
              value={form.description_k}
              onChange={handleChange}
              rows="3"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E] font-kannada"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Event Date *
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Event Time
            </label>
            <input
              type="time"
              name="eventTime"
              value={form.eventTime}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Location / Venue
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Kuvempu Rangamandira / Audi 1"
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Registration Link (Optional)
            </label>
            <input
              type="url"
              name="link"
              placeholder="https://forms.gle/..."
              value={form.link}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
            Event Banner / Poster Image
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="text-xs text-[#5C403D] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-[#EFEBE4] file:bg-[#FCF9F8] file:text-xs file:font-semibold file:text-[#1C1B1B] hover:file:bg-[#F6F3F2]"
            />
            {preview && (
              <div className="w-24 h-16 rounded-xl overflow-hidden border border-[#EFEBE4] bg-[#F6F3F2] shrink-0">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#EFEBE4]">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#9B000E] hover:bg-[#7D000B] text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>Processing...</span>
            ) : editingId ? (
              <>
                <Edit2 className="w-4 h-4" />
                <span>Update Event</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Publish Event</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="px-5 py-2.5 rounded-xl border border-[#EFEBE4] bg-white text-[#5C403D] hover:bg-[#F6F3F2] font-semibold text-sm transition-colors cursor-pointer"
          >
            Clear Form
          </button>
        </div>
      </form>

      {/* Events List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1C1B1B] font-kannada">
            ಎಲ್ಲಾ ಕಾರ್ಯಕ್ರಮಗಳು ({events.length})
          </h2>
        </div>

        {loading && events.length === 0 ? (
          <div className="text-center py-12 text-sm text-[#5C403D]">
            Loading events list...
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#EFEBE4] text-sm text-[#5C403D]">
            No events registered yet. Use the form above to add an event.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 flex flex-col justify-between"
              >
                <div>
                  {event.imageUrl ? (
                    <div className="aspect-video w-full overflow-hidden bg-[#F6F3F2]">
                      <img
                        src={getMediaUrl(event.imageUrl, DEFAULT_EVENT_IMAGE)}
                        alt={event.title}
                        onError={(e) => handleImageError(e, DEFAULT_EVENT_IMAGE)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full crimson-gradient flex items-center justify-center text-white/30">
                      <Calendar className="w-10 h-10" />
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-bold text-[#1C1B1B] font-kannada line-clamp-1">
                      {event.title_k || event.title}
                    </h3>
                    {event.title_k && event.title && (
                      <p className="text-xs text-[#5C403D] truncate">
                        ({event.title})
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-[#916F6B] pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#9B000E]" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      {event.eventTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#916F6B]" />
                          {formatTime(event.eventTime)}
                        </span>
                      )}
                    </div>

                    {event.location && (
                      <p className="text-xs text-[#5C403D] flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#9B000E] shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 py-1.5 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] hover:bg-[#F6F3F2] text-xs font-semibold text-[#1C1B1B] flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#9B000E]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
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

export default dynamic(() => Promise.resolve(AdminEvents), { ssr: false });
