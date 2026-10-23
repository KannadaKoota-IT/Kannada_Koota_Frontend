import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Play,
  Maximize2,
} from "lucide-react";
import {
  getMediaUrl,
  handleImageError,
  DEFAULT_ANNOUNCEMENT_IMAGE,
} from "../utils/mediaUtils";

export default function Announcements({ initialAnnouncements = [] }) {
  const { language, isKannada } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [maximizedImageSrc, setMaximizedImageSrc] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchAnnouncements = async (signal) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/announcements?lang=${language}&_v=${encodeURIComponent(language)}`,
        {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
          signal,
        },
      );
      const data = await res.json();
      if (data && data.success) {
        setAnnouncements(data.announcements);
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      if (err.name !== "AbortError")
        console.error("Failed to fetch announcements:", err);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    // Handle image lightbox escape first
    if (maximizedImageSrc && e.key === "Escape") {
      setMaximizedImageSrc(null);
      return;
    }

    // Handle preview modal navigation
    if (!preview) return;
    if (e.key === "ArrowLeft" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPreview(announcements[currentIndex - 1]);
    } else if (
      e.key === "ArrowRight" &&
      currentIndex < announcements.length - 1
    ) {
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
  }, [preview, currentIndex, maximizedImageSrc]);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return !isNaN(d)
      ? d.toLocaleDateString(isKannada ? "kn-IN" : "en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;
  };

  return (
    <div key={language} className="min-h-screen bg-[#FCF9F8] text-[#1C1B1B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#EFEBE4] mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E1] border border-[#F5B000]/30 text-[#7C5800] text-xs font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5 text-[#9B000E]" />
              <span className="font-kannada">
                {isKannada ? "ಸೂಚನಾ ಫಲಕ" : "Official Notices"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1B1B] font-kannada">
              {isKannada ? "ಪ್ರಕಟಣೆಗಳು" : "Announcements & Updates"}
            </h1>
            <p className="text-xs sm:text-sm text-[#5C403D] mt-1 font-kannada">
              {isKannada
                ? "ಕ್ಯಾಂಪಸ್ ಪ್ರಕಟಣೆಗಳು, ಆಡಿಷನ್ ಸೂಚನೆಗಳು ಮತ್ತು ಸಾಮಾನ್ಯ ಎಚ್ಚರಿಕೆಗಳು."
                : "Official campus broadcasts, audition notices, and general assembly alerts."}
            </p>
          </div>
        </div>

        {/* Announcements List / Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 mx-auto border-4 border-[#EFEBE4] border-t-[#9B000E] rounded-full animate-spin mb-4" />
            <p className="text-[#5C403D] font-kannada">
              {isKannada
                ? "ಪ್ರಕಟಣೆಗಳು ಲೋಡ್ ಆಗುತ್ತಿದೆ..."
                : "Loading announcements..."}
            </p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EFEBE4] p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F6F3F2] flex items-center justify-center mx-auto text-[#5C403D]">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1C1B1B] font-kannada">
              {isKannada ? "ಇನ್ನೂ ಪ್ರಕಟಣೆಗಳಿಲ್ಲ" : "No announcements yet"}
            </h4>
            <p className="text-xs text-[#5C403D] font-kannada">
              {isKannada
                ? "ಹೊಸ ಪ್ರಕಟಣೆಗಳಿಗಾಗಿ ನಂತರ ಭೇಟಿ ನೀಡಿ!"
                : "Check back later for updates and circulars!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {announcements.map((announcement, index) => (
              <div
                key={`${announcement._id}-${language}`}
                onClick={() => {
                  setPreview(announcement);
                  setCurrentIndex(index);
                }}
                className="group relative bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 hover:elevation-2 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
              >
                <div className="h-0.5 w-full bg-transparent group-hover:gold-crimson-bar transition-all duration-300 shrink-0" />

                <div>
                  {/* Media Container - shrink-0 prevents it from being squished */}
                  <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden bg-[#1A1A1A] flex items-center justify-center shrink-0">
                    {announcement.mediaUrl ? (
                      announcement.mediaType === "image" ? (
                        <>
                          <img
                            src={getMediaUrl(
                              announcement.mediaUrl,
                              DEFAULT_ANNOUNCEMENT_IMAGE,
                            )}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110"
                          />
                          <img
                            src={getMediaUrl(
                              announcement.mediaUrl,
                              DEFAULT_ANNOUNCEMENT_IMAGE,
                            )}
                            alt={announcement.title || announcement.title_k}
                            onError={(e) =>
                              handleImageError(e, DEFAULT_ANNOUNCEMENT_IMAGE)
                            }
                            className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-102"
                          />

                          {/* Maximize Button for Images */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMaximizedImageSrc(
                                getMediaUrl(
                                  announcement.mediaUrl,
                                  DEFAULT_ANNOUNCEMENT_IMAGE,
                                ),
                              );
                            }}
                            className="absolute bottom-3 right-3 z-30 p-2 bg-black/40 hover:bg-black/80 text-white rounded-full backdrop-blur-sm shadow-md transition-all duration-200"
                            title={
                              isKannada
                                ? "ಚಿತ್ರವನ್ನು ದೊಡ್ಡದಾಗಿಸಿ"
                                : "Maximize Image"
                            }
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <video
                            src={getMediaUrl(announcement.mediaUrl)}
                            className="w-full h-full object-contain"
                            muted
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/90 text-[#9B000E] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 fill-current translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full crimson-gradient flex items-center justify-center text-white/40">
                        <Bell className="w-12 h-12" />
                      </div>
                    )}

                    {/* Date Badge */}
                    {announcement.date && (
                      <div className="absolute top-3 right-3 z-20 bg-white/95 text-[#1C1B1B] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs border border-[#EFEBE4] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#9B000E]" />
                        <span>{formatDate(announcement.date)}</span>
                      </div>
                    )}
                  </div>

                  {/* Body - flex-1 pushes footer down */}
                  <div className="p-5 sm:p-6 space-y-2 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-[#1C1B1B] font-kannada leading-snug group-hover:text-[#9B000E] transition-colors">
                      {isKannada
                        ? announcement.title_k || announcement.title
                        : announcement.title || announcement.title_k}
                    </h3>
                    <p className="text-sm text-[#5C403D] line-clamp-3 leading-relaxed font-kannada">
                      {isKannada
                        ? announcement.message_k || announcement.message
                        : announcement.message || announcement.message_k}
                    </p>
                  </div>
                </div>

                {/* Footer Link / Info - mt-auto locks it to the bottom */}
                <div className="px-5 sm:px-6 py-3.5 bg-[#FCF9F8] border-t border-[#EFEBE4] flex items-center justify-between text-xs text-[#5C403D] shrink-0 mt-auto">
                  <span className="text-[11px] font-medium text-[#916F6B] font-kannada">
                    {isKannada
                      ? "ಸಂಪೂರ್ಣ ಪ್ರಕಟಣೆ ವೀಕ್ಷಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ"
                      : "Click to view full notice"}
                  </span>
                  {announcement.link && (
                    <span className="inline-flex items-center gap-1 text-[#9B000E] font-semibold font-kannada">
                      <span>{isKannada ? "ಲಿಂಕ್" : "Link"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Announcement Detail Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/90 text-[#1C1B1B] hover:bg-white shadow-lg transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentIndex < announcements.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(currentIndex + 1);
                setPreview(announcements[currentIndex + 1]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/90 text-[#1C1B1B] hover:bg-white shadow-lg transition-all"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Modal Card */}
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#EFEBE4] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFEBE4] bg-[#FCF9F8]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#9B000E] uppercase tracking-wider">
                  {currentIndex + 1} of {announcements.length}
                </span>
                {preview.date && (
                  <span className="text-xs text-[#5C403D]">
                    • {formatDate(preview.date)}
                  </span>
                )}
              </div>
              <button
                onClick={() => setPreview(null)}
                className="p-1.5 rounded-full hover:bg-[#EFEBE4] text-[#5C403D] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 space-y-5">
              {preview.mediaUrl && (
                <div className="rounded-xl overflow-hidden bg-[#F6F3F2] border border-[#EFEBE4]">
                  {preview.mediaType === "image" ? (
                    <img
                      src={getMediaUrl(
                        preview.mediaUrl,
                        DEFAULT_ANNOUNCEMENT_IMAGE,
                      )}
                      alt={preview.title || preview.title_k}
                      onError={(e) =>
                        handleImageError(e, DEFAULT_ANNOUNCEMENT_IMAGE)
                      }
                      className="w-full max-h-[50vh] object-contain mx-auto"
                    />
                  ) : (
                    <video
                      src={getMediaUrl(preview.mediaUrl)}
                      controls
                      autoPlay
                      className="w-full max-h-[50vh] mx-auto"
                    />
                  )}
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-[#1C1B1B] font-kannada mb-3">
                  {isKannada
                    ? preview.title_k || preview.title
                    : preview.title || preview.title_k}
                </h2>
                <p className="text-sm text-[#5C403D] whitespace-pre-line leading-relaxed font-kannada">
                  {isKannada
                    ? preview.message_k || preview.message
                    : preview.message || preview.message_k}
                </p>
              </div>

              {preview.link && (
                <div className="pt-2">
                  <a
                    href={preview.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9B000E] text-white text-sm font-semibold hover:bg-[#7D000B] transition-colors shadow-sm"
                  >
                    <span className="font-kannada">
                      {isKannada
                        ? "ಲಗತ್ತನ್ನು / ಲಿಂಕ್ ಅನ್ನು ಭೇಟಿ ಮಾಡಿ"
                        : "Visit Attachment / Link"}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Footer Hint */}
            <div className="px-6 py-2.5 bg-[#FCF9F8] border-t border-[#EFEBE4] text-center text-[11px] text-[#916F6B]">
              {isKannada
                ? "ನ್ಯಾವಿಗೇಟ್ ಮಾಡಲು ಎಡ/ಬಲ ಬಾಣಗಳನ್ನು ಬಳಸಿ • ಮುಚ್ಚಲು ESC"
                : "Use left/right arrows to navigate • ESC to close"}
            </div>
          </div>
        </div>
      )}

      {/* Image Maximize Lightbox */}
      {maximizedImageSrc && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setMaximizedImageSrc(null)}
        >
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors cursor-pointer"
            onClick={() => setMaximizedImageSrc(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={maximizedImageSrc}
            alt="Maximized Announcement View"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
