import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const Missions = () => {
  const { isKannada } = useLanguage();
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

  const sections = [
    {
      emoji: "🎯",
      title: isKannada ? "ನಮ್ಮ ಧ್ಯೇಯ" : "Our Vision",
      content: isKannada ? [
        "ಮನಸ್ಸುಗಳ ನಡುವೆ ಭಾವಪರಾಗವನ್ನು ರವಾನಿಸುವ ದುಂಬಿ ಭಾಷೆ. ದುಂಬಿ ಸಂಪಾದಿಸಿಹ ಜೇನು ಕನ್ನಡ! ಆ ಜೇನ ಹೀರುವ ರಸಿಕರು ನಾವುಗಳು!",
        "ಕನ್ನಡದ ಪರವಾಗಬೇಕು, ಕನ್ನಡದ ಕಾಯಕಕ್ಕೆ ಕೈ ಜೋಡಿಸುವ ಕರವಾಗಬೇಕು, ಮಾತೆಯ ಕೊರಳಲ್ಲಿನ ಸರವಾಗಬೇಕು, ಕನ್ನಡದ ಉದ್ಯಾನದಲ್ಲೊಂದು ಮರವಾಗಬೇಕು ಎಂಬುದೇ ನಮ್ಮ ಆಶಯ!",
      ] : [
        "To create a vibrant, inclusive space that celebrates the heart and heritage of Karnataka. Through culture, language, art, and community, we bring together students who share a love for Kannada or are curious to explore it.",
        "We strive to keep traditions alive, nurture identity, and inspire pride in who we are and where we come from.",
      ],
    },
    {
      emoji: "🛣️",
      title: isKannada ? "ನಮ್ಮ ದಾರಿ" : "Our Path",
      content: isKannada ? [
        "ಕರ್ನಾಟಕದ ಹಾಡು-ಕುಣಿತ, ಭವ್ಯತೆ-ನವ್ಯತೆ, ಪ್ರಕೃತಿ-ಸಂಸ್ಕೃತಿ, ಸಂಪದ-ಜಾನಪದ, ಉಡುಗೆ-ತೊಡುಗೆ, ಊಟ-ಉಪಚಾರ, ಹಬ್ಬ-ಹರಿದಿನ, ವ್ಯವಹಾರ-ಆಚರಣೆ, ರೀತಿ-ನೀತಿ‌-ಪ್ರೀತಿ ಹೀಗೆ ಹತ್ತು ಹಲವಾರು ಧಾತುಗಳ ನಡುವಿನ ಸೇತುವಾಗಿ ನಿಲ್ಲುವುದೇ ನಮ್ಮ ನಿಲುವು. ಇವೆಲ್ಲವನ್ನು ಸ್ವಾಗತಿಸುವ ಮತ್ತು ಸಂಭ್ರಮಿಸುವ ಸಾಂಸ್ಕೃತಿಕ ಹಾಗೂ ತಾಂತ್ರಿಕ ಕಾರ್ಯಕ್ರಮಗಳ ಮುಖಾಂತರ ನಮ್ಮತನದ ಭಾವನೆಯನ್ನು ಉದ್ದೀಪಿಸುವ ಕೆಲಸ ನಮ್ಮದು",
      ] : [
        "We envision a world where Kannada culture echoes far beyond its borders — where students from all walks of life come together to dance to folk tunes, savor hometown flavors, and speak in the language of unity.",
      ],
    },
    {
      emoji: "💫",
      title: isKannada ? "ನಮ್ಮ ನಂಬಿಕೆ" : "Our Belief",
      content: isKannada ? [
        "ಭಾಷೆ ಎಂಬುದು ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ ಗಾಜಿನ ಹಿಂದಿಟ್ಟು ಸಂರಕ್ಷಿಸುವ ಗ್ರಂಥ ಎನ್ನುವುದಕ್ಕಿಂತ ಅದರ ಪ್ರತಿ ಶಬ್ದವೂ ನಮ್ಮ ಸ್ವಂತ ಎನ್ನುವುದು ನಮ್ಮ ನಂಬಿಕೆ. ",
        "ನಮ್ಮ ಪಾಲಿಗೆ ಇದು ಬರೀ ಭಾಷೆಯಲ್ಲ, ನಮ್ಮ ನಾಲಿಗೆಯ ತುಡಿತ, ಎದೆಯ ಬಡಿತ, ಮನಸ್ಸಿನ ಮಿಡಿತ!",
      ] : [
        "At Kannada Koota, we believe that culture is not just preserved — it is lived, shared, and passed on with joy.",
        "We welcome anyone with an open heart — whether you're from Karnataka or just curious to learn.",
      ],
    },
  ];

  return (
    <section className="relative bg-black py-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-80 h-80 bg-yellow-500/20 blur-[120px] top-10 left-10 rounded-full"></div>
        <div className="absolute w-96 h-96 bg-purple-500/20 blur-[150px] bottom-10 right-10 rounded-full"></div>
      </div>

      <h2 className="text-center text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]">
        {isKannada ? "ಧ್ಯೇಯ ಮತ್ತು ದಾರಿ" : "Vision and Path"}
      </h2>

      <div className="flex flex-col gap-12 max-w-6xl mx-auto">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            ref={(el) => (sectionsRef.current[idx] = el)}
            className="relative bg-gradient-to-br from-white/5 to-white/0 border border-yellow-400/40 rounded-2xl p-8 md:p-10 shadow-[0_0_20px_rgba(255,215,0,0.15)] backdrop-blur-md hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] hover:-translate-y-1 transition-all duration-300"
          >
            {/* Header */}
            <h3 className="flex items-center gap-3 text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              <span className="text-2xl md:text-3xl">{sec.emoji}</span>
              {sec.title}
            </h3>

            {/* Content */}
            <div className="mt-4 space-y-4 text-gray-200 text-base md:text-lg leading-relaxed"
            style={{ fontFamily: "'Noto Sans Kannada', sans-serif" }}>
              {sec.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {sec.list && (
                <ul className="mt-4 space-y-2">
                  {sec.list.map((item, i) => (
                    <li key={i} className="text-yellow-300/90 font-medium">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Missions;
