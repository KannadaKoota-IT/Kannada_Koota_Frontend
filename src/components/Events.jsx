import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  ExternalLink,
  Filter,
  Maximize2,
  X,
} from "lucide-react";
import EventDetailModal from "./modals/EventDetailModal";
import {
  getMediaUrl,
  handleImageError,
  DEFAULT_EVENT_IMAGE,
} from "../utils/mediaUtils";

export default function Events({ initialEvents = [] }) {
  const { language, isKannada } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [maximizedImageSrc, setMaximizedImageSrc] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchEvents = async (signal) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/events?lang=${language}&_v=${encodeURIComponent(language)}`,
        {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
          signal,
        },
      );
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name !== "AbortError")
        console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const ac = new AbortController();
    fetchEvents(ac.signal);
    setSelectedEvent(null);
    return () => ac.abort();
  }, [language]);

  // Format date helpers
  const formatMonth = (d) => {
    const dt = new Date(d);
    return !isNaN(dt)
      ? dt
          .toLocaleDateString(isKannada ? "kn-IN" : "en-US", { month: "short" })
          .toUpperCase()
      : "NOV";
  };
  const formatDay = (d) => {
    const dt = new Date(d);
    return !isNaN(dt)
      ? dt.toLocaleDateString("en-US", { day: "numeric" })
      : "01";
  };

  const formatTime = (time) => {
    if (!time) return isKannada ? "ಸಮಯ ನಿಗದಿಯಾಗಿಲ್ಲ" : "TBA";
    const [hours, minutes] = time.split(":");
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  // Translation Helpers
  const getTitle = (e) =>
    isKannada ? e.title_k || e.title : e.title || e.title_k;
  const getDesc = (e) =>
    isKannada
      ? e.description_k || e.description
      : e.description || e.description_k;
  const getLocation = (e) => {
    if (e.location && e.location_k)
      return isKannada ? e.location_k : e.location;
    return (
      e.location ||
      (isKannada ? "ಪಿ.ಇ.ಎಸ್ ವಿಶ್ವವಿದ್ಯಾಲಯ" : "PES University Campus")
    );
  };

  // Filtering & Sorting Logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = events.filter((ev) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (ev.title && ev.title.toLowerCase().includes(q)) ||
      (ev.title_k && ev.title_k.includes(q)) ||
      (ev.description && ev.description.toLowerCase().includes(q)) ||
      (ev.description_k && ev.description_k.includes(q)) ||
      (ev.location && ev.location.toLowerCase().includes(q)) ||
      (ev.location_k && ev.location_k.includes(q))
    );
  });

  // Split into upcoming and past
  const upcomingEvents = filteredEvents
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastEvents = filteredEvents
    .filter((e) => new Date(e.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Descending for past events

  // Reusable Event Card Component
  const renderEventCard = (event) => {
    const isPast = new Date(event.date) < today;

    return (
      <div
        key={`${event._id}-${language}`}
        className="group relative bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 hover:elevation-2 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
      >
        <div className="h-0.5 w-full bg-transparent group-hover:gold-crimson-bar transition-all duration-300 shrink-0" />

        {/* Image Section */}
        <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden bg-[#1A1A1A] flex items-center justify-center shrink-0">
          {event.imageUrl ? (
            <>
              <img
                src={getMediaUrl(event.imageUrl, DEFAULT_EVENT_IMAGE)}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110"
              />
              <img
                src={getMediaUrl(event.imageUrl, DEFAULT_EVENT_IMAGE)}
                alt={getTitle(event)}
                onError={(e) => handleImageError(e, DEFAULT_EVENT_IMAGE)}
                className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-102"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMaximizedImageSrc(
                    getMediaUrl(event.imageUrl, DEFAULT_EVENT_IMAGE),
                  );
                }}
                className="absolute bottom-3 right-3 z-30 p-2 bg-black/40 hover:bg-black/80 text-white rounded-full backdrop-blur-sm shadow-md transition-all duration-200"
                title={isKannada ? "ಚಿತ್ರವನ್ನು ದೊಡ್ಡದಾಗಿಸಿ" : "Maximize Image"}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full h-full crimson-gradient flex items-center justify-center text-white/40">
              <Calendar className="w-12 h-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none z-10" />

          {/* Date Pill */}
          <div className="absolute top-3 left-3 z-20 bg-[#F5B000] text-[#1A1A1A] px-3 py-1.5 rounded-xl shadow-md flex flex-col items-center justify-center font-bold tracking-tight border border-[#E0A200]">
            <span className="text-[10px] uppercase font-semibold leading-tight">
              {formatMonth(event.date)}
            </span>
            <span className="text-xl font-extrabold leading-none">
              {formatDay(event.date)}
            </span>
          </div>

          {/* Category Chip */}
          <div className="absolute top-3 right-3 z-20">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-[#1C1B1B] shadow-sm backdrop-blur-xs border border-white/60 font-kannada uppercase">
              {isKannada ? "ಕಾರ್ಯಕ್ರಮ" : "Event"}
            </span>
          </div>
        </div>

        {/* Card Body - flex-1 pushes footer down */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between text-xs text-[#5C403D] mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#916F6B]" />
              {formatTime(event.eventTime)}
            </span>
            {isPast ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                {isKannada ? "ಮುಕ್ತಾಯ" : "Completed"}
              </span>
            ) : event.link ? (
              <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                {isKannada ? "ನೋಂದಣಿ ಮುಕ್ತವಾಗಿದೆ" : "Register Open"}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                {isKannada ? "ಎಲ್ಲರಿಗೂ ಮುಕ್ತ" : "Open for All"}
              </span>
            )}
          </div>

          <h3
            onClick={() => setSelectedEvent(event)}
            className="text-lg sm:text-xl font-bold text-[#1C1B1B] font-kannada leading-snug group-hover:text-[#9B000E] cursor-pointer transition-colors mb-2"
          >
            {getTitle(event) || (isKannada ? "ಕಾರ್ಯಕ್ರಮ" : "Event")}
          </h3>

          <p className="text-sm text-[#5C403D] line-clamp-2 leading-relaxed">
            {getDesc(event)}
          </p>
        </div>

        {/* Bottom Action Shelf - locked to bottom */}
        <div className="px-5 sm:px-6 py-4 bg-[#FCF9F8] border-t border-[#EFEBE4] flex items-center justify-between gap-3 shrink-0 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#5C403D] truncate max-w-[55%]">
            <MapPin className="w-3.5 h-3.5 text-[#9B000E] shrink-0" />
            <span className="truncate font-kannada">{getLocation(event)}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-[#FFF8E1] hover:bg-[#F5B000]/20 text-[#7C5800] transition-colors"
                title={isKannada ? "ನೋಂದಾಯಿಸಿ" : "Register"}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => setSelectedEvent(event)}
              className="text-[#9B000E] hover:text-[#7C5800] font-semibold text-xs sm:text-sm flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="font-kannada">
                {isKannada ? "ವಿವರಗಳು" : "Details"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div key={language} className="min-h-screen bg-[#FCF9F8] text-[#1C1B1B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#EFEBE4] mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#9B000E]">
              {isKannada ? "ಕ್ಯಾಂಪಸ್ ಕ್ಯಾಲೆಂಡರ್" : "Campus Calendar"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1B1B] font-kannada">
              {isKannada
                ? "ಕಾರ್ಯಕ್ರಮಗಳು & ಹಬ್ಬಗಳ ವೇಳಾಪಟ್ಟಿ"
                : "Events & Cultural Celebrations"}
            </h1>
            <p className="text-xs sm:text-sm text-[#5C403D] mt-1">
              {isKannada
                ? "ನಾಟಕ, ಚರ್ಚಾಸ್ಪರ್ಧೆ, ಸಂಗೀತ ಹಬ್ಬಗಳು ಮತ್ತು ವಾರ್ಷಿಕ ರಾಜ್ಯೋತ್ಸವ."
                : "Theatre auditions, competitions, music festivals and annual Rajyotsava."}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#916F6B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                isKannada ? "ಕಾರ್ಯಕ್ರಮ ಹುಡುಕಿ..." : "Search events..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#EFEBE4] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B000E] font-kannada"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto border-4 border-[#EFEBE4] border-t-[#9B000E] rounded-full animate-spin mb-4" />
            <p className="text-[#5C403D] font-kannada">
              {isKannada
                ? "ಕಾರ್ಯಕ್ರಮಗಳು ಲೋಡ್ ಆಗುತ್ತಿದೆ..."
                : "Loading events..."}
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EFEBE4] p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F6F3F2] flex items-center justify-center mx-auto text-[#5C403D]">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1C1B1B] font-kannada">
              {searchQuery
                ? isKannada
                  ? "ಯಾವುದೇ ಕಾರ್ಯಕ್ರಮಗಳು ಕಂಡುಬಂದಿಲ್ಲ"
                  : "No matching events found"
                : isKannada
                  ? "ಇನ್ನೂ ಕಾರ್ಯಕ್ರಮಗಳಿಲ್ಲ"
                  : "No events listed yet"}
            </h4>
            <p className="text-xs text-[#5C403D]">
              {searchQuery
                ? isKannada
                  ? "ಹುಡುಕಾಟವನ್ನು ತೆರವುಗೊಳಿಸಿ."
                  : "Try clearing the search."
                : isKannada
                  ? "ಮುಂಬರುವ ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳಿಗಾಗಿ ಶೀಘ್ರದಲ್ಲೇ ಪರಿಶೀಲಿಸಿ."
                  : "Check back soon for upcoming cultural events and festivals."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-[#9B000E] underline cursor-pointer mt-2"
              >
                {isKannada ? "ಮರುಹೊಂದಿಸಿ (Reset Search)" : "Reset Search"}
              </button>
            )}
          </div>
        ) : (
          /* Events Display */
          <div className="space-y-12">
            {/* Upcoming Events Section */}
            {upcomingEvents.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-[#1C1B1B] font-kannada mb-6 flex items-center gap-2">
                  {isKannada ? "ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು" : "Upcoming Events"}
                  <span className="text-sm bg-[#9B000E] text-white px-2 py-0.5 rounded-full">
                    {upcomingEvents.length}
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {upcomingEvents.map(renderEventCard)}
                </div>
              </div>
            )}

            {/* Past Events Section */}
            {pastEvents.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-[#1C1B1B] font-kannada mb-6 flex items-center gap-2 border-t border-[#EFEBE4] pt-10">
                  {isKannada ? "ಹಿಂದಿನ ಕಾರ್ಯಕ್ರಮಗಳು" : "Past Events"}
                  <span className="text-sm bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                    {pastEvents.length}
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {pastEvents.map(renderEventCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

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
            alt="Maximized Event View"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
