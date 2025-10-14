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
    name_k: "",
    email: "",
    phone: "",
    role: "member",
  });
  const [photo, setPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [modalImg, setModalImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = localStorage.getItem("adminToken");

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamId}/members`);
      const data = await res.json();
      setMembers(data.members || []);
      setHeads(data.heads || []);
      setTeamName(data.team_name);
      setTeamPhoto(data.team_photo);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Failed to load members" });
      setTimeout(() => setStatus(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("name_k", formData.name_k);
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
        setStatus({
          type: "success",
          message: editingId ? "Member updated successfully!" : "Member added successfully!"
        });
        setFormData({ name: "", name_k: "", email: "", phone: "", role: "member" });
        setPhoto(null);
        setPreview(null);
        setEditingId(null);
        fetchMembers();
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus({ type: "error", message: data?.message || "Failed to save member" });
        setTimeout(() => setStatus(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server error occurred" });
      setTimeout(() => setStatus(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/teams/members/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus({ type: "success", message: "Member deleted successfully" });
      fetchMembers();
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Delete failed" });
      setTimeout(() => setStatus(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mem) => {
    setEditingId(mem._id);
    setFormData({
      name: mem.name,
      name_k: mem.name_k,
      email: mem.email,
      phone: mem.phone,
      role: mem.role,
    });
    setPhoto(null);
    setPreview(null);
    // Scroll to form
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const clearForm = () => {
    setFormData({ name: "", name_k: "", email: "", phone: "", role: "member" });
    setPhoto(null);
    setPreview(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Team Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center">
            {teamPhoto && (
              <div className="relative mb-6">
                <img
                  src={teamPhoto}
                  alt="Team"
                  className="w-32 h-32 object-cover rounded-full border-4 border-emerald-400 shadow-2xl"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}
            <h1 className="text-5xl font-bold text-lime-400 mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {teamName}
            </h1>
          </div>
        </div>

        {/* Status Alert */}
        {status && (
          <div className={`rounded-2xl px-6 py-4 mb-8 text-center font-semibold text-lg shadow-xl border backdrop-blur-lg transition-all duration-500 transform ${status.type === "success"
            ? "bg-green-500/20 text-green-300 border-green-400/30"
            : "bg-red-500/20 text-red-300 border-red-400/30"
            }`}>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">{status.type === "success" ? "✅" : "❌"}</span>
              {status.message}
            </div>
          </div>
        )}

        {/* Heads Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3">
              <span className="text-2xl">👑</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Team Heads</h2>
            <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
              {heads.length} {heads.length === 1 ? 'Head' : 'Heads'}
            </span>
          </div>

          {heads.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-6xl mb-4">👑</div>
              <p className="text-slate-300 text-lg">No team heads yet</p>
              <p className="text-slate-400">Add a member with 'Head' role below</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heads.map((member) => (
                <div
                  key={member._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/15"
                >
                  {/* Member Image */}
                  {member.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={member.image_url}
                        alt={member.name}
                        onClick={() => setModalImg(member.image_url)}
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-yellow-500/20 backdrop-blur-sm text-yellow-300 px-3 py-1 rounded-full text-xs font-medium border border-yellow-400/30">
                        👑 HEAD
                      </div>
                    </div>
                  )}

                  {/* Member Info */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white mb-2">{member.name_k}</h4>
                    <h5 className="text-sm font-bold !text-white mb-2">{member.name}</h5>
                    <div className="space-y-2 mb-4">
                      <p className="text-slate-300 text-sm flex items-center gap-2">
                        <span>📧</span> {member.email}
                      </p>
                      <p className="text-slate-300 text-sm flex items-center gap-2">
                        <span>📱</span> {member.phone}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() => handleEdit(member)}
                        disabled={loading}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                        onClick={() => handleDelete(member._id)}
                        disabled={loading}
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

        {/* Members Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full p-3">
              <span className="text-2xl">👥</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Team Members</h2>
            <span className="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-sm font-medium">
              {members.length} {members.length === 1 ? 'Member' : 'Members'}
            </span>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-slate-300 text-lg">No team members yet</p>
              <p className="text-slate-400">Add members using the form below</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10 border-b border-white/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Photo</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {members.map((member) => (
                      <tr key={member._id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <img
                            src={member.image_url || "/default_img.jpg"}
                            alt={member.name}
                            onClick={() => setModalImg(member.image_url || "/default_img.jpg")}
                            className="w-12 h-12 rounded-full object-cover cursor-pointer border-2 border-white/20 hover:border-teal-400 transition-colors duration-200"
                          />
                        </td>
                        <td className="px-6 py-4 text-white font-medium">{member.name}</td>
                        <td className="px-6 py-4 text-slate-300">{member.email}</td>
                        <td className="px-6 py-4 text-slate-300">{member.phone}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium px-3 py-1 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              onClick={() => handleEdit(member)}
                              disabled={loading}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium px-3 py-1 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                              onClick={() => handleDelete(member._id)}
                              disabled={loading}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {modalImg && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <button
              onClick={() => setModalImg(null)}
              className="absolute top-6 right-8 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg z-50"
            >
              ✕ Close
            </button>

            <div className="relative">
              <img
                src={modalImg}
                alt="Enlarged"
                className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl border-4 border-white/20 object-contain"
              />
            </div>
          </div>
        )}

        {/* Add/Update Member Form */}
        <div className="mb-8">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {editingId ? "✏️ Update Member" : "➕ Add New Member"}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Name in Kannada
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name in Kannada..."
                    value={formData.name_k}
                    onChange={(e) => setFormData({ ...formData, name_k: e.target.value })}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  />
                </div>


                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address..."
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Phone and Role Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter phone number..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="member" className="bg-gray-800">👥 Member</option>
                      <option value="head" className="bg-gray-800">👑 Head</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column - Photo Upload */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Profile Photo
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
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
                className={`flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-xl ${loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    {editingId ? "Updating..." : "Adding..."}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {editingId ? "✏️ Update Member" : "➕ Add Member"}
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
      </div>
    </div>
  );
}