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
    const res = await fetch(API);
    const data = await res.json();
    setEvents(data);
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
      setStatus(editingId ? "✅ Event updated!" : "✅ Event added!");
      setTimeout(() => setStatus(""), 3000);
    } else {
      const err = await res.json();
      setStatus("❌ " + (err.error || "Failed to save event"));
      setTimeout(() => setStatus(""), 4000);
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
    setEditingId(event._id);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchEvents();
    setStatus("🗑️ Event deleted");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      <h2 className="text-2xl font-bold text-white text-center mb-6">Manage Events</h2>

      {status && (
        <div className="bg-blue-100 text-blue-800 border border-blue-400 rounded-lg px-4 py-2 mb-4 text-center font-semibold">
          {status}
        </div>
      )}

      {/* Event Form */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col gap-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="border text-gray-800 rounded-md px-3 py-2 w-full"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="border text-gray-800 rounded-md px-3 py-2 w-full"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="border text-gray-800 rounded-md px-3 py-2 w-full"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border text-gray-800 rounded-md px-3 py-2 w-full"
        />
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
          className="border text-gray-800 rounded-md px-3 py-2 w-full"
        />
        {preview && (
          <img src={preview} alt="preview" className="w-48 h-32 object-cover rounded-md mx-auto" />
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-400 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-md"
          >
            {editingId ? "Update" : "Add"} Event
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({ title: "", description: "", date: "", location: "" });
              setImageFile(null);
              setPreview(null);
              setEditingId(null);
            }}
            className="bg-gray-400 hover:bg-gray-900 text-white font-semibold px-4 py-2 rounded-md"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Event List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
          >
            <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
            <p className="text-gray-600 text-sm">{event.description}</p>
            <small className="text-gray-500">
              {new Date(event.date).toLocaleDateString()}
            </small>
            {event.location && <p className="text-gray-700 mt-1">📍 {event.location}</p>}
            {event.imageUrl && (
              <img
                src={`${event.imageUrl}`}
                alt={event.title}
                className="w-full h-40 object-cover rounded-md mt-3"
              />
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(event)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
