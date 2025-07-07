import React, { useEffect, useState } from "react";
import "./styles/AdminDashboard.css";

export default function AnnouncementPanel() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });
  const [editingId, setEditingId] = useState(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `${API_BASE}/api/announcements/${editingId}`
      : `${API_BASE}/api/announcements`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        fetchAnnouncements();
        setForm({ title: "", message: "" });
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to submit announcement:", err);
    }
  };

  const handleEdit = (announcement) => {
    setForm({ title: announcement.title, message: announcement.message });
    setEditingId(announcement._id);
  };

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
    <div className="admin-panel">
      <h2>📢 Announcements</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Announcement content"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? "Update" : "Add"} Announcement
        </button>
      </form>

      <ul className="admin-list">
        {announcements.map((a) => (
          <li key={a._id} className="announcement-card">
            <h3 className="announcement-title">{a.title}</h3>
            <p className="announcement-message">{a.message}</p>
            <div className="actions">
              <button onClick={() => handleEdit(a)}>Edit</button>
              <button onClick={() => handleDelete(a._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
