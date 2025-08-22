import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TeamDetails() {
  const { teamId } = useParams();

  const [heads, setHeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamPhoto, setTeamPhoto] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "member",
  });
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
    <div className="p-6 bg-[#111] text-white min-h-screen font-sans">
      {/* Team Header */}
      <div className="flex flex-col items-center justify-center mb-8">
        {teamPhoto && (
          <img
            src={teamPhoto}
            alt="Team"
            className="w-32 h-32 object-cover rounded-xl border-2 border-lime-400 mb-3"
          />
        )}
        <h2 className="text-3xl font-bold text-lime-400">{teamName}</h2>
      </div>

      {status && (
        <p className="mb-4 text-sm text-gray-400 font-semibold">{status}</p>
      )}

      {/* Heads Section */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Heads</h3>
        <div className="flex flex-wrap gap-5">
          {heads.map((member) => (
            <div
              key={member._id}
              className="bg-gray-700 rounded-xl p-5 text-center shadow-md w-64"
            >
              {member.image_url && (
                <img
                  src={member.image_url}
                  alt={member.name}
                  onClick={() => setModalImg(member.image_url)}
                  className="w-full h-44 object-cover rounded-lg mb-3 cursor-pointer"
                />
              )}
              <h4 className="text-lg font-semibold">{member.name}</h4>
              <p className="text-sm text-gray-300">{member.email}</p>
              <p className="text-sm text-gray-400">{member.phone}</p>
              <div className="flex justify-center gap-3 mt-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  onClick={() => handleEdit(member)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  onClick={() => handleDelete(member._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <h3 className="text-xl font-semibold mb-4">Members</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className="border-b border-gray-700">
                <td className="px-4 py-3">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      onClick={() => setModalImg(member.image_url)}
                      className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />
                  ) : (
                    <img
                      src="/default_img.jpg"
                      alt={member.name}
                      onClick={() => setModalImg("/default_img.jpg")}
                      className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />
                  )}
                </td>
                <td className="px-4 py-3">{member.name}</td>
                <td className="px-4 py-3">{member.email}</td>
                <td className="px-4 py-3">{member.phone}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => handleEdit(member)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => handleDelete(member._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Enlarged Image */}
      {modalImg && (
        <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50">
          <img
            src={modalImg}
            alt="Enlarged"
            className="max-w-[80%] max-h-[80%] rounded-xl border-4 border-white"
          />
          <button
            onClick={() => setModalImg(null)}
            className="absolute top-8 right-10 px-5 py-2 text-lg bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      )}

      {/* Add/Update Member Form */}
      <form
        className="bg-gray-900 p-6 rounded-xl mt-8"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? "Update Member" : "Add Member"}
        </h3>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full p-3 mb-3 rounded-md border border-gray-600 bg-gray-800 text-white"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full p-3 mb-3 rounded-md border border-gray-600 bg-gray-800 text-white"
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="w-full p-3 mb-3 rounded-md border border-gray-600 bg-gray-800 text-white"
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full p-3 mb-3 rounded-md border border-gray-600 bg-gray-800 text-white"
        >
          <option value="head">Head</option>
          <option value="member">Member</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="mb-4 text-sm"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            {editingId ? "Update Member" : "Add Member"}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
            onClick={() => {
              setFormData({ name: "", email: "", phone: "", role: "member" });
              setPhoto(null);
              setEditingId(null);
              setStatus("❌ Form cleared");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
