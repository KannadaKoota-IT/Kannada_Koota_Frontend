import React, { useEffect, useRef } from "react";
import "./styles/HeroSection.css";
import { gsap } from "gsap";
import heroImg from "./assets/logo.png";

const HeroSection = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const taglineRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 3, delay: 0.3, ease: "power3.out" }
    );
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 3, delay: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      taglineRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 3, delay: 2, ease: "power3.out" }
    );
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 3, delay: 2, ease: "power3.out" }
    );
  }, []);
  return (
    <section id='home' className="hero-section">
      <div className="overlay" />
      <div className="hero-wrapper">
        <div className="hero-content">
          <h1 className="hero-title" ref={titleRef}>
            Welcome to Kannada Koota – PES University’s Cultural Club
          </h1>
          <p className="hero-subtitle" ref={subtitleRef}>
            Promoting harmony through language, literature, and heritage. We
            celebrate and preserve Kannada culture, inspiring pride in the next
            generation.
          </p>
          <h3 className="hero-tagline" ref={taglineRef}>
            "In our language, in our walk"
          </h3>
        </div>
        <div className="hero-image-container">
          <img
            ref={imageRef}
            src={heroImg}
            alt="Kannada Koota Illustration"
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
