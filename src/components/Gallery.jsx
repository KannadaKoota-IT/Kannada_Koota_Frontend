import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { 
  Camera, 
  Video, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  RotateCcw, 
  RotateCw, 
  ExternalLink, 
  Play 
} from "lucide-react";
import { getMediaUrl, handleImageError, DEFAULT_GALLERY_IMAGE } from "../utils/mediaUtils";

export default function Gallery() {
  const { isKannada } = useLanguage();
  const [mediaList, setMediaList] = useState([]);
  const [preview, setPreview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

  // Reset rotation when preview changes
  useEffect(() => {
    setRotation(0);
  }, [preview]);

  // Update video rotation when rotation state changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, [rotation]);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/gallery`);
      const data = await res.json();
      setMediaList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch gallery media:", err);
      setMediaList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const filteredMedia = mediaList
    .filter((item) => {
      if (filter === "all") return true;
      return item.mediaType === filter;
    })
    .sort((a, b) => {
      if (a.order !== b.order) {
        return (b.order || 0) - (a.order || 0);
      }
      if (sortBy === "latest") {
        return new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0);
      } else {
        return new Date(a.uploadedAt || 0) - new Date(b.uploadedAt || 0);
      }
    });

  const displayedMedia = showAll ? filteredMedia : filteredMedia.slice(0, 8);

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
    <div className="min-h-screen bg-[#FCF9F8] text-[#1C1B1B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#EFEBE4] mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E1] border border-[#F5B000]/30 text-[#7C5800] text-xs font-bold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5 text-[#9B000E]" />
              <span>{isKannada ? 'ನಮ್ಮ ನೆನಪುಗಳ ಸಂಗ್ರಹ' : 'Visual Archives'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1B1B] font-kannada">
              {isKannada ? "ನಮ್ಮ ಸಂಸ್ಕೃತಿಯ ಬಿಂಬ" : "Photo & Video Gallery"}
            </h1>
            <p className="text-xs sm:text-sm text-[#5C403D] mt-1">
              {isKannada
                ? "ಕನ್ನಡ ಕೂಟದ ರಂಗಭೂಮಿ, ಸಾಹಿತ್ಯ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕ್ಷಣಗಳು."
                : "Moments from Rajyotsava, theatre productions, literature fests and club gatherings."}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#F6F3F2] rounded-xl border border-[#EFEBE4]">
            <button
              onClick={() => {
                setFilter("all");
                setShowAll(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === "all"
                  ? "bg-white text-[#9B000E] shadow-sm"
                  : "text-[#5C403D] hover:text-[#1C1B1B]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isKannada ? "ಎಲ್ಲಾ" : "All"}</span>
            </button>
            <button
              onClick={() => {
                setFilter("image");
                setShowAll(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === "image"
                  ? "bg-white text-[#9B000E] shadow-sm"
                  : "text-[#5C403D] hover:text-[#1C1B1B]"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isKannada ? "ಚಿತ್ರಗಳು" : "Photos"}</span>
            </button>
            <button
              onClick={() => {
                setFilter("video");
                setShowAll(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === "video"
                  ? "bg-white text-[#9B000E] shadow-sm"
                  : "text-[#5C403D] hover:text-[#1C1B1B]"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isKannada ? "ವೀಡಿಯೊ" : "Videos"}</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 mx-auto border-4 border-[#EFEBE4] border-t-[#9B000E] rounded-full animate-spin mb-4" />
            <p className="text-[#5C403D] font-kannada">
              {isKannada ? "ಚಿತ್ರಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ..." : "Loading media..."}
            </p>
          </div>
        ) : displayedMedia.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EFEBE4] p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F6F3F2] flex items-center justify-center mx-auto text-[#5C403D]">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1C1B1B] font-kannada">
              {isKannada ? "ಯಾವುದೇ ಮಾಧ್ಯಮ ಕಂಡುಬಂದಿಲ್ಲ" : "No media found"}
            </h4>
            <p className="text-xs text-[#5C403D]">
              {filter === "all"
                ? (isKannada ? "ಇನ್ನೂ ಯಾವುದೇ ಮಾಧ್ಯಮವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿಲ್ಲ." : "No media has been uploaded yet.")
                : (isKannada ? `ಯಾವುದೇ ${filter === "image" ? "ಚಿತ್ರಗಳು" : "ವೀಡಿಯೊಗಳು"} ಲಭ್ಯವಿಲ್ಲ.` : `No ${filter}s available.`)}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {displayedMedia.map((item, index) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setPreview(item);
                    setCurrentIndex(mediaList.findIndex((m) => m._id === item._id));
                  }}
                  className="group relative bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 hover:elevation-2 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#F6F3F2]">
                    {item.mediaType === "video" ? (
                      <>
                        <video
                          src={getMediaUrl(item.mediaUrl)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 text-[#9B000E] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-[#9B000E] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                          VIDEO
                        </div>
                      </>
                    ) : (
                      <img
                        src={getMediaUrl(item.mediaUrl, DEFAULT_GALLERY_IMAGE)}
                        alt={item.desc || item.title || "Gallery item"}
                        onError={(e) => handleImageError(e, DEFAULT_GALLERY_IMAGE)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>

                  {(item.desc || item.title) && (
                    <div className="p-3.5 bg-white border-t border-[#EFEBE4] flex-1">
                      <p className="text-xs text-[#5C403D] line-clamp-2 leading-relaxed font-kannada">
                        {item.desc || item.title}
                      </p>
                      {item.link && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9B000E] mt-1.5">
                          <span>Open link</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* View More / View Less */}
            {filteredMedia.length > 8 && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-2.5 rounded-xl border border-[#9B000E] text-[#9B000E] hover:bg-[#9B000E] hover:text-white font-semibold text-sm transition-all shadow-sm"
                >
                  {showAll
                    ? (isKannada ? "ಕಡಿಮೆ ತೋರಿಸಿ (Show Less)" : "Show Less")
                    : (isKannada ? `ಇನ್ನಷ್ಟು ತೋರಿಸಿ (+${filteredMedia.length - 8} More)` : `View More (+${filteredMedia.length - 8})`)}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/90 text-[#1C1B1B] hover:bg-white shadow-xl transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentIndex < mediaList.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(currentIndex + 1);
                setPreview(mediaList[currentIndex + 1]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/90 text-[#1C1B1B] hover:bg-white shadow-xl transition-all"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Modal Content Frame */}
          <div
            className="relative max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#EFEBE4] max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Actions Bar */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#EFEBE4] bg-[#FCF9F8]">
              <span className="text-xs font-bold text-[#9B000E] uppercase tracking-wider">
                {currentIndex + 1} of {mediaList.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRotation((prev) => prev - 90)}
                  className="p-1.5 rounded-lg hover:bg-[#EFEBE4] text-[#5C403D] transition-colors"
                  title="Rotate Left"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRotation((prev) => prev + 90)}
                  className="p-1.5 rounded-lg hover:bg-[#EFEBE4] text-[#5C403D] transition-colors"
                  title="Rotate Right"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                {preview.link && (
                  <a
                    href={preview.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-[#EFEBE4] text-[#9B000E] transition-colors"
                    title="Open Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => setPreview(null)}
                  className="p-1.5 rounded-lg hover:bg-[#EFEBE4] text-[#1C1B1B] transition-colors ml-2"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Media Body */}
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[50vh] max-h-[70vh]">
              {preview.mediaType === "video" ? (
                <video
                  ref={videoRef}
                  src={getMediaUrl(preview.mediaUrl)}
                  controls
                  autoPlay
                  className="max-h-[70vh] max-w-full w-auto h-auto transition-transform duration-300"
                />
              ) : (
                <img
                  src={getMediaUrl(preview.mediaUrl, DEFAULT_GALLERY_IMAGE)}
                  alt={preview.desc || preview.title || "Preview"}
                  onError={(e) => handleImageError(e, DEFAULT_GALLERY_IMAGE)}
                  className="max-h-[70vh] max-w-full w-auto h-auto object-contain transition-transform duration-300"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              )}
            </div>

            {/* Caption Bar */}
            {(preview.desc || preview.title) && (
              <div className="px-6 py-4 bg-white border-t border-[#EFEBE4]">
                <p className="text-sm text-[#1C1B1B] font-kannada leading-relaxed">
                  {preview.desc || preview.title}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
