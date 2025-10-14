import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import bedagu from "./assets/bedagu.jpg";
import alankara from "./assets/alankara.jpg";
import balav from "./assets/balav.webp";
import inchara from "./assets/inchara.jpg";
// import rangataranga from "./assets/rangataranga.jpg";

gsap.registerPlugin(ScrollTrigger);

const teams = [
  {
    team: "ಬೆಡಗು",
    art:"ಸಾಂಸ್ಕೃತಿಕ ನೃತ್ಯ ತಂಡ",
    info: "ಕನ್ನಡ ನಾಡಿನ ಸಂಸ್ಕೃತಿಯ ಬಿತ್ತರಿಸುವ ನೃತ್ಯ ಸಿರಿ, ಧೀಮಂತ ಪರಂಪರೆಗಳ ಒಡಲೊಳು  ಹರಿಯುವ ನಾಟ್ಯ ಝರಿ,  ಜಾನಪದ ನೃತ್ಯಗಳ ಬೆಡಗನ್ನು ಬಿಂಬಿಸುವ ನಾಟ್ಯಗರಿ!",
    image: bedagu,
  },
  {
    team: "ಅಲಂಕಾರ",
    art:"ಫ್ಯಾಷನ್ ತಂಡ",
    info: "ಬಿಂಕು–ಬಿನ್ನಾಣದೊಂದಿಗೆ ನಮ್ಮ ನಾಡಿನ ಸೊಬಗನ್ನು ಮೆರೆಸುವ  ಕಲಾವೃಂದ, ವಿವಿಧ ಶೈಲಿಯ ಉಡುಪು ಧಾರಣೆಯೊಂದಿಗೆ ವೇದಿಕೆಯನ್ನು ಶೃಂಗರಿಸುವ ಕಲಾರವಿಂದ!",
    image: alankara,
  },
  {
    team: "ಬಲವ್",
    art:"ಪಾಶ್ಚಾತ್ಯ ನೃತ್ಯ ತಂಡ",
    info: "ಹುರುಪಿನ ಹೆಜ್ಜೆಗಳೊಂದಿಗೆ ಸಾಂಸ್ಕೃತಿಕ ಲಯವ ಬೆಸೆವ  ಚೈತನ್ಯ ಲಹರಿ , ಉತ್ಸಾಹ ಭರಿತ ಭರ್ಜರಿ ಪ್ರದರ್ಶನಗಳೊಂದಿಗೆ  ತನು ಮನವ ಕುಣಿಸುವ ನಾಟ್ಯಮಂಜರಿ !",
    image: balav,
  },
  {
    team: "ಇಂಚರ",
    art:"ಗಾಯನ ತಂಡ",
    info: "ಗಾಯನದ ಇಂಪಲ್ಲಿ , ಕನ್ನಡದ ಕಂಪನ್ನು ಚೆಲ್ಲುವ ಸವಿಗಾನದಂಗಳ, ಭಾವ ಸ್ವರಗಳನುಲಿದು, ಸಾಹಿತ್ಯಮಾಧುರ್ಯವ ಮೆರೆಸುವ ಸಂಗೀತದಳ!",
    image: inchara,
  },
  {
    team: "ರಂಗತರಂಗ",
    art:"ನಾಟಕ ವೃಂದ",
    info: "ನವರಸವನು ಅರಗಿಸಿಹ ಅಭಿನಯ ಚತುರರ ರಂಗಸಜ್ಜಿಕೆ, ನಟನೆಯಿಂದ ಕಲಾರಸಿಕರ ಮನವ ನಾಟುವ ಕಥಾಶರ ಬತ್ತಳಿಕೆ!",
    image: inchara,
  },
];

export default function CulturalTeams() {
  const cardsRef = useRef([]);
  const titleRef = useRef();

  useEffect(() => {
    // Set initial state
    gsap.set(titleRef.current, { opacity: 0, y: 40 });
    cardsRef.current.forEach((card) => {
      gsap.set(card, { opacity: 0, y: 40 });
    });

    // Animate title
    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Animate cards
    cardsRef.current.forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
      });

      const inner = card.querySelector(".flip-card-inner");

      card.addEventListener("mouseenter", () => {
        gsap.to(inner, { rotateY: 180, duration: 0.3, ease: "power2.inOut" });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(inner, { rotateY: 0, duration: 0.3, ease: "power2.inOut" });
      });
    });
  }, []);

  return (
    <section id="teams" className="relative bg-black text-white py-20 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="purple-glow-spot absolute rounded-full blur-3xl"
            style={{
              width: `${200 + Math.random() * 400}px`,
              height: `${200 + Math.random() * 400}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: `rgba(168, 85, 247, ${0.1 + Math.random() * 0.2})`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <h2
        ref={titleRef}
        className="relative z-10 text-4xl md:text-5xl font-bold text-center mb-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]"
      >
        Our Cultural Teams
      </h2>

      {/* Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {teams.map((team, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="flip-card w-[260px] h-[340px] perspective-[1000px]"
          >
            <div className="flip-card-inner relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] rounded-2xl border border-indigo-400/40 shadow-[0_0_24px_rgba(29,18,183,0.4)]">
              {/* Front */}
              <div
                className="absolute w-full h-full rounded-2xl backface-hidden bg-cover bg-center flex items-end justify-center overflow-hidden"
                style={{ backgroundImage: `url(${team.image.src})` }}
              >
                <div className="w-full bg-gradient-to-t from-black/80 to-transparent p-4 text-center">
                  <h3 className="text-lg font-semibold text-yellow-400">{team.team}</h3>
                </div>
              </div>
              {/* Back */}
              <div className="absolute w-full h-full rounded-2xl backface-hidden bg-gradient-to-br from-black via-purple-950 to-purple-800 p-6 flex flex-col justify-center items-center rotate-y-180">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">{team.art}</h3>
                <p className="text-sm text-gray-300 leading-relaxed text-center" style={{ fontFamily: "'Noto Sans Kannada', sans-serif" }}>{team.info}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}