// src/components/Footer.jsx
import React, { useEffect, useRef } from "react";
import "./Footer.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaInstagram, FaYoutube, FaFacebookF } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef();

  useEffect(() => {
    const el = footerRef.current;
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
        },
      }
    );
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-content">
        <h2 className="footer-logo">Kannada Koota</h2>
        <p className="footer-tagline">
          Celebrating Culture, Unity, and Tradition.
        </p>

        <p className="footer-logo">
          Not Just a Club. It’s a Movement – Kannada Koota
        </p>

        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Kannada Koota. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
