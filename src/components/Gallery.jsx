import React, { useState, useEffect } from "react";

export default function AdminGallery() {
  const [mediaList, setMediaList] = useState([]);
  const [preview, setPreview] = useState(null);

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


  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
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
              Gallery
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Media Grid */}
        <div className="space-y-6">
          {mediaList.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No media uploaded yet</h3>
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
                                <path d="M8 5v14l11-7z" />
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {preview && (
          <div
            className="fixed mt-20 inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
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