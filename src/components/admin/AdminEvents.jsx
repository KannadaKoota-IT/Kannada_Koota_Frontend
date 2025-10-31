import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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
      title_k: event.title_k || "",
      description: event.description,
      description_k: event.description_k || "",
      date: event.date.split("T")[0],
      eventTime: event.eventTime || "",
      location: event.location || "",
      link: event.link || "",
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
    setForm({ title: "", title_k: "", description: "", description_k: "", date: "", eventTime: "", location: "", link: "" });
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
            className={`mb-8 p-4 rounded-xl text-center font-semibold shadow-lg ${status.type === "success"
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
          <h2 className="text-2xl font-bold mb-8 text-center">
            {editingId ? "✏️ Edit Event" : "✨ Create New Event"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Title & Title (Kannada) */}
            <div>
              <label className="block mb-2 text-slate-300 font-medium">Event Title</label>
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-slate-300 font-medium">Event Title (Kannada)</label>
              <input
                type="text"
                name="title_k"
                placeholder="Event Title in Kannada"
                value={form.title_k}
                onChange={handleChange}
                required
                className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Description & Description (Kannada) */}
            <div>
              <label className="block mb-2 text-slate-300 font-medium">Event Description</label>
              <textarea
                name="description"
                placeholder="Event Description..."
                value={form.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-slate-300 font-medium">Event Description (Kannada)</label>
              <textarea
                name="description_k"
                placeholder="Event Description in Kannada..."
                value={form.description_k}
                onChange={handleChange}
                rows="4"
                required
                className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block mb-2 text-slate-300 font-medium">Event Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-slate-300 font-medium">Event Time</label>
              <input
                type="time"
                name="eventTime"
                value={form.eventTime}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Location (Full width) */}
          <div className="mt-8">
            <label className="block mb-2 text-slate-300 font-medium">Event Location (Optional)</label>
            <input
              type="text"
              name="location"
              placeholder="Event Location"
              value={form.location}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* Link (Full width) */}
          <div className="mt-8">
            <label className="block mb-2 text-slate-300 font-medium">Event Link (Optional)</label>
            <input
              type="url"
              name="link"
              placeholder="https://example.com"
              value={form.link}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* Image Upload (Full width) */}
          <div className="mt-8">
            <label className="block mb-2 text-slate-300 font-medium">Upload Event Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-500/20 file:text-orange-300 hover:file:bg-orange-500/30"
            />

            {preview && (
              <div className="border border-white/10 rounded-xl overflow-hidden mt-4">
                <img src={preview} alt="preview" className="w-full h-48 object-cover" />
              </div>
            )}
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
                onClick={() => setSelectedEvent(event)}
                className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"
              >
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="!text-xl !font-bold mb-2">{event.title_k}</h3>
                  <h3 className="!text-sm !text-red-300 !font-bold mb-2">{`(${event.title})`}</h3>
                  <p className="text-sm text-slate-300 mb-2">
                    {new Date(event.date).toLocaleDateString()} •{" "}
                    {formatTime(event.eventTime)}
                  </p>
                  {event.location && (
                    <p className="text-sm text-slate-400 mb-4">📍 {event.location}</p>
                  )}
                  {event.link && (
                    <p className="text-sm text-blue-400 mb-4">
                      🔗 <a href={event.link} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">Event Link</a>
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(event); }}
                      className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(event._id); }}
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

      {/* 🔹 Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <button
            onClick={() => setSelectedEvent(null)}
            className="fixed top-6 right-6 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg transition-all z-50"
          >
            ✖
          </button>

          <div className="bg-slate-900 border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden relative">
            {/* Image */}
            {selectedEvent.imageUrl && (
              <div className="p-3 border-b border-white/10 flex justify-center">
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  className="max-h-40 object-contain rounded-lg"
                />
              </div>
            )}


            {/* Content */}
            <div className="p-6 space-y-4">
              <h3>{selectedEvent.title_k}
                <span className="text-xl ml-2 text-yellow-200 font-semibold">{`(${selectedEvent.title})`}</span>
              </h3>

              <p className="text-sm text-slate-300">
                📅 {new Date(selectedEvent.date).toLocaleDateString()} • {formatTime(selectedEvent.eventTime)}
              </p>

              {selectedEvent.location && (
                <p className="text-sm text-slate-400">📍 {selectedEvent.location}</p>
              )}

              {selectedEvent.link && (
                <p className="text-sm text-blue-400">
                  🔗 <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">Event Link</a>
                </p>
              )}

              <div className="border-t border-white/10 pt-4 space-y-3">
                <p className="text-base text-slate-100 leading-relaxed">{selectedEvent.description_k}</p>
                <p className="text-sm text-slate-400 leading-relaxed italic">{selectedEvent.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default dynamic(() => Promise.resolve(AdminEvents), { ssr: false });
