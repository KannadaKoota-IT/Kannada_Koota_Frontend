import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  Shield, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Phone
} from "lucide-react";
import { getMediaUrl, handleImageError, DEFAULT_PERSON_IMAGE } from "../../utils/mediaUtils";

export default function TeamDetails({ teamId }) {
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
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamId}/members`);
      const data = await res.json();
      setMembers(data.members || []);
      setHeads(data.heads || []);
      setTeamName(data.team_name || "");
      setTeamPhoto(data.team_photo || "");
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
          message: editingId ? "Member updated successfully!" : "Member added successfully!",
        });
        clearForm();
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
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/teams/members/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus({ type: "success", message: "Member removed successfully" });
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
      name_k: mem.name_k || "",
      email: mem.email || "",
      phone: mem.phone || "",
      role: mem.role || "member",
    });
    setPhoto(null);
    setPreview(mem.image_url || null);
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  const clearForm = () => {
    setFormData({ name: "", name_k: "", email: "", phone: "", role: "member" });
    setPhoto(null);
    setPreview(null);
    setEditingId(null);
  };

  const renderPersonCard = (person, isLead = false) => (
    <div
      key={person._id}
      className="bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 flex flex-col justify-between"
    >
      <div>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F6F3F2]">
          <img
            src={getMediaUrl(person.image_url, DEFAULT_PERSON_IMAGE)}
            alt={person.name}
            onError={(e) => handleImageError(e, DEFAULT_PERSON_IMAGE)}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2.5 right-2.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 ${
                isLead
                  ? "bg-[#FFF8E1] text-[#7C5800] border border-[#F5B000]/40"
                  : "bg-white/95 text-[#5C403D] border border-[#EFEBE4]"
              }`}
            >
              {isLead ? <Shield className="w-3 h-3 text-[#9B000E]" /> : <UserCheck className="w-3 h-3" />}
              <span>{isLead ? "LEAD / HEAD" : "MEMBER"}</span>
            </span>
          </div>
        </div>

        <div className="p-4 space-y-1">
          <h4 className="text-base font-bold text-[#1C1B1B] font-kannada line-clamp-1">
            {person.name_k || person.name}
          </h4>
          {person.name_k && person.name && (
            <p className="text-xs text-[#5C403D] truncate">{person.name}</p>
          )}

          {person.email && (
            <p className="text-xs text-[#916F6B] flex items-center gap-1 pt-1 truncate">
              <Mail className="w-3 h-3 text-[#9B000E] shrink-0" />
              <span className="truncate">{person.email}</span>
            </p>
          )}
          {person.phone && (
            <p className="text-xs text-[#916F6B] flex items-center gap-1 truncate">
              <Phone className="w-3 h-3 text-[#916F6B] shrink-0" />
              <span>{person.phone}</span>
            </p>
          )}
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center gap-2">
        <button
          onClick={() => handleEdit(person)}
          className="flex-1 py-1.5 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] hover:bg-[#F6F3F2] text-xs font-semibold text-[#1C1B1B] flex items-center justify-center gap-1"
        >
          <Edit2 className="w-3.5 h-3.5 text-[#9B000E]" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => handleDelete(person._id)}
          className="py-1.5 px-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 flex items-center justify-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFEBE4]">
        <div>
          <Link
            href="/admin/teams"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#9B000E] mb-2 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Domains</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1B1B] font-kannada">
            {teamName} Domain Team
          </h1>
          <p className="text-xs sm:text-sm text-[#5C403D]">
            Manage domain coordinators, lead members, and core contributors.
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

      {/* Team Leads Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#EFEBE4]">
          <Shield className="w-5 h-5 text-[#9B000E]" />
          <h2 className="text-lg font-bold text-[#1C1B1B] font-kannada">
            ತಂಡದ ನಾಯಕರು / ಮುಖ್ಯಸ್ಥರು (Domain Leads) ({heads.length})
          </h2>
        </div>

        {heads.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-[#EFEBE4] text-xs text-[#5C403D]">
            No domain leads designated yet. Add one using the form below with role "Lead / Head".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {heads.map((h) => renderPersonCard(h, true))}
          </div>
        )}
      </div>

      {/* General Members Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#EFEBE4]">
          <Users className="w-5 h-5 text-[#5C403D]" />
          <h2 className="text-lg font-bold text-[#1C1B1B] font-kannada">
            ಸದಸ್ಯರು (Team Members) ({members.length})
          </h2>
        </div>

        {members.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-[#EFEBE4] text-xs text-[#5C403D]">
            No members registered yet in this domain.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {members.map((m) => renderPersonCard(m, false))}
          </div>
        )}
      </div>

      {/* Member Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-[#EFEBE4] p-6 sm:p-8 elevation-1 space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE4]">
          <h2 className="text-lg sm:text-xl font-bold text-[#1C1B1B] font-kannada flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#9B000E]" />
            <span>{editingId ? "ಸದಸ್ಯರ ವಿವರ ಬದಲಿಸಿ (Edit Member)" : "ಹೊಸ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ (Add New Member)"}</span>
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={clearForm}
              className="text-xs text-[#9B000E] font-semibold hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Full Name (English) *
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Gowda"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              ಹೆಸರು (ಕನ್ನಡದಲ್ಲಿ) *
            </label>
            <input
              type="text"
              placeholder="ಉದಾ: ರಮೇಶ್ ಗೌಡ"
              value={formData.name_k}
              onChange={(e) => setFormData({ ...formData, name_k: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E] font-kannada"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Role in Domain *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            >
              <option value="member">Team Member</option>
              <option value="head">Lead / Head (ಮುಖ್ಯಸ್ಥರು)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="student@pes.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Member Portrait Photo
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="text-xs text-[#5C403D] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border file:border-[#EFEBE4] file:bg-[#FCF9F8] file:text-xs file:font-semibold"
              />
              {preview && (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#EFEBE4] shrink-0">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-[#EFEBE4]">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#9B000E] hover:bg-[#7D000B] text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Saving..." : editingId ? "Save Member Details" : "Add Member to Domain"}
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="px-5 py-2.5 rounded-xl border border-[#EFEBE4] bg-white text-[#5C403D] hover:bg-[#F6F3F2] font-semibold text-sm transition-colors cursor-pointer"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}