import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";

import bedagu from "./assets/bedagu.jpg";
import alankara from "./assets/alankara.jpg";
import balav from "./assets/balav.webp";
import inchara from "./assets/inchara.jpg";
import ranga from "./assets/ranga.jpg"

gsap.registerPlugin(ScrollTrigger);

const CulturalTeams = () => {
  const { isKannada } = useLanguage();

  const teams = [
    {
      team: isKannada ? "ಬೆಡಗು" : "Bedagu",
      art: isKannada ? "ಸಾಂಸ್ಕೃತಿಕ ನೃತ್ಯ ತಂಡ" : "Cultural Dance Team",
      info: isKannada ? "ಕನ್ನಡ ನಾಡಿನ ಸಂಸ್ಕೃತಿಯ ಬಿತ್ತರಿಸುವ ನೃತ್ಯ ಸಿರಿ, ಧೀಮಂತ ಪರಂಪರೆಗಳ ಒಡಲೊಳು  ಹರಿಯುವ ನಾಟ್ಯ ಝರಿ,  ಜಾನಪದ ನೃತ್ಯಗಳ ಬೆಡಗನ್ನು ಬಿಂಬಿಸುವ ನಾಟ್ಯಗರಿ!" : "Bedagu is our vibrant cultural dance team that celebrates the traditional folk dances of Karnataka, bringing our rich heritage to life through movement.",
      image: bedagu,
    },
    {
      team: isKannada ? "ಅಲಂಕಾರ" : "Alankara",
      art: isKannada ? "ಫ್ಯಾಷನ್ ತಂಡ" : "Fashion Team",
      info: isKannada ? "ಬಿಂಕು–ಬಿನ್ನಾಣದೊಂದಿಗೆ ನಮ್ಮ ನಾಡಿನ ಸೊಬಗನ್ನು ಮೆರೆಸುವ  ಕಲಾವೃಂದ, ವಿವಿಧ ಶೈಲಿಯ ಉಡುಪು ಧಾರಣೆಯೊಂದಿಗೆ ವೇದಿಕೆಯನ್ನು ಶೃಂಗರಿಸುವ ಕಲಾರವಿಂದ!" : "Alankara is the fashion and styling squad of the Kannada Club, reflecting regional elegance and contemporary flair through costume and design.",
      image: alankara,
    },
    {
      team: isKannada ? "ಬಲವ್" : "Balav",
      art: isKannada ? "ಪಾಶ್ಚಾತ್ಯ ನೃತ್ಯ ತಂಡ" : "Western Dance Team",
      info: isKannada ? "ಹುರುಪಿನ ಹೆಜ್ಜೆಗಳೊಂದಿಗೆ ಸಾಂಸ್ಕೃತಿಕ ಲಯವ ಬೆಸೆವ  ಚೈತನ್ಯ ಲಹರಿ , ಉತ್ಸಾಹ ಭರಿತ ಭರ್ಜರಿ ಪ್ರದರ್ಶನಗಳೊಂದಿಗೆ  ತನು ಮನವ ಕುಣಿಸುವ ನಾಟ್ಯಮಂಜರಿ !" : "Balav is our energetic western dance team that blends contemporary styles with cultural rhythm, adding a dynamic twist to our events.",
      image: balav,
    },
    {
      team: isKannada ? "ಇಂಚರ" : "Inchara",
      art: isKannada ? "ಗಾಯನ ತಂಡ" : "Singing Team",
      info: isKannada ? "ಗಾಯನದ ಇಂಪಲ್ಲಿ , ಕನ್ನಡದ ಕಂಪನ್ನು ಚೆಲ್ಲುವ ಸವಿಗಾನದಂಗಳ, ಭಾವ ಸ್ವರಗಳನುಲಿದು, ಸಾಹಿತ್ಯಮಾಧುರ್ಯವ ಮೆರೆಸುವ ಸಂಗೀತದಳ!" : "Inchara is the musical team that brings Kannada melodies to life with soul-touching performances and traditional tunes.",
      image: inchara,
    },
    {
      team: isKannada ? "ರಂಗತರಂಗ" : "Rangataranga",
      art: isKannada ? "ನಾಟಕ ವೃಂದ" : "Drama Group",
      info: isKannada ? "ನವರಸವನು ಅರಗಿಸಿಹ ಅಭಿನಯ ಚತುರರ ರಂಗಸಜ್ಜಿಕೆ, ನಟನೆಯಿಂದ ಕಲಾರಸಿಕರ ಮನವ ನಾಟುವ ಕಥಾಶರ ಬತ್ತಳಿಕೆ!" : "A stage of skilled actors who evoke the nine emotions, that captivates the minds of art lovers through acting!",
      image: ranga,
    },
  ];
  const cardsRef = useRef([]);
  const titleRef = useRef();

  // Fixed glow configurations to prevent hydration mismatch
  const glowConfigs = [
    { width: 350, height: 250, top: 20, left: 10, bgAlpha: 0.18 },
    { width: 400, height: 300, top: 50, left: 70, bgAlpha: 0.22 },
    { width: 280, height: 220, top: 80, left: 30, bgAlpha: 0.16 },
    { width: 450, height: 320, top: 30, left: 80, bgAlpha: 0.20 },
    { width: 320, height: 280, top: 70, left: 50, bgAlpha: 0.19 },
    { width: 380, height: 260, top: 10, left: 40, bgAlpha: 0.17 },
  ];

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

    const glows = document.querySelectorAll(".purple-glow-spot");
    glows.forEach((glow, i) => {
      const config = glowConfigs[i];
      const xOffset = (Math.random() - 0.5) * 30;
      const yOffset = (Math.random() - 0.5) * 30;

      gsap.to(glow, {
        x: xOffset + "%",
        y: yOffset + "%",
        backgroundColor: `rgba(168, 85, 247, ${config.bgAlpha + Math.random() * 0.05})`,
        scale: 1 + Math.random() * 0.3,
        repeat: -1,
        yoyo: true,
        duration: 5 + Math.random() * 5,
        ease: "sine.inOut",
      });
    });
  }, []);

  return (
    <section id="teams" className="relative bg-black text-white py-20 px-6 md:px-12 overflow-hidden">
      {/* /* Background Purple Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {glowConfigs.map((config, i) => (
          <div
            key={i}
            className="purple-glow-spot absolute rounded-full blur-3xl"
            style={{
              width: `${config.width}px`,
              height: `${config.height}px`,
              top: `${config.top}%`,
              left: `${config.left}%`,
              backgroundColor: `rgba(168, 85, 247, ${config.bgAlpha})`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <h2
        ref={titleRef}
        className="relative z-10 text-4xl md:text-5xl font-bold text-center mb-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]"
      >
        {isKannada ? "ನಮ್ಮ ಸಾಂಸ್ಕೃತಿಕ ತಂಡಗಳು" : "Our Cultural Teams"}
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
};

export default CulturalTeams;
