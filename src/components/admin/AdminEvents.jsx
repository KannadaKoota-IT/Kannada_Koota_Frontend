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
  const [status, setStatus] = useState(""); // ✅ NEW: for popup
  const token = localStorage.getItem("adminToken");

  const API = "http://localhost:5000/api/events";

  useEffect(() => {
    fetchEvents();
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
    setImageFile(e.target.files[0]);
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
      setForm({
        title: "",
        description: "",
        date: "",
        location: "",
      });
      setImageFile(null);
      setEditingId(null);
      setStatus(editingId ? "✅ Event updated!" : "✅ Event added!"); // ✅ show success
      setTimeout(() => setStatus(""), 3000); // hide after 3s
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
    <div className="admin-events">
      <h2>Manage Events</h2>

      {/* ✅ Status popup */}
      {status && (
        <div
          style={{
            background: "#f0f9ff",
            padding: "10px 20px",
            marginBottom: "1rem",
            border: "1px solid #5dade2",
            color: "#21618c",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="event-form" encType="multipart/form-data">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
        <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
        <button type="submit">{editingId ? "Update" : "Add"} Event</button>
      </form>

      <div className="event-list">
        {events.map((event) => (
          <div className="event-card" key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <small>{new Date(event.date).toLocaleDateString()}</small>
            {event.location && <p>📍 {event.location}</p>}
            {event.imageUrl && (
              <img
                src={`http://localhost:5000${event.imageUrl}`}
                alt={event.title}
              />
            )}
            <div className="actions">
              <button onClick={() => handleEdit(event)}>Edit</button>
              <button onClick={() => handleDelete(event._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
