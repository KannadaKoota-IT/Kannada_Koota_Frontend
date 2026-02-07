import React, { useEffect, useRef, useState } from "react";
import Carousel from "../../../Reactbits/Carousel/Carousel";
import InfiniteScroll from "../../../Reactbits/InfiniteScroll/InfiniteScroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/router";
import { useLanguage } from "../../context/LanguageContext";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function DashboardEvents({
  announcements: initialAnnouncements,
}) {
  const sectionRef = useRef(null);
  const router = useRouter();
  const { language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState(
    initialAnnouncements || [],
  );
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  const autoPlayRef = useRef(null);

  // Fetch events based on language
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(
        `${API_BASE}/api/events?lang=${language}&_v=${encodeURIComponent(language)}`,
        {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        },
      );
      const data = await res.json();
      const formattedEvents = data.slice(0, 4).map((event) => ({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toLocaleDateString(),
        time: formatTime(event.eventTime),
        location: event.location || "TBA",
        image: event.imageUrl ? `${API_BASE}${event.imageUrl}` : null,
        language: language,
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch announcements based on language
  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(
        `${API_BASE}/api/announcements?lang=${language}&_v=${encodeURIComponent(language)}`,
        {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        },
      );
      const data = await res.json();
      if (data && data.success) {
        setAnnouncements(
          data.announcements.slice(0, 5).map((item) => ({
            title: item.title,
            message: item.message,
          })),
        );
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setAnnouncements([]);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchAnnouncements();
  }, [language]);

  // Auto-play for carousel
  useEffect(() => {
    if (isAutoPlaying && events.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % events.length);
      }, 4000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, events.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".carousel-wrapper", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".carousel-wrapper",
          start: "top 80%",
        },
      });

      gsap.from(".announcement-panel", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".announcement-panel",
          start: "top 85%",
        },
      });

      gsap.fromTo(
        ".announcement-panel",
        {
          boxShadow: "0 0 0px rgba(255, 215, 0, 0)",
          borderColor: "rgba(255, 215, 0, 0.05)",
        },
        {
          boxShadow:
            "0 0 24px rgba(29, 18, 183, 0.4), 0 0 12px rgba(255, 215, 0, 0.2)",
          borderColor: "rgba(0, 149, 255, 0.4)",
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".announcement-panel",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.to(".blue-glow", {
        x: "20%",
        y: "10%",
        backgroundColor: "rgba(56, 189, 248, 0.25)",
        repeat: -1,
        yoyo: true,
        duration: 8,
        ease: "sine.inOut",
      });

      gsap.to(".blue-glow-2", {
        x: "-15%",
        y: "-5%",
        backgroundColor: "rgba(96, 165, 250, 0.25)",
        repeat: -1,
        yoyo: true,
        duration: 10,
        ease: "sine.inOut",
      });

      gsap.to(".blue-glow, .blue-glow-2", {
        scale: 1.2,
        repeat: -1,
        yoyo: true,
        duration: 6,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Format time helper
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  // Data for Quotes
  const quotes = [
    {
      icon: "📜",
      kannada: "ಎಲ್ಲಾದರು ಇರು ಎಂತಾದರು ಇರು, ಎಂದೆಂದಿಗೂ ನೀ ಕನ್ನಡವಾಗಿರು",
      author: "– ಕುವೆಂಪು (Kuvempu)",
      gradient: "from-blue-400 to-cyan-300",
      border: "blue",
      bgData: "from-blue-500/10 to-cyan-500/5",
    },
    {
      icon: "✨",
      kannada: "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ",
      author: "– ಬಿ.ಎಂ.ಶ್ರೀ (B.M. Sri)",
      gradient: "from-purple-400 to-pink-300",
      border: "purple",
      bgData: "from-purple-500/10 to-pink-500/5",
    },
    {
      icon: "🦁",
      kannada: "ಕನ್ನಡವೇ ಸತ್ಯ, ಕನ್ನಡವೇ ನಿತ್ಯ",
      author: "– ಜಿ.ಎಸ್.ಶಿವರುದ್ರಪ್ಪ (GSS)",
      gradient: "from-cyan-400 to-blue-300",
      border: "cyan",
      bgData: "from-cyan-500/10 to-blue-500/5",
    },
    {
      icon: "🌍",
      kannada: "ಮನುಷ್ಯಜಾತಿ ತಾನೊಂದೇ ವಲಂ",
      author: "– ಪಂಪ (Pampa)",
      gradient: "from-pink-400 to-purple-300",
      border: "pink",
      bgData: "from-pink-500/10 to-purple-500/5",
    },
  ];

  return (
    <div
      id="dashboard-events"
      className="relative flex flex-col justify-start p-16 sm:p-10 bg-black min-h-screen box-border overflow-hidden"
      ref={sectionRef}
    >
      {/* Enhanced Background Layers */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Primary Glows */}
        <div className="blue-glow absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl top-[-150px] left-[-200px]"></div>
        <div className="blue-glow-2 absolute w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-2xl bottom-[-100px] right-[-150px]"></div>

        {/* Additional Ambient Glows */}
        <div className="absolute w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl bottom-[20%] left-[10%] animate-pulse"></div>
        <div
          className="absolute w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-2xl top-[40%] right-[15%] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Floating Particles */}
        <div className="absolute top-[15%] left-[5%] w-2 h-2 bg-cyan-400/40 rounded-full animate-float"></div>
        <div
          className="absolute top-[25%] right-[10%] w-3 h-3 bg-purple-400/30 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-[60%] left-[20%] w-2 h-2 bg-blue-400/40 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-[70%] right-[25%] w-2 h-2 bg-pink-400/30 rounded-full animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-[15%] left-[15%] w-3 h-3 bg-cyan-400/35 rounded-full animate-float"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute bottom-[25%] right-[30%] w-2 h-2 bg-purple-400/40 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Geometric Patterns */}
        <div className="absolute top-[10%] right-[5%] w-20 h-20 border border-cyan-500/10 rotate-45 animate-spin-slow"></div>
        <div
          className="absolute bottom-[30%] left-[8%] w-16 h-16 border border-purple-500/10 rotate-12 animate-spin-slow"
          style={{ animationDirection: "reverse" }}
        ></div>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-[1400px] mx-auto relative z-10">
        {/* Events and Announcements Section */}
        <div className="flex flex-col md:flex-col lg:flex-row gap-10 w-full justify-center items-start px-5 mb-16">
          {/* EVENTS CAROUSEL */}
          <div className="carousel-wrapper flex-1 min-w-auto max-w-[680px] w-full flex flex-col">
            <h2 className="flex flex-col items-start mb-6 bg-gradient-to-r from-purple-700 to-cyan-400 bg-clip-text text-transparent">
              <span className="flex items-center gap-2 text-2xl sm:text-xl">
                <span className="text-xl sm:text-xl">🗓️</span>
                <span className="text-xl md:text-2xl font-semibold">
                  {language === "kn" ? "ಮುಂ. ಕಾರ್ಯಕ್ರಮಗಳು" : "Upcoming Events"}
                </span>
              </span>
            </h2>
            {/* Loading / Display events logic */}
            {loading ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-yellow-500/10 rounded-full flex items-center justify-center border-2 border-yellow-500/30">
                  <div className="spinner"></div>
                </div>
                <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
                  Loading events...
                </h2>
              </div>
            ) : events.length === 0 ? (
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
                  No events yet
                </h2>
                <p className="text-amber-200/60">
                  Check back later for upcoming events!
                </p>
              </div>
            ) : (
              <div className="relative w-full bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-md rounded-2xl overflow-hidden border border-blue-500/20 shadow-2xl">
                {/* Event slides */}
                <div className="relative h-[255px] sm:h-[265px]">
                  {events.map((event, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentSlide
                          ? "opacity-100 translate-x-0 z-10"
                          : index < currentSlide
                            ? "opacity-0 -translate-x-full z-0"
                            : "opacity-0 translate-x-full z-0"
                      }`}
                    >
                      <div className="h-full flex flex-col p-6 sm:p-5">
                        <h3 className="text-2xl sm:text-xl font-bold text-white mb-2 line-clamp-2">
                          {event.title_k || event.title}
                        </h3>
                        <div className="space-y-3 mb-3">
                          <div className="flex items-center gap-3 text-cyan-400">
                            <Calendar size={18} />
                            <span className="text-sm font-medium">
                              {event.date}
                            </span>
                          </div>
                          {event.eventTime && (
                            <div className="flex items-center gap-3 text-purple-400">
                              <Clock size={18} />
                              <span className="text-sm font-medium">
                                {event.eventTime}
                              </span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-3 text-pink-400">
                              <MapPin size={18} />
                              <span className="text-sm font-medium line-clamp-1">
                                {event.location}
                              </span>
                            </div>
                          )}
                        </div>
                        <p
                          className="text-gray-300 text-sm leading-relaxed line-clamp-3"
                          style={
                            language === "kn"
                              ? {
                                  fontFamily:
                                    "'Noto Sans Kannada', sans-serif",
                                }
                              : {}
                          }
                        >
                          {event.description_k || event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slide indicators */}
                {events.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {events.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                          index === currentSlide
                            ? "w-8 h-2 bg-blue-500"
                            : "w-2 h-2 bg-gray-500 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* More Info Link */}
            <div className="mt-4 text-center">
              <span
                onClick={() => router.push("/events")}
                className="text-blue-400 hover:text-blue-300 cursor-pointer font-semibold"
              >
                More Info →
              </span>
            </div>
          </div>

          {/* ANNOUNCEMENTS SCROLL */}
          <div className="announcement-panel flex-1 min-w-[300px] max-w-[420px] bg-black/4 border border-yellow-400/10 backdrop-blur-md p-6 sm:p-4 rounded-xl shadow-lg max-h-[500px] flex flex-col transition-all duration-300">
            <h2 className="flex flex-col items-start mb-6 bg-gradient-to-r from-purple-700 to-cyan-400 bg-clip-text text-transparent">
              <span className="flex items-center gap-2 text-2xl sm:text-xl">
                <span className="text-2xl sm:text-xl">📢</span>
                <span className="text-xl md:text-2xl font-semibold">
                  {language === "kn" ? "ಪ್ರಕಟಣೆಗಳು" : "Announcements"}
                </span>
              </span>
            </h2>

            <div className="relative flex-1 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent">
              {loadingAnnouncements ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-6 bg-yellow-500/10 rounded-full flex items-center justify-center border-2 border-yellow-500/30">
                    <div className="spinner"></div>
                  </div>
                  <h2 className="text-lg font-semibold text-yellow-400 mb-2">
                    Loading announcements...
                  </h2>
                </div>
              ) : announcements.length > 0 ? (
                announcements.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/5 p-4 rounded-lg mb-3 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-transform duration-300 border border-white/5"
                  >
                    <h4 className="text-yellow-400 text-lg mb-1 font-semibold">
                      {item.title}
                    </h4>
                    <p
                      className="text-gray-300 text-sm leading-relaxed"
                      style={
                        language === "kn"
                          ? { fontFamily: "'Noto Sans Kannada', sans-serif" }
                          : {}
                      }
                    >
                      {item.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center">
                  No announcements yet.
                </p>
              )}
            </div>

            {/* More Info Link */}
            <div className="mt-4 text-center">
              <span
                onClick={() => router.push("/announcements")}
                className="text-blue-400 hover:text-blue-300 cursor-pointer font-semibold"
              >
                More Info →
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Greatest Kannada Quotes/Lines - HIDDEN ON MOBILE */}
        <div className="hidden md:block w-full px-5 mt-12 relative">
          {/* Decorative Line Above */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-[1px] w-full max-w-[200px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            <div className="text-cyan-400/60 text-2xl">✦</div>
            <div className="h-[1px] w-full max-w-[200px] bg-gradient-to-l from-transparent via-cyan-500/30 to-transparent"></div>
          </div>

          {/* Quotes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
            {quotes.map((quote, idx) => (
              <div
                key={idx}
                className={`group relative bg-gradient-to-br ${quote.bgData} backdrop-blur-sm p-6 rounded-xl border border-${quote.border}-500/20 hover:border-${quote.border}-400/40 transition-all duration-300 hover:scale-105 h-full flex flex-col justify-center`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-${quote.border}-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
                <div className="relative z-10 text-center flex flex-col items-center h-full justify-between">
                  <div className="text-4xl mb-3">{quote.icon}</div>
                  <div
                    className={`text-lg font-bold bg-gradient-to-r ${quote.gradient} bg-clip-text text-transparent mb-3 leading-snug`}
                    style={{ fontFamily: "'Noto Sans Kannada', sans-serif" }}
                  >
                    "{quote.kannada}"
                  </div>
                  <div className="text-sm text-gray-400 font-medium mt-auto border-t border-white/10 pt-2 w-full">
                    {quote.author}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative Pattern at Bottom */}
          <div className="mt-12 mb-8 flex items-center justify-center gap-6 opacity-40">
            <svg
              className="w-8 h-8 text-cyan-400/60 animate-spin-slow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"
              />
            </svg>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            <div className="text-purple-400/60 text-sm tracking-widest">
              {language === "kn"
                ? "ಸಾಹಿತ್ಯ • ಸಂಸ್ಕೃತಿ • ಹೆಮ್ಮೆ"
                : "Literature • Culture • Pride"}
            </div>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent via-purple-500/30 to-transparent"></div>
            <svg
              className="w-8 h-8 text-purple-400/60 animate-spin-slow"
              style={{ animationDirection: "reverse" }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.6;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(234, 179, 8, 0.1);
          border-top-color: rgba(234, 179, 8, 0.8);
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