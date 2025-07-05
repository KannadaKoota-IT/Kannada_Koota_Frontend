import React, { useEffect, useRef } from "react";
import "./styles/Teams.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import bedagu from "../components/assets/teams/bedagu.jpg";
import alankara from "../components/assets/teams/alankara.jpg";
import balav from "../components/assets/teams/balav.webp";
import inchara from "../components/assets/teams/inchara.jpg";

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

export default function Teams() {
  const cardsRef = useRef([]);
  const titleRef = useRef();

  useEffect(() => {
    // Animate h2 title
    gsap.from(titleRef.current, {
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 85%",
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out",
    });

    // Animate team cards
    cardsRef.current.forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
        },
      });

      const inner = card.querySelector(".flip-card-inner");

      card.addEventListener("mouseenter", () => {
        gsap.to(inner, {
          rotateY: 180,
          duration: 0.3,
          ease: "power2.inOut",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(inner, {
          rotateY: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
      });
    });
  }, []);

  return (
    <section className="teams-section" id="teams">
      <h2 className="section-title" ref={titleRef}>
        Our Cultural Teams
      </h2>
      <div className="teams-grid">
        {teams.map((team, i) => (
          <div
            className="flip-card"
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
          >
            <div className="flip-card-inner">
              <div
                className="flip-card-front full-image"
                style={{ backgroundImage: `url(${team.image})` }}
              >
                <div className="team-title-overlay">
                  <h3>{team.team}</h3>
                </div>
              </div>
              <div className="flip-card-back">
                <h3>{team.team}</h3>
                <p>{team.info}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
