import React, { useEffect, useState } from "react";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
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
    formData.append("location", form.location);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/${editingId}` : API;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        fetchEvents();
        setForm({ title: "", description: "", date: "", location: "" });
        setImageFile(null);
        setEditingId(null);
        setPreview(null);
        setStatus({ type: "success", message: editingId ? "Event updated successfully!" : "Event added successfully!" });
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
      location: event.location || "",
    });
    setImageFile(null);
    setPreview(null);
    setEditingId(event._id);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    setForm({ title: "", description: "", date: "", location: "" });
    setImageFile(null);
    setPreview(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mb-6 shadow-2xl">
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Event Management
          </h1>
          <p className="text-xl text-slate-300">Create and manage your events with ease</p>
        </div>

        {/* Status Alert */}
        {status && (
          <div className={`rounded-2xl px-6 py-4 mb-8 text-center font-semibold text-lg shadow-xl border backdrop-blur-lg transition-all duration-500 transform ${
            status.type === "success" 
              ? "bg-green-500/20 text-green-300 border-green-400/30" 
              : "bg-red-500/20 text-red-300 border-red-400/30"
          }`}>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">{status.type === "success" ? "✅" : "❌"}</span>
              {status.message}
            </div>
          </div>
        )}

        {/* Event Form */}
        <div className="mb-12">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {editingId ? "✏️ Edit Event" : "✨ Create New Event"}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter event title..."
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your event..."
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>

                {/* Date and Location Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Event Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Event location..."
                      value={form.location}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Event Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {preview && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="text-sm text-slate-300 mb-3 font-medium">Preview:</p>
                    <img 
                      src={preview} 
                      alt="preview" 
                      className="w-full h-48 object-cover rounded-xl shadow-lg border border-white/20" 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-xl ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {editingId ? "✏️ Update Event" : "✨ Create Event"}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={clearForm}
                disabled={loading}
                className="flex-1 sm:flex-none bg-slate-600 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300 shadow-xl"
              >
                🗑️ Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Events Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            📅 All Events ({events.length})
          </h2>
          
          {loading && events.length === 0 ? (
            <div className="text-center py-16">
              <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-300 text-lg">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">📅</div>
              <h3 className="text-2xl font-semibold text-slate-300 mb-4">No events yet</h3>
              <p className="text-slate-400 text-lg">Create your first event using the form above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/15"
                >
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={`${event.imageUrl}`}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}

                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 flex-1 pr-2">
                        {event.title}
                      </h3>
                      <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <p className="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-3">
                      {event.description}
                    </p>

                    {event.location && (
                      <div className="flex items-center text-slate-400 text-sm mb-4">
                        <span className="mr-2">📍</span>
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleEdit(event)}
                        disabled={loading}
                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        disabled={loading}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
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
    </div>
  );
}