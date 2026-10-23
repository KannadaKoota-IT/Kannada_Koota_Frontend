import React, { useState, useEffect } from "react";
import { 
  Camera, 
  Video, 
  UploadCloud, 
  Trash2, 
  Edit2, 
  ArrowUpDown, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Play
} from "lucide-react";
import { getMediaUrl, handleImageError, DEFAULT_GALLERY_IMAGE } from "../../utils/mediaUtils";

export default function AdminGallery() {
  const [mediaList, setMediaList] = useState([]);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderValue, setOrderValue] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchMedia = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/gallery`);
      const data = await res.json();
      setMediaList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setStatus("Server error while fetching media.");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !desc) {
      setStatus("Please provide both description and media file.");
      return;
    }

    const formData = new FormData();
    formData.append("desc", desc);
    formData.append("link", link);
    formData.append("media", file);

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/gallery`, {
        method: "POST",
        headers: {
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setStatus("Media uploaded successfully!");
        setDesc("");
        setLink("");
        setFile(null);
        fetchMedia();
        setTimeout(() => setStatus(""), 4000);
      } else {
        setStatus("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error during upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
      });

      const data = await res.json();
      if (data.success) {
        setStatus("Media deleted.");
        fetchMedia();
        setTimeout(() => setStatus(""), 4000);
      } else {
        setStatus("Failed to delete.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error during delete.");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditDesc(item.desc);
    setEditLink(item.link || "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editDesc.trim()) {
      setStatus("Description cannot be empty.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/gallery/${editingItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({ desc: editDesc, link: editLink }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("Media updated successfully!");
        setEditingItem(null);
        setEditDesc("");
        setEditLink("");
        fetchMedia();
        setTimeout(() => setStatus(""), 4000);
      } else {
        setStatus("Update failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error during update.");
    }
  };

  const handleSaveOrder = async (itemId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/gallery/${itemId}/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({ order: orderValue }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("Gallery display order updated!");
        setEditingOrder(null);
        fetchMedia();
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("Failed to update order.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error during order update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFEBE4]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#9B000E]">
            ಗ್ಯಾಲರಿ ನಿರ್ವಹಣೆ
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1B1B] font-kannada">
            Gallery Archives Console
          </h1>
          <p className="text-xs sm:text-sm text-[#5C403D]">
            Upload photographs, event recordings, and set display precedence order.
          </p>
        </div>
      </div>

      {/* Status Notice */}
      {status && (
        <div className="p-4 rounded-xl text-sm font-medium flex items-center gap-2 border bg-white border-[#EFEBE4] text-[#1C1B1B] elevation-1">
          <CheckCircle2 className="w-5 h-5 text-[#9B000E]" />
          <span>{status}</span>
        </div>
      )}

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-white rounded-3xl border border-[#EFEBE4] p-6 sm:p-8 elevation-1 space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE4]">
          <h2 className="text-lg sm:text-xl font-bold text-[#1C1B1B] font-kannada flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#9B000E]" />
            <span>ಹೊಸ ಚಿತ್ರ ಅಥವಾ ವೀಡಿಯೊ ಸೇರಿಸಿ (Upload Media)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Caption / Description *
            </label>
            <input
              type="text"
              placeholder="e.g. Drama Team Performance at Rajyotsava 2025"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
              Reference / Drive Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://youtu.be/... or Google Drive link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
            Select Photo or Video File *
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="text-xs text-[#5C403D] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-[#EFEBE4] file:bg-[#FCF9F8] file:text-xs file:font-semibold file:text-[#1C1B1B] hover:file:bg-[#F6F3F2]"
          />
        </div>

        <div className="pt-4 border-t border-[#EFEBE4]">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#9B000E] hover:bg-[#7D000B] text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Uploading to Cloud..." : "Upload Media to Archives"}
          </button>
        </div>
      </form>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#EFEBE4] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE4]">
              <h3 className="text-base font-bold text-[#1C1B1B]">Edit Caption & Link</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded hover:bg-[#F6F3F2] text-[#5C403D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] mb-1">Description</label>
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFEBE4] focus:ring-2 focus:ring-[#9B000E] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] mb-1">Link</label>
                <input
                  type="url"
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFEBE4] focus:ring-2 focus:ring-[#9B000E] outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#EFEBE4] text-[#5C403D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[#9B000E] text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Collection Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#1C1B1B] font-kannada">
          ಸಂಗ್ರಹಿಸಿರುವ ಮಾಧ್ಯಮಗಳು ({mediaList.length})
        </h2>

        {mediaList.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#EFEBE4] text-sm text-[#5C403D]">
            No media uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {mediaList.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-[#F6F3F2]">
                    {item.mediaType === "video" ? (
                      <video src={getMediaUrl(item.mediaUrl)} className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={getMediaUrl(item.mediaUrl, DEFAULT_GALLERY_IMAGE)}
                        alt={item.desc}
                        onError={(e) => handleImageError(e, DEFAULT_GALLERY_IMAGE)}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white uppercase">
                      {item.mediaType}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs text-[#1C1B1B] font-kannada line-clamp-2">
                      {item.desc}
                    </p>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9B000E]"
                      >
                        <span>Open Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {/* Order Precedence */}
                    <div className="pt-2 border-t border-[#EFEBE4] flex items-center justify-between text-xs text-[#5C403D]">
                      {editingOrder === item._id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={orderValue}
                            onChange={(e) => setOrderValue(parseInt(e.target.value) || 0)}
                            className="w-14 px-1.5 py-1 border rounded text-xs"
                          />
                          <button
                            onClick={() => handleSaveOrder(item._id)}
                            className="px-2 py-1 bg-[#9B000E] text-white rounded text-[10px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingOrder(item._id);
                            setOrderValue(item.order || 0);
                          }}
                          className="flex items-center gap-1 text-[#916F6B] hover:text-[#1C1B1B]"
                        >
                          <ArrowUpDown className="w-3 h-3" />
                          <span>Order: {item.order || 0}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 py-1.5 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] hover:bg-[#F6F3F2] text-xs font-semibold text-[#1C1B1B] flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#9B000E]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="py-1.5 px-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
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