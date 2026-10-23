import React from "react";
import { Sparkles, Users } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

import bedagu from "./assets/bedagu.jpg";
import alankara from "./assets/alankara.jpg";
import balav from "./assets/balav.webp";
import inchara from "./assets/inchara.jpg";
import ranga from "./assets/ranga.jpg";

export default function CulturalTeams() {
  const { isKannada } = useLanguage();

  const teams = [
    {
      team: isKannada ? "ಬೆಡಗು" : "Bedagu",
      art: isKannada ? "ಸಾಂಸ್ಕೃತಿಕ ನೃತ್ಯ ತಂಡ" : "Cultural Folk Dance",
      tag: "TRADITION",
      info: isKannada
        ? "ಕನ್ನಡ ನಾಡಿನ ಸಂಸ್ಕೃತಿಯ ಬಿತ್ತರಿಸುವ ನೃತ್ಯ ಸಿರಿ, ಧೀಮಂತ ಪರಂಪರೆಗಳ ಒಡಲೊಳು ಹರಿಯುವ ನಾಟ್ಯ ಝರಿ, ಜಾನಪದ ನೃತ್ಯಗಳ ಬೆಡಗನ್ನು ಬಿಂಬಿಸುವ ನಾಟ್ಯಗರಿ!"
        : "Bedagu celebrates the traditional folk dances of Karnataka (Veeragase, Dollu Kunitha, Yakshagana), bringing vibrant heritage to stage.",
      image: bedagu,
    },
    {
      team: isKannada ? "ಅಲಂಕಾರ" : "Alankara",
      art: isKannada ? "ಫ್ಯಾಷನ್ ತಂಡ" : "Ethnic Fashion & Styling",
      tag: "FASHION",
      info: isKannada
        ? "ಬಿಂಕ–ಬಿನ್ನಾಣದೊಂದಿಗೆ ನಮ್ಮ ನಾಡಿನ ಸೊಬಗನ್ನು ಮೆರೆಸುವ ಕಲಾವೃಂದ, ವಿವಿಧ ಶೈಲಿಯ ಉಡುಪು ಧಾರಣೆಯೊಂದಿಗೆ ವೇದಿಕೆಯನ್ನು ಶೃಂಗರಿಸುವ ಕಲಾರವಿಂದ!"
        : "Alankara is the styling and traditional attire squad reflecting regional elegance, handlooms, and contemporary aesthetics.",
      image: alankara,
    },
    {
      team: isKannada ? "ಬಲವ್" : "Balav",
      art: isKannada ? "ಪಾಶ್ಚಾತ್ಯ ನೃತ್ಯ ತಂಡ" : "Western & Fusion Dance",
      tag: "FUSION",
      info: isKannada
        ? "ಹುರುಪಿನ ಹೆಜ್ಜೆಗಳೊಂದಿಗೆ ಸಾಂಸ್ಕೃತಿಕ ಲಯವ ಬೆಸೆವ ಚೈತನ್ಯ ಲಹರಿ, ಉತ್ಸಾಹ ಭರಿತ ಭರ್ಜರಿ ಪ್ರದರ್ಶನಗಳೊಂದಿಗೆ ತನು ಮನವ ಕುಣಿಸುವ ನಾಟ್ಯಮಂಜರಿ!"
        : "Balav blends contemporary hip-hop and lyrical styles with Kannada musical rhythms, adding an energetic youth spark to our festivals.",
      image: balav,
    },
    {
      team: isKannada ? "ಇಂಚರ" : "Inchara",
      art: isKannada ? "ಗಾಯನ ತಂಡ" : "Music & Classical Vocal",
      tag: "VOCALS",
      info: isKannada
        ? "ಗಾಯನದ ಇಂಪಲ್ಲಿ, ಕನ್ನಡದ ಕಂಪನ್ನು ಚೆಲ್ಲುವ ಸವಿಗಾನದಂಗಳ, ಭಾವ ಸ್ವರಗಳನುಲಿದು, ಸಾಹಿತ್ಯಮಾಧುರ್ಯವ ಮೆರೆಸುವ ಸಂಗೀತದಳ!"
        : "Inchara brings soul-touching Bhavageethe, classical Karnatak melodies, and modern Kannada retro compositions to stage.",
      image: inchara,
    },
    {
      team: isKannada ? "ರಂಗತರಂಗ" : "Rangataranga",
      art: isKannada ? "ನಾಟಕ ವೃಂದ" : "Theatre & Drama Ensemble",
      tag: "THEATRE",
      info: isKannada
        ? "ನವರಸವನು ಅರಗಿಸಿಹ ಅಭಿನಯ ಚತುರರ ರಂಗಸಜ್ಜಿಕೆ, ನಟನೆಯಿಂದ ಕಲಾರಸಿಕರ ಮನವ ನಾಟುವ ಕಥಾಶರ ಬತ್ತಳಿಕೆ!"
        : "Our award-winning theatre team brings legendary Kannada plays, street plays, and original social satire to life with passionate acting.",
      image: ranga,
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-[#EFEBE4]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E1] text-[#7C5800] border border-[#F5B000]/40 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#C4151C]" />
          <span className="font-kannada">ಕಲಾ ವಿಭಾಗಗಳು • ARTISTIC WINGS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1B1B] font-kannada">
          {isKannada
            ? "ನಮ್ಮ ಸಾಂಸ್ಕೃತಿಕ ಕಲಾ ತಂಡಗಳು"
            : "The Cultural Wings of Kannada Koota"}
        </h2>
        <p className="text-xs sm:text-sm text-[#5C403D]">
          Five powerhouse artistic wings driving every performance, audition,
          and campus fest.
        </p>
      </div>

      {/* Grid of Wings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((item, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 hover:elevation-2 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top gradient highlight bar */}
            <div className="h-0.5 w-full bg-transparent group-hover:gold-crimson-bar transition-all duration-300" />

            <div>
              {/* Image Preview Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-[#F6F3F2]">
                <img
                  src={item.image.src || item.image}
                  alt={item.team}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Floating Tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-white/95 text-[#1C1B1B] shadow-xs backdrop-blur-xs uppercase">
                    {item.tag}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-xl font-bold font-kannada leading-tight">
                    {item.team}
                  </div>
                  <div className="text-xs text-amber-200 font-medium">
                    {item.art}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2">
                <p className="text-xs sm:text-sm text-[#5C403D] leading-relaxed">
                  {item.info}
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 py-3 bg-[#FCF9F8] border-t border-[#EFEBE4] flex items-center justify-between text-xs text-[#9B000E] font-semibold">
              <span className="font-kannada">ಕನ್ನಡ ಕೂಟ ವಿಭಾಗ</span>
              <span>PES University SAC</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
