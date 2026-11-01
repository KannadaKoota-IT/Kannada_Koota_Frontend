import React from "react";
import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  Compass,
  Sparkles,
  Bell,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function HeroSection({ announcements = [] }) {
  const { isKannada } = useLanguage();
  const latestNotice =
    announcements && announcements.length > 0 ? announcements[0] : null;

  return (
    <section className="relative overflow-hidden bg-white border border-[#EFEBE4] rounded-2xl elevation-1 transition-all mt-4">
      {/* 2px Gold-to-Crimson Highlight Line */}
      <div className="h-1.5 w-full gold-crimson-bar" />

      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tag Badge & Notice Ticker */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF8E1] border border-[#F5B000]/50 text-[#7C5800] text-xs sm:text-sm font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#C4151C] animate-pulse" />
                <span className="font-kannada">
                  ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ ಸಂಭ್ರಮ 2026
                </span>
                <span className="text-[#916F6B]">•</span>
                <span className="text-xs uppercase tracking-wider text-[#5C403D]">
                  PES University
                </span>
              </div>

              {latestNotice && (
                <Link
                  href="/announcements"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white hover:bg-[#F6F3F2] border border-[#EFEBE4] text-[#1C1B1B] text-xs transition-colors shadow-xs group"
                >
                  <Bell className="w-3.5 h-3.5 text-[#9B000E]" />
                  <span className="font-bold text-[#9B000E] font-kannada">
                    ಪ್ರಕಟಣೆ:
                  </span>
                  <span className="truncate max-w-[180px] sm:max-w-[260px] font-medium text-[#5C403D] group-hover:text-[#1C1B1B]">
                    {latestNotice.title}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#916F6B] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>

            {/* Bilingual Display Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1B1B] font-kannada leading-[1.25] tracking-tight">
                {isKannada ? (
                  <>
                    ಕಲೆಯ ಕಣಜ, ಸಾಹಿತ್ಯದ ತೇರು —{" "}
                    <span className="text-[#9B000E]">ನಮ್ಮ ಕನ್ನಡ ಕೂಟ</span>
                  </>
                ) : (
                  <>
                    Celebrating Heritage & Innovation —{" "}
                    <span className="text-[#9B000E]">Kannada Koota</span>
                  </>
                )}
              </h1>
              <p className="text-base sm:text-lg text-[#5C403D] max-w-2xl leading-relaxed">
                {isKannada
                  ? "ಪಿ.ಇ.ಎಸ್ ವಿಶ್ವವಿದ್ಯಾಲಯದಲ್ಲಿ ಕರುನಾಡ ಕಲೆ-ಸಂಸ್ಕೃತಿಯ ಹೆಜ್ಜೆಯೊಡನೆ ತಾಂತ್ರಿಕತೆಯ ಕೊಂಡಿ ಬೆಸೆಯುವ ಹಂಬಲದ ಮನಸುಗಳಿಗೆ ಸದಾ ತೆರೆದ ಬಾಗಿಲು ನಮ್ಮೀ ಕನ್ನಡ ಕೂಟ 💛❤️."
                  : "PES University's premier techno-cultural hub empowering youth through contemporary theatre, classical melodies, folk traditions, literature, and living heritage."}
              </p>
              <div className="inline-block border-l-4 border-[#F5B000] pl-4 py-1 font-kannada italic text-base sm:text-lg font-bold text-[#7C5800]">
                “ಅಳಿಯದೀ ಕನ್ನಡಂ, ಅಳುಕದೀ ಕನ್ನಡಂ”
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/events"
                className="crimson-gradient hover:opacity-95 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer group active:scale-98"
              >
                <Calendar className="w-4 h-4 text-white/90" />
                <span className="font-kannada text-base">ಕಾರ್ಯಕ್ರಮಗಳು</span>
                <span className="text-xs text-white/80 font-normal">
                  / Explore Events
                </span>
                <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#blogs"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("blogs");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/#blogs";
                  }
                }}
                className="gold-gradient hover:opacity-95 text-[#1C1B1B] font-semibold px-5 py-3 rounded-lg border border-[#F5B000]/60 shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <BookOpen className="w-4 h-4 text-[#7C5800]" />
                <span className="font-kannada text-base">ಲೇಖನಗಳು</span>
                <span className="text-xs text-[#5C403D] font-normal">
                  / Blogs
                </span>
              </a>

              <Link
                href="/announcements"
                className="bg-[#FCF9F8] hover:bg-[#F6F3F2] text-[#1C1B1B] font-semibold px-4 py-3 rounded-lg border border-[#EFEBE4] transition-all flex items-center gap-2 cursor-pointer text-sm"
              >
                <Bell className="w-4 h-4 text-[#9B000E]" />
                <span className="font-kannada">ಪ್ರಕಟಣೆಗಳು</span>
                <span className="text-xs text-[#5C403D]">/ Notice Board</span>
              </Link>
            </div>

            {/* Stat Counters Row */}
            <div className="pt-6 border-t border-[#EFEBE4] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-bold text-[#9B000E] font-serif">
                  300+
                </div>
                <div className="text-xs font-semibold text-[#1C1B1B] font-kannada">
                  ಸಕ್ರಿಯ ಸದಸ್ಯರು
                </div>
                <div className="text-[11px] text-[#5C403D]">Active Members</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-bold text-[#7C5800] font-serif">
                  15+
                </div>
                <div className="text-xs font-semibold text-[#1C1B1B] font-kannada">
                  ವಾರ್ಷಿಕ ಕಾರ್ಯಕ್ರಮ
                </div>
                <div className="text-[11px] text-[#5C403D]">
                  Annual Stage Events
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-bold text-[#9B000E] font-serif">
                  5
                </div>
                <div className="text-xs font-semibold text-[#1C1B1B] font-kannada">
                  ಸಾಂಸ್ಕೃತಿಕ ತಂಡಗಳು
                </div>
                <div className="text-[11px] text-[#5C403D]">Cultural Wings</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-bold text-[#7C5800] font-serif">
                  10+
                </div>
                <div className="text-xs font-semibold text-[#1C1B1B] font-kannada">
                  ನಾಟಕ & ರಂಗಪ್ರಯೋಗ
                </div>
                <div className="text-[11px] text-[#5C403D]">
                  Stage Productions
                </div>
              </div>
            </div>
          </div>

          {/* Right Unified Identity Feature */}
          <div className="lg:col-span-4 relative flex items-center justify-center py-6 lg:py-0">
            <div className="relative w-full max-w-[26rem] aspect-square bg-gradient-to-br from-[#FFF8E1]/30 to-[#FCF9F8] rounded-3xl border border-[#EFEBE4] shadow-lg flex items-center justify-center p-4 overflow-hidden">
              <img
                src="/logo_combo.png"
                alt="PES University and Kannada Koota"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
