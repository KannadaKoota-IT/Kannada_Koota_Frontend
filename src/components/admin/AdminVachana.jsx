import React, { useEffect, useState } from "react";
import { 
  Sparkles, 
  Calendar, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Eye,
  EyeOff
} from "lucide-react";

export default function AdminVachana() {
  const [vachanas, setVachanas] = useState([]);
  const [form, setForm] = useState({
    titleKannada: "",
    titleEnglish: "",
    authorKannada: "",
    authorEnglish: "",
    originalVerses: "",
    englishTranslation: "",
    date: new Date().toISOString().split("T")[0],
    isActive: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const API = `${API_BASE}/api/vachanas`;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const t = localStorage.getItem("adminToken");
    if (!t) {
      alert("Please log in first.");
      window.location.href = "/admin-login";
      return;
    }

    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminToken");
        alert("Session expired. Please log in again.");
        window.location.href = "/admin-login";
        return;
      }
      setToken(t);
      fetchVachanas();
    } catch (err) {
      localStorage.removeItem("adminToken");
      alert("Invalid token. Please log in again.");
      window.location.href = "/admin-login";
    }
  }, []);

  const fetchVachanas = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setVachanas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch vachanas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      titleKannada: form.titleKannada.trim(),
      titleEnglish: form.titleEnglish.trim(),
      authorKannada: form.authorKannada.trim(),
      authorEnglish: form.authorEnglish.trim(),
      originalVerses: form.originalVerses.split("\n").filter((l) => l.trim()),
      englishTranslation: form.englishTranslation.split("\n").filter((l) => l.trim()),
      date: form.date,
      isActive: form.isActive,
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/${editingId}` : API;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchVachanas();
        clearForm();
        setStatus({
          type: "success",
          message: editingId
            ? "ವಚನ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ! (Vachana updated successfully)"
            : "ಹೊಸ ವಚನ ಸೇರಿಸಲಾಗಿದೆ! (Vachana created successfully)",
        });
        setTimeout(() => setStatus(""), 4000);
      } else {
        const err = await res.json();
        setStatus({ type: "error", message: err.error || "Failed to save vachana" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      titleKannada: item.titleKannada,
      titleEnglish: item.titleEnglish,
      authorKannada: item.authorKannada,
      authorEnglish: item.authorEnglish,
      originalVerses: Array.isArray(item.originalVerses)
        ? item.originalVerses.join("\n")
        : item.originalVerses || "",
      englishTranslation: Array.isArray(item.englishTranslation)
        ? item.englishTranslation.join("\n")
        : item.englishTranslation || "",
      date: item.date ? item.date.split("T")[0] : "",
      isActive: item.isActive ?? true,
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Vachana?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchVachanas();
        setStatus({ type: "success", message: "Vachana deleted successfully!" });
        setTimeout(() => setStatus(""), 4000);
      } else {
        setStatus({ type: "error", message: "Failed to delete vachana" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server error occurred" });
    }
  };

  const clearForm = () => {
    setForm({
      titleKannada: "",
      titleEnglish: "",
      authorKannada: "",
      authorEnglish: "",
      originalVerses: "",
      englishTranslation: "",
      date: new Date().toISOString().split("T")[0],
      isActive: true,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFEBE4]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#9B000E]">
            ದಿನದ ವಚನ ಮತ್ತು ಸುಭಾಷಿತ ನಿರ್ವಹಣೆ
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1B1B] font-kannada">
            Daily Vachana & Wisdom Console
          </h1>
          <p className="text-xs sm:text-sm text-[#5C403D]">
            Manage daily spiritual wisdom, Vachana literature, and poetic reflections featured on the homepage.
          </p>
        </div>
      </div>

      {/* Status Alert */}
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

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-[#EFEBE4] p-6 sm:p-8 elevation-1 space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE4]">
          <h2 className="text-lg sm:text-xl font-bold text-[#1C1B1B] font-kannada">
            {editingId ? "ವಚನ ಸಂಪಾದಿಸಿ (Edit Vachana)" : "ಹೊಸ ವಚನ ಸೇರಿಸಿ (Add New Vachana)"}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title Kannada */}
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              ಶೀರ್ಷಿಕೆ / ವಚನದ ಸಾಲು (Kannada Title) *
            </label>
            <input
              type="text"
              name="titleKannada"
              placeholder="e.g. ಕಳಬೇಡ, ಕೊಲಬೇಡ"
              value={form.titleKannada}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] font-kannada text-sm"
            />
          </div>

          {/* Title English */}
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Title (English Meaning) *
            </label>
            <input
              type="text"
              name="titleEnglish"
              placeholder="e.g. Do Not Steal, Do Not Kill"
              value={form.titleEnglish}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] text-sm"
            />
          </div>

          {/* Author Kannada */}
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              ವಚನಕಾರರು / ಕವಿ (Author Kannada) *
            </label>
            <input
              type="text"
              name="authorKannada"
              placeholder="e.g. ಬಸವಣ್ಣ (Basavanna)"
              value={form.authorKannada}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] font-kannada text-sm"
            />
          </div>

          {/* Author English */}
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Author (English Description) *
            </label>
            <input
              type="text"
              name="authorEnglish"
              placeholder="e.g. Basavanna (12th Century Mystic & Social Reformer)"
              value={form.authorEnglish}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] text-sm"
            />
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              ನಿಗದಿತ ದಿನಾಂಕ (Display Date) *
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] text-sm"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="w-5 h-5 accent-[#9B000E] rounded cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-[#1C1B1B] cursor-pointer">
              ಸಕ್ರಿಯಗೊಳಿಸಿ (Active - Visible on Homepage)
            </label>
          </div>
        </div>

        {/* Verses Kannada */}
        <div>
          <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
            ಮೂಲ ವಚನದ ಸಾಲುಗಳು (Original Verses in Kannada) *
            <span className="text-[11px] font-normal text-[#5C403D] normal-case ml-2">
              (Type each line on a new line)
            </span>
          </label>
          <textarea
            name="originalVerses"
            rows="5"
            placeholder="ಕಳಬೇಡ, ಕೊಲಬೇಡ, ಹುಸಿಯ ನುಡಿಯಲು ಬೇಡ,&#10;ಮುನಿಯಬೇಡ, ಅನ್ಯರಿಗೆ ಅಸಹ್ಯಪಡಬೇಡ,&#10;ತನ್ನ ಬಣ್ಣಿಸಬೇಡ, ಇದಿರ ಹಳಿಯಲು ಬೇಡ."
            value={form.originalVerses}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] font-kannada text-base leading-relaxed"
          />
        </div>

        {/* English Translation */}
        <div>
          <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
            English Translation
            <span className="text-[11px] font-normal text-[#5C403D] normal-case ml-2">
              (One line per verse, matching above)
            </span>
          </label>
          <textarea
            name="englishTranslation"
            rows="5"
            placeholder="Do not steal, do not kill, do not utter lies,&#10;Do not lose temper, do not harbor revulsion towards others,&#10;Do not boast of yourself, do not demean those before you."
            value={form.englishTranslation}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] text-sm leading-relaxed"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EFEBE4]">
          {editingId && (
            <button
              type="button"
              onClick={clearForm}
              className="px-6 py-2.5 rounded-xl border border-[#EFEBE4] text-xs font-semibold text-[#5C403D] hover:bg-[#F6F3F2] cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#9B000E] text-white text-xs font-semibold hover:bg-[#7D000B] transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{editingId ? "Update Vachana" : "Save Vachana"}</span>
          </button>
        </div>
      </form>

      {/* Listing Section */}
      <div className="bg-white rounded-3xl border border-[#EFEBE4] p-6 sm:p-8 elevation-1 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE4]">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1C1B1B] font-kannada">
              ದಾಖಲಾಗಿರುವ ವಚನಗಳು ({vachanas.length})
            </h2>
            <p className="text-xs text-[#5C403D]">
              All registered Daily Vachanas sorted by scheduled date.
            </p>
          </div>
        </div>

        {loading && vachanas.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#5C403D]">
            Loading vachanas...
          </div>
        ) : vachanas.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#5C403D]">
            No vachanas found. Add one above!
          </div>
        ) : (
          <div className="divide-y divide-[#EFEBE4]">
            {vachanas.map((item) => (
              <div
                key={item._id}
                className="py-5 flex flex-col md:flex-row md:items-start justify-between gap-4 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-[#1C1B1B] font-kannada">
                      {item.titleKannada}
                    </span>
                    <span className="text-xs text-[#5C403D]">
                      ({item.titleEnglish})
                    </span>
                    {item.isActive ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 font-semibold flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-[#9B000E]">
                    {item.authorKannada} &bull; <span className="text-[#5C403D] font-normal">{item.authorEnglish}</span>
                  </div>

                  <div className="bg-[#FCF9F8] p-3 rounded-lg border border-[#EFEBE4] max-w-2xl">
                    <div className="font-kannada text-xs sm:text-sm text-[#1C1B1B] space-y-1">
                      {item.originalVerses?.map((v, i) => (
                        <p key={i}>{v}</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#5C403D]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#7C5800]" />
                      Date: {item.date ? new Date(item.date).toLocaleDateString("en-IN") : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-start">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-lg text-[#5C403D] hover:bg-[#F6F3F2] hover:text-[#1C1B1B] transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
