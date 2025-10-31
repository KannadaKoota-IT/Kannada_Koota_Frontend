import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";

import bedagu from "./assets/bedagu.jpg";
import alankara from "./assets/alankara.jpg";
import balav from "./assets/balav.webp";
import inchara from "./assets/inchara.jpeg";
import ranga from "./assets/ranga.jpg";

gsap.registerPlugin(ScrollTrigger);

const CulturalTeams = () => {
  const { isKannada } = useLanguage();

  const teams = [
    {
      team: isKannada ? "ಬೆಡಗು" : "Bedagu",
      art: isKannada ? "ಸಾಂಸ್ಕೃತಿಕ ನೃತ್ಯ ತಂಡ" : "Cultural Dance Team",
      info: isKannada
        ? "ಕನ್ನಡ ನಾಡಿನ ಸಂಸ್ಕೃತಿಯ ಬಿತ್ತರಿಸುವ ನೃತ್ಯ ಸಿರಿ, ಧೀಮಂತ ಪರಂಪರೆಗಳ ಒಡಲೊಳು ಹರಿಯುವ ನಾಟ್ಯ ಝರಿ, ಜಾನಪದ ನೃತ್ಯಗಳ ಬೆಡಗನ್ನು ಬಿಂಬಿಸುವ ನಾಟ್ಯಗರಿ!"
        : "Bedagu is our vibrant cultural dance team that celebrates the traditional folk dances of Karnataka, bringing our rich heritage to life through movement.",
      image: bedagu,
    },
    {
      team: isKannada ? "ಅಲಂಕಾರ" : "Alankara",
      art: isKannada ? "ಫ್ಯಾಷನ್ ತಂಡ" : "Fashion Team",
      info: isKannada
        ? "ಬಿಂಕು–ಬಿನ್ನಾಣದೊಂದಿಗೆ ನಮ್ಮ ನಾಡಿನ ಸೊಬಗನ್ನು ಮೆರೆಸುವ ಕಲಾವೃಂದ, ವಿವಿಧ ಶೈಲಿಯ ಉಡುಪು ಧಾರಣೆಯೊಂದಿಗೆ ವೇದಿಕೆಯನ್ನು ಶೃಂಗರಿಸುವ ಕಲಾರವಿಂದ!"
        : "Alankara is the fashion and styling squad of the Kannada Club, reflecting regional elegance and contemporary flair through costume and design.",
      image: alankara,
    },
    {
      team: isKannada ? "ಬಲವ್" : "Balav",
      art: isKannada ? "ಪಾಶ್ಚಾತ್ಯ ನೃತ್ಯ ತಂಡ" : "Western Dance Team",
      info: isKannada
        ? "ಹುರುಪಿನ ಹೆಜ್ಜೆಗಳೊಂದಿಗೆ ಸಾಂಸ್ಕೃತಿಕ ಲಯವ ಬೆಸೆವ ಚೈತನ್ಯ ಲಹರಿ, ಉತ್ಸಾಹ ಭರಿತ ಭರ್ಜರಿ ಪ್ರದರ್ಶನಗಳೊಂದಿಗೆ ತನು ಮನವ ಕುಣಿಸುವ ನಾಟ್ಯಮಂಜರಿ!"
        : "Balav is our energetic western dance team that blends contemporary styles with cultural rhythm, adding a dynamic twist to our events.",
      image: balav,
    },
    {
      team: isKannada ? "ಇಂಚರ" : "Inchara",
      art: isKannada ? "ಗಾಯನ ತಂಡ" : "Singing Team",
      info: isKannada
        ? "ಗಾಯನದ ಇಂಪಲ್ಲಿ, ಕನ್ನಡದ ಕಂಪನ್ನು ಚೆಲ್ಲುವ ಸವಿಗಾನದಂಗಳ, ಭಾವ ಸ್ವರಗಳನುಲಿದು, ಸಾಹಿತ್ಯಮಾಧುರ್ಯವ ಮೆರೆಸುವ ಸಂಗೀತದಳ!"
        : "Inchara is the musical team that brings Kannada melodies to life with soul-touching performances and traditional tunes.",
      image: inchara,
    },
    {
      team: isKannada ? "ರಂಗತರಂಗ" : "Rangataranga",
      art: isKannada ? "ನಾಟಕ ವೃಂದ" : "Drama Group",
      info: isKannada
        ? "ನವರಸವನು ಅರಗಿಸಿಹ ಅಭಿನಯ ಚತುರರ ರಂಗಸಜ್ಜಿಕೆ, ನಟನೆಯಿಂದ ಕಲಾರಸಿಕರ ಮನವ ನಾಟುವ ಕಥಾಶರ ಬತ್ತಳಿಕೆ!"
        : "A stage of skilled actors who evoke the nine emotions, captivating the minds of art lovers through performance!",
      image: ranga,
    },
  ];

  const cardsRef = useRef([]);
  const titleRef = useRef();

  const glowConfigs = [
    { width: 350, height: 250, top: 20, left: 10, bgAlpha: 0.18 },
    { width: 400, height: 300, top: 50, left: 70, bgAlpha: 0.22 },
    { width: 280, height: 220, top: 80, left: 30, bgAlpha: 0.16 },
    { width: 450, height: 320, top: 30, left: 80, bgAlpha: 0.2 },
    { width: 320, height: 280, top: 70, left: 50, bgAlpha: 0.19 },
  ];

  useEffect(() => {
    gsap.set(titleRef.current, { opacity: 0, y: 40 });
    cardsRef.current.forEach((card) => gsap.set(card, { opacity: 0, y: 40 }));

    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
    });

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
        gsap.to(inner, { rotateY: 180, duration: 0.3 });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(inner, { rotateY: 0, duration: 0.3 });
      });
    });
  }, []);

  return (
    <section className="relative bg-black text-white py-20 px-6 md:px-12 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {glowConfigs.map((c, i) => (
          <div
            key={i}
            className="purple-glow-spot absolute rounded-full blur-3xl"
            style={{
              width: `${c.width}px`,
              height: `${c.height}px`,
              top: `${c.top}%`,
              left: `${c.left}%`,
              backgroundColor: `rgba(168,85,247,${c.bgAlpha})`,
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

      {/* Cards Layout */}
      <div className="relative z-10 flex flex-wrap justify-center gap-10">
        {teams.map((team, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="flip-card w-[90%] sm:w-[320px] md:w-[280px] lg:w-[260px] h-[360px] perspective-[1000px]"
          >
            <div className="flip-card-inner relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] rounded-2xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105">
              {/* Front */}
              <div
                className="absolute w-full h-full rounded-2xl backface-hidden bg-cover bg-center flex items-end justify-center overflow-hidden"
                style={{
                  backgroundImage: `url(${team.image.src})`,
                }}
              >
                <div className="w-full bg-gradient-to-t from-black/80 to-transparent p-4 text-center">
                  <h3 className="text-lg font-semibold text-yellow-400">
                    {team.team}
                  </h3>
                </div>
              </div>

              {/* Back */}
              <div className="absolute w-full h-full rounded-2xl backface-hidden bg-gradient-to-br from-black via-purple-950 to-purple-800 p-5 flex flex-col justify-center items-center rotate-y-180">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  {team.art}
                </h3>
                <p
                  className="text-sm text-gray-300 leading-relaxed text-center"
                  style={{ fontFamily: "'Noto Sans Kannada', sans-serif" }}
                >
                  {team.info}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Center the rows manually for 3+2 layout */}
      <style jsx>{`
        @media (min-width: 768px) {
          #teams .flip-card:nth-child(1),
          #teams .flip-card:nth-child(2),
          #teams .flip-card:nth-child(3) {
            margin-bottom: 2.5rem;
          }
          #teams .flip-card:nth-child(4),
          #teams .flip-card:nth-child(5) {
            margin-left: 5rem;
            margin-right: 5rem;
          }
        }
        @media (min-width: 1024px) {
          #teams .flip-card:nth-child(4),
          #teams .flip-card:nth-child(5) {
            margin-left: 6rem;
            margin-right: 6rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CulturalTeams;
