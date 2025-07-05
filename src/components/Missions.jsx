import React, { useEffect, useRef } from "react";
import "../components/styles/Missions.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Missions = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    sectionsRef.current.forEach((section, i) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          },
          delay: i * 0.2,
        }
      );
    });
  }, []);

  return (
    <section className="missions-container">
      <div
        className="mission-vision-section"
        ref={(el) => (sectionsRef.current[0] = el)}
      >
        <h3>
          <span className="emoji">🎯</span>
          <span className="gradient-text">Our Mission</span>
        </h3>
        <p>
          To create a vibrant, inclusive space that{" "}
          <strong>celebrates the heart and heritage of Karnataka</strong>.
          Through culture, language, art, and community, we bring together
          students who share a love for Kannada or are curious to explore it.
        </p>
        <p>
          We exist to <strong>keep traditions alive</strong>, nurture identity,
          and inspire pride in who we are and where we come from.
        </p>
      </div>

      <div
        className="mission-vision-section"
        ref={(el) => (sectionsRef.current[1] = el)}
      >
        <h3>
          <span className="emoji">🌈</span>
          <span className="gradient-text">Our Vision</span>
        </h3>
        <p>
          We envision a world where{" "}
          <strong>Kannada culture echoes far beyond its borders</strong> — where
          students from all walks of life come together to dance to folk tunes,
          savor hometown flavors, and speak in the language of unity.
        </p>
        <ul>
          <li>
            🌟 A <strong>beacon of cultural pride</strong>
          </li>
          <li>
            🌉 A <strong>bridge between generations and communities</strong>
          </li>
          <li>
            🎤 A <strong>platform for expression, celebration, and connection</strong>
          </li>
        </ul>
      </div>

      <div
        className="mission-vision-section"
        ref={(el) => (sectionsRef.current[2] = el)}
      >
        <h3>
          <span className="emoji">💫</span>
          <span className="gradient-text">What We Believe</span>
        </h3>
        <p>
          At Kannada Koota, we believe that{" "}
          <strong>
            culture is not just preserved — it is lived, shared, and passed on
            with joy.
          </strong>
        </p>
        <p>
          We welcome anyone with an open heart — whether you're from Karnataka or
          just curious to learn.
        </p>
      </div>
    </section>
  );
};

export default Missions;
