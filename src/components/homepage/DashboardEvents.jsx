import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Calendar,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Award,
  Maximize2,
  X,
} from "lucide-react";
import DailyVachanaWidget from "../widgets/DailyVachanaWidget";
import WordOfTheDayWidget from "../widgets/WordOfTheDayWidget";
import EventDetailModal from "../modals/EventDetailModal";
import { useLanguage } from "../../context/LanguageContext";
import { useMembership } from "../../context/MembershipContext";
import {
  getMediaUrl,
  handleImageError,
  DEFAULT_EVENT_IMAGE,
} from "../../utils/mediaUtils";

export default function DashboardEvents() {
  const router = useRouter();
  const { language, isKannada } = useLanguage();
  const { openMembership } = useMembership();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [maximizedImageSrc, setMaximizedImageSrc] = useState(null);

  const isHomePage = router.pathname === "/";
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/events?lang=${language}`);
        const data = await res.json();
        if (isMounted) {
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        if (isMounted) setEvents([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, [language, API_BASE]);

  // Format date helpers
  const formatMonth = (d) => {
    const dt = new Date(d);
    return !isNaN(dt)
      ? dt.toLocaleDateString(isKannada ? "kn-IN" : "en-US", { month: "short" })
      : "NOV";
  };
  const formatDay = (d) => {
    const dt = new Date(d);
    return !isNaN(dt)
      ? dt.toLocaleDateString("en-US", { day: "numeric" })
      : "01";
  };
  const formatFullDate = (d) => {
    const dt = new Date(d);
    return !isNaN(dt)
      ? dt.toLocaleDateString(isKannada ? "kn-IN" : "en-US", {
          dateStyle: "medium",
        })
      : d;
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

  // Event Sorting & Filtering Logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
  const upcomingEventsList = sortedEvents.filter(
    (e) => new Date(e.date) >= today,
  );
  const pastEventsList = sortedEvents
    .filter((e) => new Date(e.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Determine Spotlight Event (Upcoming gets priority; fallback to Past if none exist)
  const spotlightEvent =
    upcomingEventsList.length > 0
      ? upcomingEventsList[0]
      : pastEventsList.length > 0
        ? pastEventsList[0]
        : null;

  const isSpotlightPast =
    spotlightEvent && new Date(spotlightEvent.date) < today;

  // Determine Event Grids (We now keep the spotlighted event in the list below too)
  let displayUpcoming = [...upcomingEventsList];
  let displayPast = [...pastEventsList];

  // Slice arrays to max 3 items if on Homepage
  if (isHomePage) {
    displayUpcoming = displayUpcoming.slice(0, 3);
    displayPast = displayPast.slice(0, 3);
  }

  // Reusable Event Card Component (Structured with Flexbox for equal heights)
  const renderEventCard = (event) => {
    const isPast = new Date(event.date) < today;

    return (
      <div
        key={event._id}
        className="group relative bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 hover:elevation-2 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
      >
        <div className="h-0.5 w-full bg-transparent group-hover:gold-crimson-bar transition-all duration-300 shrink-0" />

        {/* Image Section - shrink-0 prevents it from being squished */}
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
            <div className="w-full h-full crimson-gradient flex items-center justify-center text-white/50">
              <Calendar className="w-12 h-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none z-10" />

          <div className="absolute top-3 left-3 z-20 bg-[#F5B000] text-[#1A1A1A] px-3 py-1.5 rounded-xl shadow-md flex flex-col items-center justify-center font-bold tracking-tight border border-[#E0A200]">
            <span className="text-[10px] uppercase font-semibold leading-tight">
              {formatMonth(event.date)}
            </span>
            <span className="text-xl font-extrabold leading-none">
              {formatDay(event.date)}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-20">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#1C1B1B] shadow-sm backdrop-blur-xs border border-white/60 font-kannada">
              {isKannada ? "ಕಾರ್ಯಕ್ರಮ" : "Event"}
            </span>
          </div>
        </div>

        {/* Content Section - flex-1 grows to fill empty space, pushing footer down */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between text-xs text-[#5C403D] mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#916F6B]" />
              {event.eventTime || (isKannada ? "ಸಮಯ ನಿಗದಿಯಾಗಿಲ್ಲ" : "TBA")}
            </span>
            {isPast ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                {isKannada ? "ಮುಕ್ತಾಯ" : "Completed"}
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
            {getTitle(event)}
          </h3>

          <p className="text-sm text-[#5C403D] line-clamp-2 leading-relaxed">
            {getDesc(event)}
          </p>
        </div>

        {/* Footer Section - mt-auto keeps it locked to the bottom */}
        <div className="px-5 sm:px-6 py-4 bg-[#FCF9F8] border-t border-[#EFEBE4] flex items-center justify-between gap-3 shrink-0 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#5C403D] truncate max-w-[60%]">
            <MapPin className="w-3.5 h-3.5 text-[#9B000E] shrink-0" />
            <span className="truncate font-kannada">{getLocation(event)}</span>
          </div>

          <button
            onClick={() => setSelectedEvent(event)}
            className="text-[#9B000E] hover:text-[#7C5800] font-semibold text-xs sm:text-sm flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
          >
            <span className="font-kannada">
              {isKannada ? "ವಿವರಗಳು" : "Details"}
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  };

  // Grid Section Rendering Helper
  const renderGridSection = (gridEvents, titleK, titleE, showViewAll) => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#EFEBE4]">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-[#9B000E]">
            {isKannada ? "ಹಬ್ಬಗಳು & ವೇದಿಕೆ" : "Festivals & Forums"}
          </div>
          <h3 className="text-2xl font-bold text-[#1C1B1B] font-kannada">
            {isKannada ? titleK : titleE}
          </h3>
        </div>

        {showViewAll && isHomePage && (
          <Link
            href="/events"
            className="text-xs sm:text-sm font-semibold text-[#9B000E] hover:text-[#7C5800] flex items-center gap-1 cursor-pointer"
          >
            <span>
              {isKannada ? "ಎಲ್ಲಾ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ವೀಕ್ಷಿಸಿ" : "View All Events"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {gridEvents.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#EFEBE4] text-[#5C403D]">
          <Calendar className="w-8 h-8 mx-auto text-[#916F6B] mb-2" />
          <p className="font-kannada">
            {isKannada
              ? "ಯಾವುದೇ ಕಾರ್ಯಕ್ರಮಗಳು ಲಭ್ಯವಿಲ್ಲ"
              : "No events listed yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {gridEvents.map(renderEventCard)}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12 mt-12">
      {/* 1. Cultural Widgets Grid: Always visible */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7">
          <DailyVachanaWidget />
        </div>
        <div className="lg:col-span-5">
          <WordOfTheDayWidget />
        </div>
      </div>

      {/* 2. Spotlight Event Block */}
      {spotlightEvent && (
        <div className="bg-white rounded-2xl border border-[#EFEBE4] p-6 sm:p-8 elevation-1 relative overflow-hidden transition-all">
          <div className="h-1.5 w-full gold-crimson-bar absolute top-0 left-0" />

          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="space-y-3 lg:max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E1] text-[#7C5800] border border-[#F5B000]/40 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#C4151C]" />
                <span className="font-kannada">
                  {isSpotlightPast
                    ? isKannada
                      ? "ಹಿಂದಿನ ಆಕರ್ಷಣೆ • PAST HIGHLIGHT"
                      : "PAST HIGHLIGHT"
                    : isKannada
                      ? "ವಿಶೇಷ ಆಕರ್ಷಣೆ • SPOTLIGHT EVENT"
                      : "SPOTLIGHT EVENT"}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1C1B1B] font-kannada leading-snug">
                {getTitle(spotlightEvent)}
              </h3>

              <p className="text-sm text-[#5C403D] leading-relaxed line-clamp-2">
                {getDesc(spotlightEvent)}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#1C1B1B] pt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-[#9B000E]" />
                  <span>
                    {formatFullDate(spotlightEvent.date)}{" "}
                    {spotlightEvent.eventTime
                      ? `(${spotlightEvent.eventTime})`
                      : ""}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#9B000E]" />
                  <span className="font-kannada">
                    {getLocation(spotlightEvent)}
                  </span>
                </span>
              </div>
            </div>

            {/* Right Actions - added relative z-10 for clickability */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto relative z-10">
              <button
                onClick={() => setSelectedEvent(spotlightEvent)}
                className="crimson-gradient hover:opacity-95 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span className="font-kannada">
                  {isKannada ? "ವಿವರಗಳು / RSVP" : "RSVP / Details"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {isHomePage && (
                <Link
                  href="/events"
                  className="bg-[#F6F3F2] hover:bg-[#EAE7E7] text-[#1C1B1B] font-semibold text-xs sm:text-sm px-5 py-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>
                    {isKannada ? "ಎಲ್ಲ ಕಾರ್ಯಕ್ರಮಗಳು" : "View All Events"}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Event Grids (Dynamic rendering based on route and availability) */}
      {loading ? (
        <div className="text-center py-12 text-[#5C403D] font-kannada">
          {isKannada ? "ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Loading events..."}
        </div>
      ) : (
        <>
          {isHomePage ? (
            /* Homepage: Show Upcoming Grid if events exist. Fallback to Past Grid. Never show both. */
            displayUpcoming.length > 0 ? (
              renderGridSection(
                displayUpcoming,
                "ಮುಂಬರುವ ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು",
                "Upcoming Cultural Events",
                true,
              )
            ) : displayPast.length > 0 ? (
              renderGridSection(
                displayPast,
                "ಹಿಂದಿನ ಕಾರ್ಯಕ್ರಮಗಳು",
                "Recent Past Events",
                true,
              )
            ) : (
              renderGridSection(
                [],
                "ಮುಂಬರುವ ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು",
                "Upcoming Cultural Events",
                true,
              )
            )
          ) : (
            /* Events Page: Show Upcoming Grid strictly. Followed by Past Grid dynamically. */
            <div className="space-y-12">
              {renderGridSection(
                displayUpcoming,
                "ಮುಂಬರುವ ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು",
                "Upcoming Cultural Events",
                false,
              )}
              {displayPast.length > 0 &&
                renderGridSection(
                  displayPast,
                  "ಹಿಂದಿನ ಕಾರ್ಯಕ್ರಮಗಳು",
                  "Past Cultural Events",
                  false,
                )}
            </div>
          )}
        </>
      )}

      {/* 4. Join Banner */}
      <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#9B000E] via-[#8A0E14] to-[#7C5800] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="space-y-2 text-center sm:text-left z-10">
          <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5B000] text-[#1C1B1B] uppercase tracking-wider">
            {isKannada
              ? "ಪಿ.ಇ.ಎಸ್ ವಿದ್ಯಾರ್ಥಿ ಒಕ್ಕೂಟ 2026"
              : "PES STUDENT UNION 2026"}
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-kannada leading-tight">
            {isKannada
              ? "ನೀವು ನಮ್ಮ ಕನ್ನಡ ಕೂಟದ ಸದಸ್ಯರಾಗಲು ಇಚ್ಛಿಸುವಿರಾ?"
              : "Would you like to join Kannada Koota?"}
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
            {isKannada
              ? "ನಾಟಕ, ಚರ್ಚಾಸ್ಪರ್ಧೆ, ಕವನ ವಾಚನ ಮತ್ತು ವಾರ್ಷಿಕ ರಾಜ್ಯೋತ್ಸವ ಆಚರಣೆಗಳಲ್ಲಿ ನೂರಾರು ವಿದ್ಯಾರ್ಥಿಗಳೊಂದಿಗೆ ಪಾಲ್ಗೊಳ್ಳಿ."
              : "Join hundreds of collegiate peers in theatre auditions, debates, poetry workshops, and annual Rajyotsava celebrations."}
          </p>
        </div>

        <button
          onClick={openMembership}
          className="bg-white text-[#9B000E] hover:bg-[#FFF8E1] font-bold text-sm sm:text-base px-6 py-3 rounded-lg shadow-sm shrink-0 flex items-center gap-2 cursor-pointer active:scale-98 transition-all z-10"
        >
          <Award className="w-4 h-4 text-[#F5B000]" />
          <span className="font-kannada">
            {isKannada ? "ಸದಸ್ಯರಾಗಿ" : "Register Now"}
          </span>
        </button>
      </div>

      {/* Modal instances */}
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
