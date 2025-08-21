import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/teamDetail.css"

export default function TeamDetails() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [heads, setHeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamPhoto, setTeamPhoto] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", role: "member" });
  const [photo, setPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [modalImg, setModalImg] = useState(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamId}/members`);
      const data = await res.json();
      console.log("team data: ", data);
      setMembers(data.members || []);
      setHeads(data.heads || []);
      setTeamName(data.team_name);
      setTeamPhoto(data.team_photo);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to load members");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("role", formData.role);
    if (photo) form.append("photo", photo);

    try {
      const url = editingId
        ? `${API_BASE}/api/teams/members/${editingId}`
        : `${API_BASE}/api/teams/${teamId}/members`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();
      if (data?.member) {
        setStatus(editingId ? "✅ Member updated" : "✅ Member added");
        setFormData({ name: "", email: "", phone: "", role: "member" });
        setPhoto(null);
        setEditingId(null);
        fetchMembers();
      } else {
        setStatus(data?.message || "❌ Failed to save member");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await fetch(`${API_BASE}/api/teams/members/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus("🗑️ Member deleted");
      fetchMembers();
    } catch (err) {
      console.error(err);
      setStatus("❌ Delete failed");
    }
  };

  const handleEdit = (mem) => {
    setEditingId(mem._id);
    setFormData({
      name: mem.name,
      email: mem.email,
      phone: mem.phone,
      role: mem.role,
    });
    setPhoto(null);
    setStatus("✏️ Editing member...");
  };

  return (
    <div className="team-details">
      {/* Team Header */}
      <div className="team-header">
        {teamPhoto && <img src={`${teamPhoto}`} alt="Team" />}
        <h2>{teamName}</h2>
      </div>

      {status && <p>{status}</p>}

      {/* Heads Section */}
      <div className="heads-section">
        <h3>Heads</h3>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {heads.map((member) => (
            <div key={member._id} className="head-card">
              {member.image_url && (
                <img src={`${member.image_url}`} alt={member.name} />
              )}
              <h4>{member.name}</h4>
              <p>{member.email}</p>
              <p>{member.phone}</p>
              <div className="btns">
                <button className="edit-btn" onClick={() => handleEdit(member)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(member._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <h3>Members</h3>
      <table className="members-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id}>
              <td>
                {member.image_url && (
                  <img
                    src={`${member.image_url}`}
                    alt={member.name}
                    onClick={() => setModalImg(`${API_BASE}${member.image_url}`)}
                  />
                )}
              </td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.phone}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(member)}>
                  Edit
                </button>{" "}
                <button className="delete-btn" onClick={() => handleDelete(member._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Image */}
      {modalImg && (
        <div className="image-modal">
          <img src={modalImg} alt="Enlarged" />
          <button onClick={() => setModalImg(null)}>Close</button>
        </div>
      )}

      {/* Add/Update Member Form */}
      <form className="member-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h3>{editingId ? "Update Member" : "Add Member"}</h3>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="head">Head</option>
          <option value="member">Member</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required={!editingId}
        />
        <button type="submit">{editingId ? "Update Member" : "Add Member"}</button>
        <button
            type="button"
            onClick={() => {
                setFormData({ name: "", email: "", phone: "", role: "member" });
                setPhoto(null);
                setEditingId(null);
                setStatus("❌ Form cleared");
            }}
            >
            Cancel
        </button>
      </form>
    </div>
  );
}
