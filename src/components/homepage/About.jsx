import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "emailjs-com";
import { useLanguage } from "../../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { isKannada } = useLanguage();
  const aboutRef = useRef();
  const statsRef = useRef([]);
  const imageRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [glowStyles, setGlowStyles] = useState([]);

  useEffect(() => {
    // Generate glow styles on client-side only
    const styles = [...Array(6)].map((_, i) => ({
      width: `${200 + Math.random() * 200}px`,
      height: `${200 + Math.random() * 200}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      background: i % 2
        ? "radial-gradient(circle, rgba(7,130,7,0.25) 0%, transparent 70%)"
        : "radial-gradient(circle, rgba(255,215,0,0.25) 0%, transparent 70%)",
    }));
    setGlowStyles(styles);

    const ctx = gsap.context(() => {
      // Section animation
      gsap.from(aboutRef.current, {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
          once: true,
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });

      // Image
      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 85%",
          once: true,
        },
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: "power3.out",
      });

      // Stats counters
      statsRef.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: [30, 300][i],
            duration: 2.2,
            snap: { innerText: 1 },
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

      // Text paragraphs
      const paragraphs = aboutRef.current.querySelectorAll(".about-text p");
      gsap.from(paragraphs, {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 85%",
          once: true,
        },
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      });

      // Glow floating
      const glows = document.querySelectorAll(".glow-spot");
      glows.forEach((glow, idx) => {
        const duration = 8 + Math.random() * 6;
        const x = (Math.random() - 0.5) * 50;
        const y = (Math.random() - 0.5) * 50;
        gsap.to(glow, {
          x,
          y,
          scale: 1 + Math.random() * 0.4,
          repeat: -1,
          yoyo: true,
          duration,
          ease: "sine.inOut",
          delay: idx * 0.3,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_x9v20q7",
        "template_gyxbf7k",
        e.target,
        "mArKdrHINvHIZxIjI"
      )
      .then(() => {
        setSuccessMsg(true);
        e.target.reset();
        setShowModal(false);
        setTimeout(() => setSuccessMsg(false), 4000);
      })
      .catch((error) => {
        alert("❌ Submission failed: " + error.text);
      });
  };

  return (
    <>
      <section
        ref={aboutRef}
        id="about"
        className="relative overflow-hidden min-h-screen py-24 px-6 md:px-12 lg:px-20"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {glowStyles.map((style, i) => (
            <div
              key={i}
              className="glow-spot absolute rounded-full blur-3xl opacity-20"
              style={style}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative z-10 text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,215,0,0.4)]">
            {isKannada ? "ಕನ್ನಡ ಕೂಟ" : "Kannada Koota"}
          </h2>
          <p className="mt-4 text-xl md:text-2xl text-gray-300 font-light"
          style={{ fontFamily: isKannada ? "'Noto Sans Kannada', sans-serif" : "inherit" }}>
            {isKannada ? "ಸಂಸ್ಕೃತಿ, ಏಕತೆ ಮತ್ತು ಪಾರಂಪರೆ" : "Culture, Unity and Tradition"}
          </p>
        </div>

        {/* Content */}
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto items-start">
          {/* Text */}
          <div className="about-text space-y-8"
          style={{ fontFamily: isKannada ? "'Noto Sans Kannada', sans-serif" : "inherit" }}>
            {[
              {
                title: isKannada ? "ನಮ್ಮ ಬಗ್ಗೆ" : "Who We Are",
                text: isKannada
                  ? "ಪಿ.ಇ.ಎಸ್ ವಿಶ್ವವಿದ್ಯಾಲಯದಲ್ಲಿನ ಕನ್ನಡದ ಮನಸ್ಸುಗಳನ್ನು ಅಭಿಮಾನದ ಬೆಸುಗೆಯಿಂದ ಬಂಧಿಸುವ ಕೊಂಡಿ ನಮ್ಮ ಕೂಟ. ಕನ್ನಡದ ಮಣಿಹಾರಕ್ಕೆ ಕೂಟ ಒಂದು ದಾರ. ಕನ್ನಡವೇ ನಮ್ಮ ಸಾರ, ಕನ್ನಡವೇ ನಮ್ಮ ವಿಚಾರ!"
                  : "Kannada Koota is a cultural club at PES University dedicated to preserving and celebrating the richness of Kannada language, traditions, and heritage.",
              },
              {
                title: isKannada ? "ನಮ್ಮ ಕೆಲಸದ ಬಗ್ಗೆ" : "What We Do",
                text: isKannada
                  ? "ಭಾವ-ಜೀವಗಳನ್ನು ಮುತ್ತಿನಂತೆ ಪೋಣಿಸುವ, ಅಭಿಮಾನವನ್ನು ಉಣಿಸುವ, ಹೃದಯಗಳನ್ನು ತಣಿಸುವ, ಮನಗಳನ್ನು ಕುಣಿಸುವ ಕಾರ್ಯಕ್ರಮಗಳ ಮೂಲಕ ನಮ್ಮ ಹೆಜ್ಜೆ ಗುರುತುಗಳನ್ನು ಮೂಡಿಸುತ್ತೇವೆ. ಕನ್ನಡದ ದೀಪ ಹಚ್ಚುವ ಬತ್ತಿಯಾಗುತ್ತೇವೆ, ಕನ್ನಡದ ಚಿತ್ರಪಟಕ್ಕೆ ಭಿತ್ತಿಯಾಗುತ್ತೇವೆ."
                  : "From folk dances and classical music to literature events and heritage workshops, we create meaningful cultural experiences.",
              },
              {
                title: isKannada ? "ಮಹತ್ವ" : "Why It Matters",
                text: isKannada
                  ? "ಬೇರು ಗಟ್ಟಿಯಿದ್ದರೆ ಮಾತ್ರವೇ ಬೇರೆಲ್ಲವೂ ಗಟ್ಟಿಯಿರಲು ಸಾಧ್ಯ. ಮಾತೃಭಾಷೆ ಮಾತ್ರವೇ ಪ್ರತಿ ವ್ಯಕ್ತಿಗೆ ಮತ್ತು ಅಭಿವ್ಯಕ್ತಿಗೆ ಸಂಪೂರ್ಣ ಸ್ವಾತಂತ್ರ್ಯದ ಹಿತಕೊಡುತ್ತದೆ ಎಂಬುದು ನಮ್ಮ ನಂಬಿಕೆ."
                  : "We foster pride, identity, and creativity among students by blending tradition with modern expression.",
              },
            ].map((section, i) => (
              <div key={i}>
                <h3 className="text-3xl font-semibold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                  {section.title}
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-gray-300 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  {section.text}
                </p>
              </div>
            ))}

            <blockquote className="mt-10 text-xl italic text-yellow-300 border-l-4 border-yellow-400 pl-5">
              {isKannada ? "“ಕನ್ನಡ ಬರೀ ಪ್ರೀತಿ ಅಲ್ಲ, ನಮ್ಮ ಬದುಕಿನ ರೀತಿ!” — ಕನ್ನಡ ಕೂಟ" : '"In our language, in our walk." — Kannada Koota'}
            </blockquote>

            <button
              onClick={() => setShowModal(true)}
              className="mt-10 px-8 py-4 rounded-full font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg hover:scale-105 hover:shadow-yellow-400/40 transition-all"
            >
              {isKannada ? "ನೀವೂ ನಮ್ಮ ಸಮುದಾಯದ ಭಾಗವಾಗಿ" : "Join Our Community"}
            </button>
          </div>

          {/* Image + Stats */}
          <div className="flex flex-col items-center space-y-8" ref={imageRef}>
            <div className="relative">
              <img
                src="/about.png"
                alt="Kannada Culture"
                className="w-full max-w-md rounded-2xl shadow-2xl border border-yellow-400/30"
              />
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              {[
                isKannada ? "ಕಾರ್ಯಕ್ರಮಗಳು" : "Events",
                isKannada ? "ಸದಸ್ಯರು" : "Members"
              ].map((label, i) => (
                <div
                  key={i}
                  className="px-6 py-4 rounded-xl bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border border-yellow-400/30 backdrop-blur-lg shadow-lg text-center hover:scale-105 transition-all"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
                    <span ref={(el) => (statsRef.current[i] = el)}>0</span>+
                  </div>
                  <div className="text-sm text-gray-400 mt-1 uppercase tracking-wide">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-neutral-900 rounded-2xl border border-yellow-400/30 shadow-2xl max-w-lg w-[90%] p-8 relative animate-fadeInScale"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-yellow-300 mb-6">
              {isKannada ? "ಕನ್ನಡ ಕೂಟಕ್ಕೆ ಸೇರಿ" : "Join Kannada Koota"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                type="text"
                required
                placeholder={isKannada ? "ನಿಮ್ಮ ಹೆಸರು" : "Your Name"}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                name="email"
                type="email"
                required
                placeholder={isKannada ? "ನಿಮ್ಮ ಇಮೇಲ್" : "Your Email"}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <textarea
                name="message"
                required
                placeholder={isKannada ? "ನೀವು ಏಕೆ ಸೇರಲು ಬಯಸುತ್ತೀರಿ?" : "Why do you want to join?"}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white h-28 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-full font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-md hover:shadow-yellow-400/40 transition-all"
              >
                {isKannada ? "ಸಲ್ಲಿಸಿ" : "Submit"}
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-[110] animate-slideUp">
          ✅ Successfully submitted! We’ll reach out soon.
        </div>
      )}

      {/* Animations */}
      <style>
        {`
        @keyframes fadeInScale {
          from {opacity:0; transform:scale(0.95);}
          to {opacity:1; transform:scale(1);}
        }
        .animate-fadeInScale { animation: fadeInScale 0.35s ease; }

        @keyframes slideUp {
          from {opacity:0; transform:translateY(20px);}
          to {opacity:1; transform:translateY(0);}
        }
        .animate-slideUp { animation: slideUp 0.4s ease; }
        `}
      </style>
    </>
  );
}
