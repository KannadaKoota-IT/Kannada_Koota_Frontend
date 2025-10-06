import React, { useEffect, useState } from "react";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    eventTime: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("adminToken");
  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const API = `${API_BASE}/api/events`;

  useEffect(() => {
    if (!token) {
      alert("Please log in first.");
      window.location.href = "/admin-login";
    } else {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("adminToken");
          alert("Session expired. Please log in again.");
          window.location.href = "/admin-login";
          return;
        }
        fetchEvents();
      } catch (err) {
        localStorage.removeItem("adminToken");
        alert("Invalid token. Please log in again.");
        window.location.href = "/admin-login";
      }
    }
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setEvents(data);
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
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("eventTime", form.eventTime);
    formData.append("location", form.location);
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
        setForm({ title: "", description: "", date: "", eventTime: "", location: "" });
        setImageFile(null);
        setEditingId(null);
        setPreview(null);
        setStatus({
          type: "success",
          message: editingId ? "Event updated successfully!" : "Event created successfully!",
        });
        setTimeout(() => setStatus(""), 4000);
      } else {
        const err = await res.json();
        setStatus({ type: "error", message: err.error || "Failed to save event" });
        setTimeout(() => setStatus(""), 4000);
      }
    } catch (error) {
      setStatus({ type: "error", message: "Network error occurred" });
      setTimeout(() => setStatus(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      eventTime: event.eventTime || "",
      location: event.location || "",
    });
    setImageFile(null);
    setPreview(null);
    setEditingId(event._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    setLoading(true);
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchEvents();
      setStatus({ type: "success", message: "Event deleted successfully" });
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      setStatus({ type: "error", message: "Failed to delete event" });
      setTimeout(() => setStatus(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm({ title: "", description: "", date: "", eventTime: "", location: "" });
    setImageFile(null);
    setPreview(null);
    setEditingId(null);
  };

  // 🔹 Format time into 12-hour AM/PM
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12; // convert 0 -> 12
    return `${h}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Event Management Dashboard
          </h1>
          <p className="text-slate-300 mt-3 text-lg">
            Create, update, and manage your events with style ✨
          </p>
        </div>

        {/* Status */}
        {status && (
          <div
            className={`mb-8 p-4 rounded-xl text-center font-semibold shadow-lg ${
              status.type === "success"
                ? "bg-green-500/20 text-green-300 border border-green-400/40"
                : "bg-red-500/20 text-red-300 border border-red-400/40"
            }`}
          >
            {status.type === "success" ? "✅" : "❌"} {status.message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-md shadow-xl mb-16"
        >
          <h2 className="text-2xl font-bold mb-8">
            {editingId ? "✏️ Edit Event" : "✨ Create New Event"}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none"
              />

              <textarea
                name="description"
                placeholder="Event Description..."
                value={form.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <input
                  type="time"
                  name="eventTime"
                  value={form.eventTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <input
                type="text"
                name="location"
                placeholder="Event Location (Optional)"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-500/20 file:text-orange-300 hover:file:bg-orange-500/30"
              />

              {preview && (
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <img src={preview} alt="preview" className="w-full h-48 object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
            >
              {loading ? "Processing..." : editingId ? "✏️ Update Event" : "✨ Create Event"}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-medium transition-all"
            >
              🗑️ Clear Form
            </button>
          </div>
        </form>

        {/* Events grid */}
        <h2 className="text-3xl font-bold mb-8 text-center">
          📅 All Events ({events.length})
        </h2>

        {loading && events.length === 0 ? (
          <p className="text-center text-slate-300">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-slate-400">No events yet. Create one above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform"
              >
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-sm text-slate-300 mb-2">
                    {new Date(event.date).toLocaleDateString()} •{" "}
                    {formatTime(event.eventTime)}
                  </p>
                  <p className="text-slate-400 mb-4 line-clamp-3">{event.description}</p>
                  {event.location && (
                    <p className="text-sm text-slate-400 mb-4">📍 {event.location}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
