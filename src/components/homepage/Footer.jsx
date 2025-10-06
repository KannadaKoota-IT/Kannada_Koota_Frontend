// src/components/Footer.jsx
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";

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
    <footer ref={footerRef} id="footer" className="bg-gray-900 text-gray-200 relative pt-6">
      {/* Golden top line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-8 mt-6">
        {/* Brand */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">ಕನ್ನಡ ಕೂಟ</h2>
          <p className="text-gray-400"
            style={{ fontFamily: "'Noto Sans Kannada', sans-serif" }}>
            ಸಂಸ್ಕೃತಿ, ಏಕತೆ ಮತ್ತು ಪಾರಂಪರೆ
          </p>
        </div>

        {/* Navigation */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/events"
                className="hover:text-yellow-400 transition-colors duration-300"
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                to="/announcements"
                className="hover:text-yellow-400 transition-colors duration-300"
              >
                Announcements
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className="hover:text-yellow-400 transition-colors duration-300"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                to="/teams"
                className="hover:text-yellow-400 transition-colors duration-300"
              >
                Teams
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="mb-3">
            Email:{" "}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=kannadakoota.pesu@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              kannadakoota.pesu@gmail.com
            </a>
          </p>
          <div className="flex gap-4 text-xl">
            <a
              href="https://www.instagram.com/kannadakoota_pesu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.youtube.com/@kannadakoota"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              <FaYoutube />
            </a>
            <a
              href="https://www.whatsapp.com/channel/0029VbAoZaX0AgWIUmjc163v"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 border-t border-gray-800 pt-6 pb-2 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Kannada Koota. All rights reserved.</p>
        <p>Designed and Developed by the I.T. Team</p>
      </div>

    </footer>
  );
}
