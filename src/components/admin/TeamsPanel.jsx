import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function TeamsPanel() {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({ team_name: "", team_name_k: "", order: 0 });
  const [teamPhoto, setTeamPhoto] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderValue, setOrderValue] = useState(0);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editFormData, setEditFormData] = useState({ team_name: "", team_name_k: "" });
  const [editPhoto, setEditPhoto] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("adminToken"));
    }
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/teams`);
      const data = await res.json();
      const teamsData = data.teams || [];
      setTeams(teamsData);

      // Calculate max order and set default for new team
      const maxOrder = teamsData.length > 0 ? Math.max(...teamsData.map(team => team.order || 0)) : 0;
      setFormData(prev => ({ ...prev, order: maxOrder + 1 }));
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Failed to load teams" });
      setTimeout(() => setStatus(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeamPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("team_name", formData.team_name);
    form.append("team_name_k", formData.team_name_k);
    form.append("order", formData.order);
    if (teamPhoto) form.append("photo", teamPhoto);

    try {
      const res = await fetch(`${API_BASE}/api/teams`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (data?.team) {
        setStatus({ type: "success", message: "Team added successfully!" });
        setFormData({ team_name: "", team_name_k: "", order: 0 }); // reset both fields
        setTeamPhoto(null);
        setPreview(null);
        fetchTeams();
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus({ type: "error", message: data?.message || "Failed to add team" });
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


  const clearForm = () => {
    setFormData({ team_name: "", team_name_k: "", order: 0 });
    setTeamPhoto(null);
    setPreview(null);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team._id);
    setEditFormData({ team_name: team.team_name, team_name_k: team.team_name_k });
    setEditPhoto(null);
    setEditPreview(null);
  };

  const handleEditPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditPhoto(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveTeam = async (teamId) => {
    setLoading(true);
    const form = new FormData();
    form.append("team_name", editFormData.team_name);
    form.append("team_name_k", editFormData.team_name_k);
    if (editPhoto) form.append("photo", editPhoto);

    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (data?.team) {
        setStatus({ type: "success", message: "Team updated successfully!" });
        setEditingTeam(null);
        setEditFormData({ team_name: "", team_name_k: "" });
        setEditPhoto(null);
        setEditPreview(null);
        fetchTeams();
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus({ type: "error", message: data?.message || "Failed to update team" });
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

  const handleCancelEdit = () => {
    setEditingTeam(null);
    setEditFormData({ team_name: "", team_name_k: "" });
    setEditPhoto(null);
    setEditPreview(null);
  };

  const handleEditOrder = (teamId, currentOrder) => {
    setEditingOrder(teamId);
    setOrderValue(currentOrder);
  };

  const handleSaveOrder = async (teamId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamId}/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order: orderValue }),
      });
      const data = await res.json();
      if (data?.message) {
        setStatus({ type: "success", message: "Team order updated successfully!" });
        setEditingOrder(null);
        fetchTeams();
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus({ type: "error", message: data?.message || "Failed to update order" });
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

  const handleDeleteTeam = async (teamId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.success) {
        setStatus({ type: "success", message: "Team deleted successfully!" });
        setDeleteConfirm(null);
        fetchTeams();
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus({ type: "error", message: data?.message || "Failed to delete team" });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-6 shadow-2xl">
            <span className="text-3xl">👥</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Domain Management
          </h1>
          <p className="text-xl text-slate-300">Create and organize your teams</p>
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

        {/* Add Team Form */}
        <div className="mb-12">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              ✨ Create New Team
            </h2>

            <div className="space-y-6">
              {/* Team Name Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  placeholder="Enter team name..."
                  value={formData.team_name}
                  onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team Name (Kannada)
                </label>
                <input
                  type="text"
                  placeholder="Enter team name in Kannada..."
                  value={formData.team_name_k}
                  onChange={(e) => setFormData({ ...formData, team_name_k: e.target.value })}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  placeholder="Enter display order (e.g., 1, 2, 3...)"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-lg"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                />
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

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-xl ${loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating Team...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    ➕ Create Team
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={clearForm}
                disabled={loading}
                className="flex-1 sm:flex-none bg-slate-600 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300 shadow-xl"
              >
                🗑️ Clear
              </button>
            </div>
          </form>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl max-w-md mx-4">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">⚠️ Confirm Deletion</h3>
              <p className="text-slate-300 mb-6 text-center">
                Are you sure you want to delete this team? This will also remove all team members and cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDeleteTeam(deleteConfirm)}
                  disabled={loading}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-3 rounded-xl transition-colors duration-200"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={loading}
                  className="flex-1 bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 px-4 py-3 rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Teams Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            All Teams ({teams.length})
          </h2>

          {loading && teams.length === 0 ? (
            <div className="text-center py-16">
              <div className="animate-spin h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-300 text-lg">Loading teams...</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">👥</div>
              <h3 className="text-2xl font-semibold text-slate-300 mb-4">No teams yet</h3>
              <p className="text-slate-400 text-lg">Create your first team using the form above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 items-stretch">
              {teams.map((team) => (
                <div
                  key={team._id}
                  onClick={() => router.push(`/admin/teamDetails/${team._id}`)}
                  className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-white/15 hover:shadow-cyan-500/20 h-full"
                >
                  {/* Team Image */}
                  {team.team_photo && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={team.team_photo}
                        alt={team.team_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                          👁️ View Team
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Team Content */}
                  <div className="p-6">
                    {editingTeam === team._id ? (
                      <div onClick={(e) => e.stopPropagation()} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">
                            Team Name
                          </label>
                          <input
                            type="text"
                            value={editFormData.team_name}
                            onChange={(e) => setEditFormData({ ...editFormData, team_name: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">
                            Team Name (Kannada)
                          </label>
                          <input
                            type="text"
                            value={editFormData.team_name_k}
                            onChange={(e) => setEditFormData({ ...editFormData, team_name_k: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">
                            Team Logo (Optional)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditPhotoChange}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                            disabled={loading}
                          />
                        </div>
                        {editPreview && (
                          <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                            <p className="text-xs text-slate-300 mb-2">New Preview:</p>
                            <img
                              src={editPreview}
                              alt="edit preview"
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveTeam(team._id)}
                            disabled={loading}
                            className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                          >
                            ✓ Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={loading}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                            {team.team_name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {/* Edit Team Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTeam(team);
                              }}
                              disabled={loading}
                              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 p-1 rounded-full transition-colors duration-200"
                              title="Edit team"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {/* Delete Team Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirm(team._id);
                              }}
                              disabled={loading}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-1 rounded-full transition-colors duration-200"
                              title="Delete team"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            {/* Order Edit */}
                            {editingOrder === team._id ? (
                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="number"
                                  value={orderValue}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setOrderValue(parseInt(e.target.value) || 0);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  min="0"
                                  className="w-16 bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                  disabled={loading}
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveOrder(team._id);
                                  }}
                                  disabled={loading}
                                  className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-2 py-1 rounded-lg text-sm transition-colors duration-200"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingOrder(null);
                                  }}
                                  disabled={loading}
                                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2 py-1 rounded-lg text-sm transition-colors duration-200"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs font-medium">
                                  #{team.order || 0}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditOrder(team._id, team.order || 0);
                                  }}
                                  disabled={loading}
                                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-1 rounded-full transition-colors duration-200"
                                  title="Edit order"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              </div>
                            )}
                            <div className="bg-cyan-500/20 text-cyan-300 p-2 rounded-full group-hover:bg-cyan-500/30 transition-colors duration-300">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-slate-400 text-sm flex items-center gap-2">
                            <span>👥</span>
                            Click to manage team members
                          </p>
                        </div>
                      </>
                    )}
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