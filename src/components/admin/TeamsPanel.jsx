import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TeamsPanel() {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({ team_name: "", team_name_k: "" });
  const [teamPhoto, setTeamPhoto] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/teams`);
      const data = await res.json();
      setTeams(data.teams || []);
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
        setFormData({ team_name: "", team_name_k: "" }); // reset both fields
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
    setFormData({ team_name: "" });
    setTeamPhoto(null);
    setPreview(null);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {teams.map((team) => (
                <div
                  key={team._id}
                  onClick={() => navigate(`/admin/teamDetails/${team._id}`)}
                  className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-white/15 hover:shadow-cyan-500/20"
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
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                        {team.team_name}
                      </h3>
                      <div className="bg-cyan-500/20 text-cyan-300 p-2 rounded-full group-hover:bg-cyan-500/30 transition-colors duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-slate-400 text-sm flex items-center gap-2">
                        <span>👥</span>
                        Click to manage team members
                      </p>
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