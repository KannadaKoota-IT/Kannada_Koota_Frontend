import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Announcements({ initialAnnouncements = [] }) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  const translations = {
    en: {
      title: "Announcements",
      subtitle: "(ಪ್ರಕಟಣೆಗಳು)",
      loading: "Loading announcements...",
      noAnnouncements: "No announcements yet",
      checkBack: "Check back later for updates!"
    },
    kn: {
      title: "ಪ್ರಕಟಣೆಗಳು",
      subtitle: "(Announcements)",
      loading: "ಪ್ರಕಟಣೆಗಳನ್ನು ಲೋಡ್ ಮಾಡುತ್ತಿದೆ...",
      noAnnouncements: "ಇನ್ನೂ ಪ್ರಕಟಣೆಗಳಿಲ್ಲ",
      checkBack: "ನವೀಕರಣಗಳಿಗಾಗಿ ನೋಡಿ!"
    }
  };

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const API = `${API_BASE}/api/announcements?lang=${language}`;
  console.log('[Announcements] language =', language, 'API =', `${API}&_v=${language}`);

  const fetchAnnouncements = async (signal) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/announcements?lang=${language}&_v=${encodeURIComponent(language)}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
        signal,
      });
      const data = await res.json();
      console.log('[Announcements] response sample:', Array.isArray(data) ? data?.[0] : data?.announcements?.[0]);
      if (data && data.success) {
        setAnnouncements(data.announcements);
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error("Failed to fetch announcements:", err);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (!preview) return;
    if (e.key === "ArrowLeft" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPreview(announcements[currentIndex - 1]);
    } else if (e.key === "ArrowRight" && currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPreview(announcements[currentIndex + 1]);
    } else if (e.key === "Escape") {
      setPreview(null);
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchAnnouncements(ac.signal);
    setPreview(null);
    setCurrentIndex(0);
    return () => ac.abort();
  }, [language]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [preview, currentIndex]);

  return (
    <div key={language} className="heritage-announcements min-h-screen mt-20 relative overflow-hidden">
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
            <h1 className="text-5xl md:text-6xl font-bold mb-1 tracking-tight heritage-title text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-400">
              {translations[language].title}
            </h1>
            <p className="text-red-400 text-base md:text-lg font-medium mt-1">
              {translations[language].subtitle}
            </p>
          </div>
        </div>

        {/* Announcements Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-yellow-500/10 rounded-full flex items-center justify-center border-2 border-yellow-500/30">
              <div className="spinner"></div>
            </div>
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
              {translations[language].loading}
            </h2>
          </div>
        ) : announcements.length === 0 ? (
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
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
              {translations[language].noAnnouncements}
            </h2>
            <p className="text-amber-200/60">
              {translations[language].checkBack}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcements.map((announcement, index) => (
              <div
                key={`${announcement._id}-${language}`}
                className="heritage-card group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col"
                onClick={() => {
                  setPreview(announcement);
                  setCurrentIndex(index);
                }}
              >
                {/* Date Badge at Top */}
                {announcement.date && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {new Date(announcement.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                )}

                <div className="relative w-full h-64 overflow-hidden rounded-t-2xl">
                  {announcement.mediaUrl ? (
                    announcement.mediaType === "image" ? (
                      <img
                        src={announcement.mediaUrl}
                        alt={announcement.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          src={announcement.mediaUrl}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          muted
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-center justify-center">
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
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-yellow-900/40 to-amber-900/40 flex items-center justify-center">
                      <svg
                        className="w-20 h-20 text-yellow-500/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Text Content Below Image */}
                <div className="p-4 bg-black/90 rounded-b-2xl flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">
                      {announcement.title}
                    </h3>
                    <p
                      className="text-sm text-amber-100/80 line-clamp-3 mb-2"
                      style={language === 'kn' ? { fontFamily: "'Noto Sans Kannada', sans-serif" } : {}}
                    >
                      {announcement.message}
                    </p>
                  </div>

                  {announcement.link && (
                    <div className="flex items-center gap-1 text-xs text-yellow-500/80 mt-auto">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      <span>View Link</span>
                    </div>
                  )}
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none heritage-glow"></div>
              </div>
            ))}
          </div>
        )}

        {/* Announcement Detail Modal */}
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
                  setPreview(announcements[currentIndex - 1]);
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

            {currentIndex < announcements.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(currentIndex + 1);
                  setPreview(announcements[currentIndex + 1]);
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


            {/* Announcement Detail Container */}
            <div
              className="relative max-w-4xl w-full flex flex-col items-center pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-h-[calc(100dvh-6rem)] overflow-y-auto">
                <div className="modal-media-container relative rounded-xl overflow-hidden shadow-2xl w-full">
                  {/* Close Button */}
                  <button
                    onClick={() => setPreview(null)}
                    className="absolute top-6 right-6 bg-red-600/80 hover:bg-red-600 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 z-50 border border-red-400/30 shadow-lg"
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
                  {preview.mediaUrl ? (
                    preview.mediaType === "image" ? (
                      <img
                        src={preview.mediaUrl}
                        alt={preview.title}
                        className="w-full max-h-[60vh] object-contain"
                      />
                    ) : (
                      <video
                        src={preview.mediaUrl}
                        controls
                        autoPlay
                        className="w-full max-h-[60vh]"
                      />
                    )
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-yellow-900/40 to-amber-900/40 flex items-center justify-center">
                      <svg
                        className="w-32 h-32 text-yellow-500/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="modal-info-bar mt-6 px-8 py-6 w-full">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <p className="text-yellow-400/80 text-sm font-medium">
                      {currentIndex + 1} / {announcements.length}
                    </p>
                    {preview.date && (
                      <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">
                        {new Date(preview.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-yellow-400 mb-3">
                    {preview.title}
                  </h2>

                  <p
                    className="text-amber-100 mb-4 leading-relaxed"
                    style={language === 'kn' ? { fontFamily: "'Noto Sans Kannada', sans-serif" } : {}}
                  >
                    {preview.message}
                  </p>

                  {preview.link && (
                    <a
                      href={preview.link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors font-medium"
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
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      <span>Open Link</span>
                    </a>
                  )}
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

      <style>{`
        .heritage-announcements {
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

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Spinner */
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(234, 179, 8, 0.2);
          border-top-color: #eab308;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}