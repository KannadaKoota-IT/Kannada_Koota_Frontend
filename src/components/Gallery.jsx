import React, { useState, useEffect } from "react";
import './styles/Gallery.css';

export default function AdminGallery() {
  const [mediaList, setMediaList] = useState([]);
  const [preview, setPreview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <div className="gallery-root min-h-screen mt-20 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="gallery-title text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Gallery
          </h1>
        </div>

        {/* Media Grid */}
        <div className="space-y-6">
          {mediaList.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-black rounded-full flex items-center justify-center border border-yellow-700/50">
                <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-2">No media uploaded yet</h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mediaList.map((item, index) => (
                <div
                  key={item._id}
                  className="gallery-card group bg-black/50 backdrop-blur-sm border border-yellow-700/50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                  onClick={() => { setPreview(item); setCurrentIndex(index); }}
                >
                  <div className="relative overflow-hidden">
                    {item.mediaType === "video" ? (
                      <div className="relative">
                        <video
                          src={`${item.mediaUrl}`}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-yellow-900/20 transition-colors duration-300">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-yellow-900/50 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
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
                    <h3 className="text-center text-xs font-light text-white group-hover:text-yellow-200 transition-colors duration-300 whitespace-normal break-words">
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
            className="fixed top-20 left-0 right-0 bottom-10 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={() => setPreview(null)}
          >
            {/* Previous Arrow */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setPreview(mediaList[currentIndex - 1]); setCurrentIndex(currentIndex - 1); }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-yellow-600/80 hover:bg-yellow-600 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 z-60"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next Arrow */}
            {currentIndex < mediaList.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setPreview(mediaList[currentIndex + 1]); setCurrentIndex(currentIndex + 1); }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-yellow-600/80 hover:bg-yellow-600 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 z-60"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            <div
              className="relative max-w-6xl w-full flex flex-col items-center animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-black/50 backdrop-blur-md rounded-2xl border border-yellow-700/50 overflow-hidden shadow-2xl">
                {preview.mediaType === "video" ? (
                  <video
                    controls
                    autoPlay
                    src={`${preview.mediaUrl}`}
                    className="max-h-[60vh] w-auto rounded-xl"
                  />
                ) : (
                  <img
                    src={`${preview.mediaUrl}`}
                    alt={preview.desc}
                    className="max-h-[60vh] w-auto rounded-xl"
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
                <p className="text-yellow-400 font-medium mb-2">{currentIndex + 1} of {mediaList.length}</p>
                <p className="text-white font-light">{preview.desc}</p>
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

        .gallery-root {
          background: #000000;
        }

        .gallery-root::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 0% 0%, rgba(255, 215, 0, 0.2) 0%, transparent 70%),
                      radial-gradient(circle at 100% 100%, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
          pointer-events: none;
        }

        .gallery-card {
          background: linear-gradient(135deg, #000000 0%, #000033 100%);
          border: 2px solid rgba(255, 215, 0, 0.4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(255, 215, 0, 0.2);
          position: relative;
          overflow: hidden;
        }

        .gallery-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: rotate(45deg);
          transition: all 0.6s;
          opacity: 0;
        }

        .gallery-card:hover::before {
          opacity: 1;
          animation: shimmer 1.5s ease-in-out;
        }

        .gallery-card:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 6px 20px rgba(255, 215, 0, 0.3);
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255, 215, 0, 0.6);
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
      `}</style>
    </div>
  );
}