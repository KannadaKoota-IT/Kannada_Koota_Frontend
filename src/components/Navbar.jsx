import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Sparkles,
  Calendar,
  Bell,
  Users,
  Image,
  Menu,
  X,
  Globe,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useMembership } from "../context/MembershipContext";

export default function Navbar() {
  const router = useRouter();
  const { language, toggleLanguage, isKannada } = useLanguage();
  const { whatsappUrl } = useMembership();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  // States for dynamic rotating ribbon
  const [updatesQueue, setUpdatesQueue] = useState([]);
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 1. Fetch Data for the Ribbon
  useEffect(() => {
    let isMounted = true;

    const fetchLatestInfo = async () => {
      try {
        // Fetch both announcements and events concurrently
        const [annRes, evtRes] = await Promise.all([
          fetch(`${API_BASE}/api/announcements?lang=${language}`),
          fetch(`${API_BASE}/api/events?lang=${language}`),
        ]);

        const annData = await annRes.json();
        const evtData = await evtRes.json();

        let combinedUpdates = [];

        // Add top 3 latest announcements to queue
        if (annData?.success && Array.isArray(annData.announcements)) {
          const recentAnns = annData.announcements.slice(0, 3).map((a) => ({
            id: `ann-${a._id}`,
            title: a.title,
            title_k: a.title_k,
            tag: "New Update",
            tag_k: "ಹೊಸ ಪ್ರಕಟಣೆ",
            link: "/announcements",
          }));
          combinedUpdates = [...combinedUpdates, ...recentAnns];
        }

        // Add next 3 upcoming events to queue
        if (Array.isArray(evtData)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const upcomingEvts = evtData
            .filter((e) => new Date(e.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3)
            .map((e) => ({
              id: `evt-${e._id}`,
              title: e.title,
              title_k: e.title_k,
              tag: "Upcoming Event",
              tag_k: "ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮ",
              link: "/events",
            }));
          combinedUpdates = [...combinedUpdates, ...upcomingEvts];
        }

        if (isMounted) {
          setUpdatesQueue(combinedUpdates);
        }
      } catch (err) {
        console.error("Failed to fetch latest updates for ribbon:", err);
      }
    };

    fetchLatestInfo();

    return () => {
      isMounted = false;
    };
  }, [language, API_BASE]);

  // 2. Rotate the Queue every 4.5 seconds
  useEffect(() => {
    if (updatesQueue.length <= 1 || announcementDismissed) return;

    const timer = setInterval(() => {
      setCurrentUpdateIndex(
        (prevIndex) => (prevIndex + 1) % updatesQueue.length,
      );
    }, 4500);

    return () => clearInterval(timer);
  }, [updatesQueue.length, announcementDismissed]);

  const navItems = [
    {
      to: "/",
      labelKannada: "ಮುಖಪುಟ",
      labelEnglish: "Home",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      to: "/events",
      labelKannada: "ಕಾರ್ಯಕ್ರಮಗಳು",
      labelEnglish: "Events",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      to: "/announcements",
      labelKannada: "ಪ್ರಕಟಣೆಗಳು",
      labelEnglish: "Announcements",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      to: "/teams",
      labelKannada: "ಮುಂದಾಳುಗಳು",
      labelEnglish: "Teams",
      icon: <Users className="w-4 h-4" />,
    },
    {
      to: "/gallery",
      labelKannada: "ಚಿತ್ರಸಂಗ್ರಹ",
      labelEnglish: "Gallery",
      icon: <Image className="w-4 h-4" />,
    },
  ];

  const isActive = (path) => {
    if (path === "/") return router.pathname === "/";
    return router.pathname.startsWith(path);
  };

  const currentUpdate = updatesQueue[currentUpdateIndex];

  return (
    <header className="sticky top-0 z-40 bg-[#FCF9F8]/95 backdrop-blur-md border-b border-[#EFEBE4] transition-all">
      {/* Top dynamic micro-ribbon */}
      {!announcementDismissed && currentUpdate && (
        <div className="gold-crimson-bar text-white px-4 py-1.5 text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs overflow-hidden">
          {/* Key on the div forces a re-render for the animation to trigger smoothly on rotation */}
          <div
            key={currentUpdate.id}
            className="flex items-center gap-2 mx-auto truncate text-center font-semibold animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] uppercase tracking-wider font-bold shrink-0">
              {isKannada ? currentUpdate.tag_k : currentUpdate.tag}
            </span>
            <span className="truncate font-kannada">
              {isKannada
                ? currentUpdate.title_k || currentUpdate.title
                : currentUpdate.title || currentUpdate.title_k}
            </span>
            <Link
              href={currentUpdate.link}
              className="underline hover:text-amber-100 ml-1 cursor-pointer font-bold shrink-0"
            >
              {isKannada ? "ವೀಕ್ಷಿಸಿ" : "View"} &rarr;
            </Link>
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="text-white/80 hover:text-white p-0.5 cursor-pointer shrink-0 ml-2"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-3.5 cursor-pointer group select-none py-1"
          >
            {/* Brand Logo */}
            <img
              src="/logo.png"
              alt="Kannada Koota Logo"
              className="w-12 h-12 shadow-sm border border-[#E5BDB9] group-hover:scale-105 transition-transform duration-200 shrink-0 object-cover"
              style={{ borderRadius: "50%" }}
            />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1B1B] font-kannada leading-tight group-hover:text-[#9B000E] transition-colors">
                  ಕನ್ನಡ ಕೂಟ
                </h1>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F6F3F2] p-1.5 rounded-xl border border-[#EFEBE4]">
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-[#9B000E] text-white shadow-xs"
                      : "text-[#1C1B1B] hover:text-[#9B000E] hover:bg-white/70"
                  }`}
                >
                  {item.icon}
                  <span className="font-kannada">
                    {isKannada ? item.labelKannada : item.labelEnglish}
                  </span>
                  <span
                    className={`text-[11px] opacity-75 font-normal ${
                      active ? "text-white/90" : "text-[#5C403D]"
                    }`}
                  >
                    ({isKannada ? item.labelEnglish : item.labelKannada})
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Language Switcher + Join CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#EFEBE4] bg-white hover:bg-[#F6F3F2] text-xs font-semibold text-[#1C1B1B] transition-colors cursor-pointer"
              title="Switch Language / ಭಾಷೆ ಬದಲಿಸಿ"
            >
              <Globe className="w-3.5 h-3.5 text-[#9B000E]" />
              <span>{language === "kn" ? "English" : "ಕನ್ನಡ"}</span>
            </button>

            {/* Community CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="crimson-gradient hover:opacity-95 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-4 h-4 text-[#FFD6D2]" />
              <span className="font-kannada">ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ</span>
              <span className="text-xs text-white/80 font-normal">
                / Join Community
              </span>
            </a>
          </div>

          {/* Mobile Actions (Language + Drawer Toggle) */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1.5 rounded-lg border border-[#EFEBE4] bg-white text-xs font-semibold text-[#1C1B1B]"
            >
              {language === "kn" ? "EN" : "ಕನ್ನ"}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#9B000E] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 sm:hidden"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Join Community</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1C1B1B] hover:bg-[#F0EDED] border border-[#EFEBE4]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Off-Canvas Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EFEBE4] bg-[#FCF9F8] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                href={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                  active
                    ? "bg-[#9B000E] text-white shadow-xs"
                    : "text-[#1C1B1B] hover:bg-[#F6F3F2]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-kannada text-lg">
                    {item.labelKannada}
                  </span>
                  <span
                    className={`text-xs ${
                      active ? "text-white/80" : "text-[#5C403D]"
                    }`}
                  >
                    • {item.labelEnglish}
                  </span>
                </div>
                {active && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                    Active
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-[#EFEBE4] space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full crimson-gradient text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-5 h-5 text-[#FFD6D2]" />
              <span className="font-kannada text-base">
                ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ / Join Community
              </span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
