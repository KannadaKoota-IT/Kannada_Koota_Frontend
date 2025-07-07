import React, { useState, useEffect } from "react";
import "./styles/AdminDashboard.css";

export default function AdminGallery() {
  const [mediaList, setMediaList] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");

  // ✅ Use Vite env variable
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const fetchMedia = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/gallery`);
      const data = await res.json();
      setMediaList(data);
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error while fetching media.");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setStatus("⚠️ Please provide both title and media file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("media", file);

    try {
      const res = await fetch(`${API_BASE}/api/gallery`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setStatus("✅ Media uploaded successfully!");
        setTitle("");
        setFile(null);
        fetchMedia();
      } else {
        setStatus("❌ Upload failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error during upload.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setStatus("🗑️ Media deleted.");
        fetchMedia();
      } else {
        setStatus("❌ Failed to delete.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error during delete.");
    }
  };

  return (
    <div className="admin-panel">
      <h2>🖼️ Gallery Management</h2>
      {status && <p className="status-message">{status}</p>}

      <form onSubmit={handleUpload} encType="multipart/form-data" className="event-form">
        <input
          type="text"
          placeholder="Media title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>

      <div className="event-list">
        {mediaList.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No media uploaded yet.</p>
        ) : (
          mediaList.map((item) => (
            <div className="event-card" key={item._id}>
              {item.mediaType === "video" ? (
                <video
                  controls
                  src={`${API_BASE}${item.mediaUrl}`}
                  style={{
                    width: "100%",
                    maxHeight: "180px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <img
                  src={`${API_BASE}${item.mediaUrl}`}
                  alt={item.title}
                  style={{ height: "180px", objectFit: "cover", borderRadius: "10px" }}
                />
              )}
              <h3>{item.title}</h3>
              <div className="actions">
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
