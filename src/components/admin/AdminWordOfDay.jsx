import React, { useEffect, useState } from "react";
import { 
  BookMarked, 
  Calendar, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Eye,
  EyeOff
} from "lucide-react";

export default function AdminWordOfDay() {
  const [words, setWords] = useState([]);
  const [form, setForm] = useState({
    wordKannada: "",
    transliteration: "",
    partOfSpeech: "ನಾಮಪದ (Noun)",
    meaningEnglish: "",
    exampleSentenceKannada: "",
    exampleSentenceEnglish: "",
    date: new Date().toISOString().split("T")[0],
    isActive: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const API = `${API_BASE}/api/wordofday`;

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
      fetchWords();
    } catch (err) {
      localStorage.removeItem("adminToken");
      alert("Invalid token. Please log in again.");
      window.location.href = "/admin-login";
    }
  }, []);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setWords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch words:", err);
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
      wordKannada: form.wordKannada.trim(),
      transliteration: form.transliteration.trim(),
      partOfSpeech: form.partOfSpeech.trim(),
      meaningEnglish: form.meaningEnglish.trim(),
      exampleSentenceKannada: form.exampleSentenceKannada.trim(),
      exampleSentenceEnglish: form.exampleSentenceEnglish.trim(),
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
        fetchWords();
        clearForm();
        setStatus({
          type: "success",
          message: editingId
            ? "ಪದ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ! (Word updated successfully)"
            : "ಹೊಸ ಪದ ಸೇರಿಸಲಾಗಿದೆ! (Word created successfully)",
        });
        setTimeout(() => setStatus(""), 4000);
      } else {
        const err = await res.json();
        setStatus({ type: "error", message: err.error || "Failed to save word" });
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
      wordKannada: item.wordKannada,
      transliteration: item.transliteration,
      partOfSpeech: item.partOfSpeech,
      meaningEnglish: item.meaningEnglish,
      exampleSentenceKannada: item.exampleSentenceKannada || "",
      exampleSentenceEnglish: item.exampleSentenceEnglish || "",
      date: item.date ? item.date.split("T")[0] : "",
      isActive: item.isActive ?? true,
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Word of the Day?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchWords();
        setStatus({ type: "success", message: "Word deleted successfully!" });
        setTimeout(() => setStatus(""), 4000);
      } else {
        setStatus({ type: "error", message: "Failed to delete word" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server error occurred" });
    }
  };

  const clearForm = () => {
    setForm({
      wordKannada: "",
      transliteration: "",
      partOfSpeech: "ನಾಮಪದ (Noun)",
      meaningEnglish: "",
      exampleSentenceKannada: "",
      exampleSentenceEnglish: "",
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
            ದಿನದ ಕನ್ನಡ ಪದ ನಿರ್ವಹಣೆ
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1B1B] font-kannada">
            Word of the Day Console
          </h1>
          <p className="text-xs sm:text-sm text-[#5C403D]">
            Curate daily Kannada vocabulary, meanings, pronunciations, and contextual usage examples for learners.
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
            {editingId ? "ಪದ ಸಂಪಾದಿಸಿ (Edit Word)" : "ಹೊಸ ಪದ ಸೇರಿಸಿ (Add New Word)"}
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
          {/* Word Kannada */}
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              ಕನ್ನಡ ಪದ (Word Kannada) *
            </label>
            <input
              type="text"
              name="wordKannada"
              placeholder="e.g. ಆತ್ಮೀಯತೆ"
              value={form.wordKannada}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] font-kannada text-lg"
            />
          </div>

          {/* Transliteration */}
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Transliteration / Pronunciation *
            </label>
            <input
              type="text"
              name="transliteration"
              placeholder="e.g. Aatmeeyate"
              value={form.transliteration}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] text-sm"
            />
          </div>

          {/* Part of Speech */}
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              ವ್ಯಾಕರಣ / Part of Speech *
            </label>
            <input
              type="text"
              name="partOfSpeech"
              placeholder="e.g. ನಾಮಪದ (Noun)"
              value={form.partOfSpeech}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] text-sm"
            />
          </div>
        </div>

        {/* English Meaning */}
        <div>
          <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
            English Definition / Meaning *
          </label>
          <textarea
            name="meaningEnglish"
            rows="2"
            placeholder="e.g. Warm, hospitable kinship; genuine affection from the core of one's soul."
            value={form.meaningEnglish}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] text-sm leading-relaxed"
          />
        </div>

        {/* Contextual Usage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              ವಾಕ್ಯ ಪ್ರಯೋಗ (Kannada Example Sentence)
            </label>
            <input
              type="text"
              name="exampleSentenceKannada"
              placeholder="e.g. ನಮ್ಮ ಕನ್ನಡ ಕೂಟಕ್ಕೆ ಬರುವ ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ಆತ್ಮೀಯತೆಯ ಸ್ವಾಗತ."
              value={form.exampleSentenceKannada}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] font-kannada text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Example Sentence (English Translation)
            </label>
            <input
              type="text"
              name="exampleSentenceEnglish"
              placeholder="e.g. A warm, affectionate welcome awaits every student who walks into Kannada Koota."
              value={form.exampleSentenceEnglish}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#9B000E]/20 focus:border-[#9B000E] text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <span>{editingId ? "Update Word" : "Save Word"}</span>
          </button>
        </div>
      </form>

      {/* Listing Section */}
      <div className="bg-white rounded-3xl border border-[#EFEBE4] p-6 sm:p-8 elevation-1 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE4]">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1C1B1B] font-kannada">
              ದಾಖಲಾಗಿರುವ ಪದಗಳು ({words.length})
            </h2>
            <p className="text-xs text-[#5C403D]">
              All registered Kannada words of the day sorted by scheduled date.
            </p>
          </div>
        </div>

        {loading && words.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#5C403D]">
            Loading words...
          </div>
        ) : words.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#5C403D]">
            No words found. Add one above!
          </div>
        ) : (
          <div className="divide-y divide-[#EFEBE4]">
            {words.map((item) => (
              <div
                key={item._id}
                className="py-5 flex flex-col md:flex-row md:items-start justify-between gap-4 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xl font-bold text-[#1C1B1B] font-kannada">
                      {item.wordKannada}
                    </span>
                    <span className="text-sm font-semibold text-[#9B000E]">
                      [{item.transliteration}]
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#7C5800] border border-[#F5B000]/40 font-semibold">
                      {item.partOfSpeech}
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

                  <p className="text-xs sm:text-sm text-[#1C1B1B] leading-relaxed max-w-2xl">
                    {item.meaningEnglish}
                  </p>

                  {item.exampleSentenceKannada && (
                    <div className="bg-[#FCF9F8] p-3 rounded-lg border border-[#EFEBE4] max-w-2xl text-xs space-y-1">
                      <p className="font-kannada text-[#1C1B1B]">
                        "{item.exampleSentenceKannada}"
                      </p>
                      {item.exampleSentenceEnglish && (
                        <p className="italic text-[#5C403D]">
                          {item.exampleSentenceEnglish}
                        </p>
                      )}
                    </div>
                  )}

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
