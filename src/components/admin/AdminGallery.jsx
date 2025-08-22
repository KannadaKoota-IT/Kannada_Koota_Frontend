import React, { useState, useEffect } from "react";

export default function AdminGallery() {
  const [mediaList, setMediaList] = useState([]);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const fetchMedia = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/gallery`);
      const data = await res.json();
      setMediaList(data);
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error while fetching media.");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !desc) {
      setStatus("⚠️ Please provide both description and media file.");
      return;
    }

    const formData = new FormData();
    formData.append("desc", desc);
    formData.append("media", file);

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/gallery`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setStatus("✅ Media uploaded successfully!");
        setDesc("");
        setFile(null);
        fetchMedia();
      } else {
        setStatus("❌ Upload failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error during upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setStatus("🗑️ Media deleted.");
        fetchMedia();
      } else {
        setStatus("❌ Failed to delete.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error during delete.");
    }
  };

  const handleCancelForm = () => {
    setDesc("");
    setFile(null);
    setStatus("⚪ Form cleared.");
  };

  const getStatusColor = () => {
    if (status.includes("✅")) return "text-emerald-400 bg-emerald-900/30 border-emerald-500/50";
    if (status.includes("❌")) return "text-red-400 bg-red-900/30 border-red-500/50";
    if (status.includes("⚠️")) return "text-amber-400 bg-amber-900/30 border-amber-500/50";
    if (status.includes("🗑️")) return "text-orange-400 bg-orange-900/30 border-orange-500/50";
    return "text-blue-400 bg-blue-900/30 border-blue-500/50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Header with backdrop blur effect */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Gallery Management
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Alert */}
        {status && (
          <div className={`mb-8 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${getStatusColor()}`}>
            <p className="text-center font-medium">{status}</p>
          </div>
        )}

        {/* Upload Form */}
        <div className="mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-semibold text-slate-200">Upload New Media</h2>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Description</label>
                <input
                  type="text"
                  placeholder="Enter media description..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Media File</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform focus:outline-none focus:ring-2 ${
                    loading
                      ? "bg-gray-500 cursor-not-allowed text-gray-300"
                      : "bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white hover:scale-[1.02] focus:ring-blue-500 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    "Upload Media"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Media Grid */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-semibold text-slate-200">Media Collection</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent"></div>
            <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
              {mediaList.length} items
            </span>
          </div>

          {mediaList.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No media uploaded yet</h3>
              <p className="text-slate-500">Upload your first image or video to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mediaList.map((item) => (
                <div
                  key={item._id}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                  onClick={() => setPreview(item)}
                >
                  <div className="relative overflow-hidden">
                    {item.mediaType === "video" ? (
                      <div className="relative">
                        <video
                          src={`${item.mediaUrl}`}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={`${item.mediaUrl}`}
                          alt={item.desc}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-4">
                    <h3 className="font-semibold text-slate-200 text-center line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
                      {item.desc}
                    </h3>
                    
                    <div className="flex justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                        className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {preview && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={() => setPreview(null)}
          >
            <div
              className="relative max-w-6xl w-full flex flex-col items-center animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
                {preview.mediaType === "video" ? (
                  <video
                    controls
                    autoPlay
                    src={`${preview.mediaUrl}`}
                    className="max-h-[80vh] w-auto rounded-xl"
                  />
                ) : (
                  <img
                    src={`${preview.mediaUrl}`}
                    alt={preview.desc}
                    className="max-h-[80vh] w-auto rounded-xl"
                  />
                )}
                
                <button
                  onClick={() => setPreview(null)}
                  className="absolute top-4 right-4 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm text-white p-2 rounded-xl transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-slate-300 font-medium">{preview.desc}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}