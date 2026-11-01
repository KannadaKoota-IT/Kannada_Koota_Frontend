import React from "react";
import Link from "next/link";
import { MapPin, Mail, Phone, ExternalLink, Heart } from "lucide-react";
import { FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import { useMembership } from "../../context/MembershipContext";

export default function Footer() {
  const { isKannada } = useLanguage();
  const { whatsappUrl } = useMembership();

  return (
    <footer
      id="footer"
      className="mt-20 border-t border-[#EFEBE4] bg-[#1A1A1A] text-white"
    >
      {/* 2px Gold-to-Crimson Highlight Line */}
      <div className="h-1.5 w-full gold-crimson-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#F5B000]/60 flex items-center justify-center relative shadow-sm">
                <div className="absolute inset-0 grid grid-rows-2">
                  <div className="bg-[#F5B000]" />
                  <div className="bg-[#C4151C]" />
                </div>
                <span className="relative z-10 font-bold text-[#8A0E14] text-base font-serif bg-white/90 w-7 h-7 rounded-lg flex items-center justify-center">
                  ಕೃ
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold font-kannada leading-tight text-white">
                  ಕನ್ನಡ ಕೂಟ • PES University
                </h3>
                <p className="text-xs text-stone-400">
                  Techno-Cultural Club & Literary Association
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {isKannada
                ? "ಪಿ.ಇ.ಎಸ್ ವಿಶ್ವವಿದ್ಯಾಲಯದಲ್ಲಿ ಕರುನಾಡ ಕಲೆ-ಸಂಸ್ಕೃತಿಯ ಹೆಜ್ಜೆಯೊಡನೆ ತಾಂತ್ರಿಕತೆಯ ಕೊಂಡಿ ಬೆಸೆಯುವ ಹಂಬಲದ ಮನಸುಗಳಿಗೆ ಸದಾ ತೆರೆದ ಬಾಗಿಲು ನಮ್ಮೀ ಕನ್ನಡ ಕೂಟ."
                : "Promoting harmony through language, literature, and living heritage. We celebrate and preserve Karnataka's culture at PES University, inspiring pride in the next generation."}
            </p>

            {/* Cultural Motto Banner */}
            <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-3">
              <span className="text-[#F5B000] text-lg font-bold font-serif">
                ❝
              </span>
              <div>
                <div className="text-sm font-bold font-kannada text-[#F5B000]">
                  ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ
                </div>
                <div className="text-[11px] text-stone-400">
                  "May the glorious Kannada language triumph and thrive!"
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/kannadakoota_pesu"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-[#C4151C] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@KannadaKootaPESU"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-[#C4151C] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-emerald-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs uppercase font-bold tracking-wider text-[#F5B000]">
              ವಿಭಾಗಗಳು (Quick Navigation)
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#F5B000] transition-colors flex items-center gap-1.5"
                >
                  <span>ಮುಖಪುಟ (Home)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-[#F5B000] transition-colors flex items-center gap-1.5"
                >
                  <span>ಕಾರ್ಯಕ್ರಮಗಳು (Events)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/announcements"
                  className="hover:text-[#F5B000] transition-colors flex items-center gap-1.5"
                >
                  <span>ಪ್ರಕಟಣೆಗಳು (Announcements)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/teams"
                  className="hover:text-[#F5B000] transition-colors flex items-center gap-1.5"
                >
                  <span>ಮುಂದಾಳುಗಳು (Teams)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-[#F5B000] transition-colors flex items-center gap-1.5"
                >
                  <span>ಚಿತ್ರಸಂಗ್ರಹ (Gallery)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Location & Contact (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs uppercase font-bold tracking-wider text-[#F5B000]">
              ಸಂಪರ್ಕ & ವಿಳಾಸ (Campus Contact)
            </div>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C4151C] shrink-0 mt-0.5" />
                <span>
                  Student Activities Center (SAC), PES University, 100 Feet Ring
                  Road, BSK III Stage, Bengaluru - 560085
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F5B000] shrink-0" />
                <a
                  href="mailto:kannadakoota.pesu@gmail.com"
                  className="font-mono hover:text-[#F5B000]"
                >
                  kannadakoota.pesu@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F5B000] shrink-0" />
                <span>+91 94812 34509 / PESU Campus Ext</span>
              </div>
            </div>

            <div className="pt-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full gold-gradient text-[#1A1A1A] font-bold text-xs py-2.5 px-4 rounded-lg shadow-sm hover:opacity-95 transition-opacity cursor-pointer block text-center"
              >
                ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ / Join Community
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 mt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <div>
            © {new Date().getFullYear()} PES University Kannada Koota. All
            rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-stone-400">
            <span>Crafted with pride for</span>
            <span className="text-[#C4151C] font-semibold font-kannada">
              ಕನ್ನಡ
            </span>
            <span>& cultural youth at PESU</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
