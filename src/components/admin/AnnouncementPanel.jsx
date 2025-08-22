import React, { useEffect, useState } from "react";

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
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">📢 Announcements</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 mb-8"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
        />
        <textarea
          name="message"
          placeholder="Announcement content"
          value={form.message}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
        >
          {editingId ? "Update" : "Add"} Announcement
        </button>
      </form>

      {/* Announcements List */}
      <ul className="flex flex-wrap gap-4">
        {announcements.map((a) => (
          <li
            key={a._id}
            className="bg-white text-gray-900 w-96 h-52 p-4 rounded-lg shadow-md flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-indigo-700 mb-2">
                {a.title}
              </h3>
              <p className="text-sm text-gray-700">{a.message}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(a)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(a._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
