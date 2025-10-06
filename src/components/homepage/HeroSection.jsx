import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const HeroSection = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const taglineRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const commonDelay = 0.3; // h1 and image animate together
    const commonDuration = 3; // duration for both

    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: commonDuration, delay: commonDelay, ease: "power3.out" }
    );

    gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 0.5, delay: commonDelay, ease: "power3.out" }
    );

    // Subtitle and tagline remain staggered
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
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Animated Gradient/Orb Backgrounds */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[600px] h-[500px] -top-32 -left-36 rounded-full bg-gradient-to-br from-yellow-500/10 to-amber-400/5 blur-3xl opacity-60 animate-spin-slow" />
        <div className="absolute w-[420px] h-[420px] top-1/2 right-0 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-[70px] animate-float" />
        <div className="absolute w-[300px] h-[300px] bottom-[7%] left-[12%] rounded-full bg-yellow-600/10 blur-[80px] opacity-60 animate-float-delayed" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-yellow-900/20 to-black opacity-60" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 w-full max-w-6xl px-6 py-8">
        {/* Content */}
        <div className="flex-1 text-left space-y-7 min-w-[320px]">
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-5 drop-shadow-xl animate-gradient"
            style={{ fontFamily: "'Noto Serif Kannada', sans-serif" }}
          >
            ಕನ್ನಡ ಕೂಟಕ್ಕೆ ಸುಸ್ವಾಗತ 
          </h1>
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-300/80 leading-relaxed font-bold fontfamily-"
            style={{ fontFamily: "'Noto Sans Kannada', sans-serif" }}
          >
            ಪಿ.ಇ.ಎಸ್ ವಿಶ್ವವಿದ್ಯಾಲಯದಲ್ಲಿ ಕರುನಾಡ ಕಲೆ-ಸಂಸ್ಕೃತಿಯ<br/>
            ಹೆಜ್ಜೆಯೊಡನೆ ತಾಂತ್ರಿಕತೆಯ ಕೊಂಡಿ ಬೆಸೆಯುವ ಹಂಬಲದ<br/>
            ಮನಸುಗಳಿಗೆ ಸದಾ ತೆರೆದ ಬಾಗಿಲು ನಮ್ಮೀ  ‘ ಕನ್ನಡ ಕೂಟ ’. <br/>
            ಇಲ್ಲಿಂದ ಶುರುವಾಗಲಿ ನಮ್ಮ-ನಿಮ್ಮ ಹೊಸ ಒಡನಾಟ 💛❤️.<br />
            {/* We celebrate and preserve Kannada culture, inspiring pride in the next generation. */}
          </p>
          <h3
            ref={taglineRef}
            className="text-xl md:text-2xl font-semibold italic text-yellow-400 border-l-4 border-yellow-500 pl-5 mt-2 py-2 animate-pulse"
          >
            "ನಮ್ಮ ನಡೆಯಲ್ಲಿ, ನಮ್ಮ ನುಡಿಯಲ್ಲಿ"
          </h3>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center items-center min-w-[260px]">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-br from-yellow-400/40 to-amber-300/15 rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none"></div>
            <img
              ref={imageRef}
              src={"/logo.png"}
              alt="Kannada Koota Illustration"
              className="w-[260px] h-[260px] md:w-[340px] md:h-[340px] rounded-full object-cover shadow-[0_18px_38px_rgba(0,0,0,0.4)] border-4 border-yellow-400/30 transition-all duration-400 hover:scale-105 hover:border-amber-400"
            />
            {/* Animated border shimmer */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-shimmer opacity-80 pointer-events-none" />
            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-full border-2 border-yellow-400/30 group-hover:border-amber-400 transition-all duration-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Radial Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-radial from-yellow-400/10 to-transparent" />

      {/* Custom animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg);}
          to { transform: rotate(360deg);}
        }
        .animate-spin-slow { animation: spin 80s linear infinite;}
        @keyframes float {
          0%,100% { transform: translate(0,0);}
          25% { transform: translate(22px,-23px);}
          50% { transform: translate(-17px,13px);}
          75% { transform: translate(10px,21px);}
        }
        .animate-float { animation: float 23s ease-in-out infinite;}
        .animate-float-delayed { animation: float 30s ease-in-out infinite; animation-delay: 10s;}
        @keyframes gradient {
          0%,100% { background-position: 0% 50%;}
          50% { background-position: 100% 50%;}
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4.5s ease infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%);}
          100% { transform: translateX(100%);}
        }
        .animate-shimmer { animation: shimmer 2.5s linear infinite;}
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
        @keyframes pulse {
          0%,100% {opacity:0.4;}
          50% {opacity:0.9;}
        }
        .animate-pulse { animation: pulse 3s cubic-bezier(.4,0,.6,1) infinite;}
      `}</style>
    </section>
  );
};

export default HeroSection;
