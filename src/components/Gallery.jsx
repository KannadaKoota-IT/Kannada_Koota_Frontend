import React, { useState, useEffect } from "react";

export default function Gallery() {
  const [mediaList, setMediaList] = useState([]);
  const [preview, setPreview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false); // NEW STATE

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchMedia = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/gallery`);
      const data = await res.json();
      setMediaList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const filteredMedia = mediaList.filter((item) => {
    if (filter === "all") return true;
    return item.mediaType === filter;
  });

  const displayedMedia = showAll ? filteredMedia : filteredMedia.slice(0, 4); // LIMIT TO 4

  const handleKeyPress = (e) => {
    if (!preview) return;
    if (e.key === "ArrowLeft" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPreview(mediaList[currentIndex - 1]);
    } else if (e.key === "ArrowRight" && currentIndex < mediaList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPreview(mediaList[currentIndex + 1]);
    } else if (e.key === "Escape") {
      setPreview(null);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [preview, currentIndex]);

  return (
    <div className="heritage-gallery min-h-screen mt-20 relative overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="mandala-1"></div>
        <div className="mandala-2"></div>
        <div className="mandala-3"></div>
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
        <div className="glow-orb-3"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight heritage-title">
              ನಮ್ಮ ಸಂಸ್ಕೃತಿಯ ಬಿಂಬ
            </h1>
            <div className="h-1 w-32 mx-auto mb-6 heritage-divider"></div>
            <p className="text-lg text-amber-200/80 max-w-2xl mx-auto">
              {/* Celebrating Karnataka's Rich Cultural Legacy */}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center items-center gap-2 heritage-filter p-2 max-w-md mx-auto">
            <button
              onClick={() => {
                setFilter("all");
                setShowAll(false); // RESET VIEW MORE/LESS ON FILTER CHANGE
              }}
              className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${filter === "all"
                  ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-lg shadow-yellow-500/50"
                  : "text-yellow-400 hover:bg-yellow-500/10"
                }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilter("image");
                setShowAll(false);
              }}
              className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${filter === "image"
                  ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-lg shadow-yellow-500/50"
                  : "text-yellow-400 hover:bg-yellow-500/10"
                }`}
            >
              Photos
            </button>
            <button
              onClick={() => {
                setFilter("video");
                setShowAll(false);
              }}
              className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${filter === "video"
                  ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-lg shadow-yellow-500/50"
                  : "text-yellow-400 hover:bg-yellow-500/10"
                }`}
            >
              Videos
            </button>
          </div>
        </div>

        {/* Media Grid */}
        {displayedMedia.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-yellow-500/10 rounded-full flex items-center justify-center border-2 border-yellow-500/30">
              <svg
                className="w-12 h-12 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
              No media found
            </h2>
            <p className="text-amber-200/60">
              {filter === "all"
                ? "No media has been uploaded yet"
                : `No ${filter}s available`}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedMedia.map((item, index) => (
                <div
                  key={item._id}
                  className="heritage-card group relative rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => {
                    setPreview(item);
                    setCurrentIndex(
                      mediaList.findIndex((m) => m._id === item._id)
                    );
                  }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    {item.mediaType === "video" ? (
                      <>
                        <video
                          src={item.mediaUrl}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          muted
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-black/80 transition-all duration-300">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="play-button bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full p-4 group-hover:scale-110 transition-transform duration-300 shadow-2xl shadow-yellow-500/50">
                              <svg
                                className="w-8 h-8 text-black"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-red-400/30">
                          VIDEO
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="heritage-card group relative rounded-2xl overflow-hidden cursor-pointer">
                          <img
                            src={item.mediaUrl}
                            alt={item.desc}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                        </div>
                      </>
                    )}

                    {/* Corner Decorations */}
                    <div className="corner-decoration top-left"></div>
                    <div className="corner-decoration top-right"></div>
                    <div className="corner-decoration bottom-left"></div>
                    <div className="corner-decoration bottom-right"></div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent">
                    <p className="text-sm text-amber-100 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                      {item.desc}
                    </p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none heritage-glow"></div>
                </div>
              ))}
            </div>

            {/* View More / View Less Buttons */}
            {filteredMedia.length > 4 && (
              <div className="text-center mt-8">
                {showAll ? (
                  <button
                    onClick={() => setShowAll(false)}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-yellow-300 font-semibold shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all"
                  >
                    View Less
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAll(true)}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-semibold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all"
                  >
                    View More
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Lightbox Modal */}
        {preview && (
          <div
            className="fixed inset-0 bg-black/98 backdrop-blur-lg flex items-center justify-center z-50 p-4"
            onClick={() => setPreview(null)}
          >
            {/* Navigation Arrows */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(currentIndex - 1);
                  setPreview(mediaList[currentIndex - 1]);
                }}
                className="modal-nav-btn absolute left-6 top-1/2 transform -translate-y-1/2 z-50"
                aria-label="Previous"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {currentIndex < mediaList.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(currentIndex + 1);
                  setPreview(mediaList[currentIndex + 1]);
                }}
                className="modal-nav-btn absolute right-6 top-1/2 transform -translate-y-1/2 z-50"
                aria-label="Next"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={() => setPreview(null)}
              className="absolute top-6 right-6 bg-red-600/80 hover:bg-red-600 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 z-50 border border-red-400/30 shadow-lg"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Media Container */}
            <div
              className="relative max-w-7xl w-full flex flex-col items-center pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-h-[calc(100dvh-6rem)] overflow-y-auto">
              <div className="modal-media-container relative rounded-xl overflow-hidden shadow-2xl max-h-[80vh] flex items-center justify-center">
                {/* Close button over media */}
                <button
                  onClick={() => setPreview(null)}
                  className="absolute top-3 right-3 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-200 shadow-lg z-50"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {preview.mediaType === "video" ? (
                  <video
                    controls
                    autoPlay
                    src={preview.mediaUrl}
                    className="max-h-[80vh] max-w-full w-auto h-auto"
                  />
                ) : (
                  <img
                    src={preview.mediaUrl}
                    alt={preview.desc}
                    className="max-h-[80vh] max-w-full w-auto h-auto"
                  />
                )}
              </div>

              {/* Info Bar */}
              <div className="modal-info-bar mt-6 px-6 py-4 max-w-2xl mx-auto text-center">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <p className="text-yellow-400/80 text-sm font-medium">
                    {currentIndex + 1} / {mediaList.length}
                  </p>
                  <div className="flex gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${preview.mediaType === "video"
                          ? "bg-red-500/20 text-red-300 border border-red-400/30"
                          : "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                        }`}
                    >
                      {preview.mediaType.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-amber-100 text-center">{preview.desc}</p>
              </div>

              {/* Keyboard Hint */}
              <div className="mt-4 text-yellow-500/50 text-sm text-center">
                Use arrow keys to navigate • ESC to close
              </div>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* --- Styles remain unchanged --- */}
      <style>{`
        .heritage-gallery {
        margin:0;
          background: #000000;
          position: relative;
        }

        /* Animated Mandala Patterns */
        .mandala-1,
        .mandala-2,
        .mandala-3 {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(234, 179, 8, 0.1);
          animation: rotate 60s linear infinite;
        }

        .mandala-1 {
          width: 600px;
          height: 600px;
          top: -200px;
          right: -200px;
          border-width: 3px;
          box-shadow: 0 0 100px rgba(234, 179, 8, 0.1),
            inset 0 0 100px rgba(234, 179, 8, 0.05);
        }

        .mandala-2 {
          width: 500px;
          height: 500px;
          bottom: -150px;
          left: -150px;
          animation-direction: reverse;
          animation-duration: 80s;
          border-width: 2px;
          box-shadow: 0 0 80px rgba(234, 179, 8, 0.08),
            inset 0 0 80px rgba(234, 179, 8, 0.04);
        }

        .mandala-3 {
          width: 400px;
          height: 400px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-duration: 100s;
          border-width: 1px;
          opacity: 0.5;
        }

        /* Glowing Orbs */
        .glow-orb-1,
        .glow-orb-2,
        .glow-orb-3 {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: float 20s ease-in-out infinite;
        }

        .glow-orb-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          right: 10%;
          background: radial-gradient(
            circle,
            rgba(234, 179, 8, 0.15) 0%,
            transparent 70%
          );
          animation-delay: 0s;
        }

        .glow-orb-2 {
          width: 400px;
          height: 400px;
          bottom: 20%;
          left: 5%;
          background: radial-gradient(
            circle,
            rgba(251, 191, 36, 0.12) 0%,
            transparent 70%
          );
          animation-delay: 7s;
          animation-duration: 25s;
        }

        .glow-orb-3 {
          width: 350px;
          height: 350px;
          top: 60%;
          right: 20%;
          background: radial-gradient(
            circle,
            rgba(245, 158, 11, 0.1) 0%,
            transparent 70%
          );
          animation-delay: 14s;
          animation-duration: 30s;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(30px, -30px);
          }
          50% {
            transform: translate(-20px, 20px);
          }
          75% {
            transform: translate(20px, 30px);
          }
        }

        /* Heritage Title */
        .heritage-title {
          background: linear-gradient(
            135deg,
            #fbbf24 0%,
            #f59e0b 50%,
            #eab308 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.3);
          }
        }

        .heritage-divider {
          background: linear-gradient(
            90deg,
            transparent,
            #fbbf24,
            #f59e0b,
            #fbbf24,
            transparent
          );
          animation: divider-glow 2s ease-in-out infinite;
        }

        @keyframes divider-glow {
          0%,
          100% {
            opacity: 0.6;
            box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.8);
          }
        }

        /* Filter Tabs */
        .heritage-filter {
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(234, 179, 8, 0.3);
          box-shadow: 0 8px 32px rgba(234, 179, 8, 0.1);
        }

        /* Heritage Cards */
        .heritage-card {
          background: linear-gradient(
            135deg,
            rgba(20, 20, 20, 0.95) 0%,
            rgba(30, 20, 0, 0.95) 100%
          );
          border: 2px solid rgba(234, 179, 8, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8),
            0 4px 16px rgba(234, 179, 8, 0.2);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .heritage-card:hover {
          border-color: rgba(234, 179, 8, 0.6);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.9),
            0 8px 24px rgba(234, 179, 8, 0.4);
          transform: translateY(-8px);
        }

        .heritage-glow {
          background: radial-gradient(
            circle at center,
            rgba(234, 179, 8, 0.1) 0%,
            transparent 70%
          );
        }

        /* Corner Decorations */
        .corner-decoration {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(234, 179, 8, 0.5);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .heritage-card:hover .corner-decoration {
          opacity: 1;
        }

        .corner-decoration.top-left {
          top: 8px;
          left: 8px;
          border-right: none;
          border-bottom: none;
        }

        .corner-decoration.top-right {
          top: 8px;
          right: 8px;
          border-left: none;
          border-bottom: none;
        }

        .corner-decoration.bottom-left {
          bottom: 8px;
          left: 8px;
          border-right: none;
          border-top: none;
        }

        .corner-decoration.bottom-right {
          bottom: 8px;
          right: 8px;
          border-left: none;
          border-top: none;
        }

        /* Play Button Pulse */
        .play-button {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        /* Modal Styles */
        .modal-nav-btn {
          background: linear-gradient(
            135deg,
            rgba(234, 179, 8, 0.2) 0%,
            rgba(251, 191, 36, 0.2) 100%
          );
          backdrop-filter: blur(10px);
          border: 2px solid rgba(234, 179, 8, 0.4);
          color: #fbbf24;
          padding: 1rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .modal-nav-btn:hover {
          background: linear-gradient(
            135deg,
            rgba(234, 179, 8, 0.4) 0%,
            rgba(251, 191, 36, 0.4) 100%
          );
          border-color: rgba(234, 179, 8, 0.8);
          transform: scale(1.1);
          box-shadow: 0 8px 24px rgba(234, 179, 8, 0.3);
        }

        .modal-media-container {
          border: 2px solid rgba(234, 179, 8, 0.4);
          box-shadow: 0 0 60px rgba(234, 179, 8, 0.2);
        }

        .modal-info-bar {
          background: linear-gradient(
            135deg,
            rgba(20, 20, 20, 0.9) 0%,
            rgba(30, 20, 0, 0.9) 100%
          );
          backdrop-filter: blur(10px);
          border: 1px solid rgba(234, 179, 8, 0.3);
          border-radius: 0.75rem;
          box-shadow: 0 8px 32px rgba(234, 179, 8, 0.2);
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



