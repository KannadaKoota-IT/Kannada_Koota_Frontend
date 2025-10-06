import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import bedagu from "./assets/bedagu.jpg";
import alankara from "./assets/alankara.jpg";
import balav from "./assets/balav.webp";
import inchara from "./assets/inchara.jpg";

gsap.registerPlugin(ScrollTrigger);

const teams = [
  {
    team: "Bedagu",
    info: "Bedagu is our vibrant cultural dance team that celebrates the traditional folk dances of Karnataka, bringing our rich heritage to life through movement.",
    image: bedagu,
  },
  {
    team: "Alankara",
    info: "Alankara is the fashion and styling squad of the Kannada Club, reflecting regional elegance and contemporary flair through costume and design.",
    image: alankara,
  },
  {
    team: "Balav",
    info: "Balav is our energetic western dance team that blends contemporary styles with cultural rhythm, adding a dynamic twist to our events.",
    image: balav,
  },
  {
    team: "Inchara",
    info: "Inchara is the musical team that brings Kannada melodies to life with soul-touching performances and traditional tunes.",
    image: inchara,
  },
];

export default function CulturalTeams() {
  const cardsRef = useRef([]);
  const titleRef = useRef();

  useEffect(() => {
    // Animate title
    gsap.from(titleRef.current, {
      scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out",
    });

    // Animate cards
    cardsRef.current.forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 90%" },
      });

      const inner = card.querySelector(".flip-card-inner");

      card.addEventListener("mouseenter", () => {
        gsap.to(inner, { rotateY: 180, duration: 0.3, ease: "power2.inOut" });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(inner, { rotateY: 0, duration: 0.3, ease: "power2.inOut" });
      });
    });

    // Purple glow spots animation
    const glows = document.querySelectorAll(".purple-glow-spot");
    glows.forEach((glow) => {
      const xOffset = (Math.random() - 0.5) * 30;
      const yOffset = (Math.random() - 0.5) * 30;

      gsap.to(glow, {
        x: xOffset + "%",
        y: yOffset + "%",
        backgroundColor: `rgba(168, 85, 247, ${0.15 + Math.random() * 0.15})`,
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
      {/* Background Purple Glows */}
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
        className="relative z-10 text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]"
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
                style={{ backgroundImage: `url(${team.image})` }}
              >
                <div className="w-full bg-gradient-to-t from-black/80 to-transparent p-4 text-center">
                  <h3 className="text-lg font-semibold text-yellow-400">{team.team}</h3>
                </div>
              </div>
              {/* Back */}
              <div className="absolute w-full h-full rounded-2xl backface-hidden bg-gradient-to-br from-black via-purple-950 to-purple-800 p-6 flex flex-col justify-center items-center rotate-y-180">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">{team.team}</h3>
                <p className="text-sm text-gray-300 leading-relaxed text-center">{team.info}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
