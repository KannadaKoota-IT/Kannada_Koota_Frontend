import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowUpDown, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  X,
  ChevronRight
} from "lucide-react";

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
        setStatus({ type: "success", message: "Team domain created successfully!" });
        setFormData({ team_name: "", team_name_k: "", order: 0 });
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

  const handleEditTeam = (team) => {
    setEditingTeam(team._id);
    setEditFormData({ team_name: team.team_name, team_name_k: team.team_name_k || "" });
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

  const handleDeleteTeam = async (teamId) => {
    if (!confirm("Are you sure you want to delete this team and its members?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.message) {
        setStatus({ type: "success", message: "Team deleted successfully!" });
        fetchTeams();
        setTimeout(() => setStatus(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server error occurred" });
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const handleSaveOrder = async (teamId) => {
    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamId}/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: orderValue }),
      });
      const data = await res.json();
      if (data?.team) {
        setStatus({ type: "success", message: "Team order updated!" });
        setEditingOrder(null);
        fetchTeams();
        setTimeout(() => setStatus(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Failed to update order" });
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFEBE4]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#9B000E]">
            ತಂಡಗಳ ನಿರ್ವಹಣೆ
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1B1B] font-kannada">
            Domains & Teams Console
          </h1>
          <p className="text-xs sm:text-sm text-[#5C403D]">
            Organize club committees, assign domain coordinators, and manage hierarchy.
          </p>
        </div>
      </div>

      {/* Status Notice */}
      {status && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 border ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Create Team Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-[#EFEBE4] p-6 sm:p-8 elevation-1 space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE4]">
          <h2 className="text-lg sm:text-xl font-bold text-[#1C1B1B] font-kannada flex items-center gap-2">
            <Users className="w-5 h-5 text-[#9B000E]" />
            <span>ಹೊಸ ತಂಡ ಸೇರಿಸಿ (Create Domain Team)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Domain Name (English) *
            </label>
            <input
              type="text"
              placeholder="e.g. Cultural & Drama"
              value={formData.team_name}
              onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              ತಂಡದ ಹೆಸರು (ಕನ್ನಡ) *
            </label>
            <input
              type="text"
              placeholder="ಉದಾ: ನಾಟಕ ಮತ್ತು ರಂಗಭೂಮಿ"
              value={formData.team_name_k}
              onChange={(e) => setFormData({ ...formData, team_name_k: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E] font-kannada"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Display Precedence Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
            Team Banner Photo (Optional)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-xs text-[#5C403D] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-[#EFEBE4] file:bg-[#FCF9F8] file:text-xs file:font-semibold file:text-[#1C1B1B] hover:file:bg-[#F6F3F2]"
            />
            {preview && (
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#EFEBE4]">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-[#EFEBE4]">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#9B000E] hover:bg-[#7D000B] text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Creating..." : "Save Domain Team"}
          </button>
        </div>
      </form>

      {/* Edit Modal */}
      {editingTeam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#EFEBE4] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE4]">
              <h3 className="text-base font-bold text-[#1C1B1B]">Edit Domain Team</h3>
              <button onClick={() => setEditingTeam(null)} className="p-1 text-[#5C403D]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] mb-1">Name (English)</label>
                <input
                  type="text"
                  value={editFormData.team_name}
                  onChange={(e) => setEditFormData({ ...editFormData, team_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFEBE4] focus:ring-2 focus:ring-[#9B000E] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] mb-1">ಹೆಸರು (ಕನ್ನಡ)</label>
                <input
                  type="text"
                  value={editFormData.team_name_k}
                  onChange={(e) => setEditFormData({ ...editFormData, team_name_k: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFEBE4] focus:ring-2 focus:ring-[#9B000E] outline-none font-kannada"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] mb-1">Update Banner</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditPhotoChange}
                  className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#FCF9F8] text-[#5C403D]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#EFEBE4] text-[#5C403D]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveTeam(editingTeam)}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[#9B000E] text-white"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teams Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#1C1B1B] font-kannada">
          ಲಭ್ಯವಿರುವ ತಂಡಗಳು ({teams.length})
        </h2>

        {teams.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#EFEBE4] text-sm text-[#5C403D]">
            No domain teams created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#F6F3F2]">
                    {team.team_photo ? (
                      <img src={team.team_photo} alt={team.team_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full crimson-gradient flex items-center justify-center text-white/30">
                        <Users className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-bold text-[#1C1B1B] font-kannada">
                      {team.team_name_k || team.team_name}
                    </h3>
                    {team.team_name_k && team.team_name && (
                      <p className="text-xs text-[#5C403D]">
                        ({team.team_name})
                      </p>
                    )}

                    {/* Order */}
                    <div className="pt-2 flex items-center justify-between text-xs text-[#5C403D]">
                      {editingOrder === team._id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={orderValue}
                            onChange={(e) => setOrderValue(parseInt(e.target.value) || 0)}
                            className="w-14 px-1.5 py-1 border rounded text-xs"
                          />
                          <button
                            onClick={() => handleSaveOrder(team._id)}
                            className="px-2 py-1 bg-[#9B000E] text-white rounded text-[10px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingOrder(team._id);
                            setOrderValue(team.order || 0);
                          }}
                          className="flex items-center gap-1 text-[#916F6B] hover:text-[#1C1B1B]"
                        >
                          <ArrowUpDown className="w-3 h-3" />
                          <span>Order: {team.order || 0}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-2">
                  <button
                    onClick={() => router.push(`/admin/teamDetails/${team._id}`)}
                    className="w-full py-2 rounded-xl bg-[#FFF8E1] hover:bg-[#F5B000]/20 text-[#7C5800] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#F5B000]/30"
                  >
                    <span>Manage Members & Leads</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTeam(team)}
                      className="flex-1 py-1.5 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] hover:bg-[#F6F3F2] text-xs font-semibold text-[#1C1B1B] flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#9B000E]" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team._id)}
                      className="py-1.5 px-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}