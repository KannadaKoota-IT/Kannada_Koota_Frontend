import React, { useEffect, useRef } from "react";
import Carousel from "../../../Reactbits/Carousel/Carousel";
import InfiniteScroll from "../../../Reactbits/InfiniteScroll/InfiniteScroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/router";

gsap.registerPlugin(ScrollTrigger);

export default function DashboardEvents({ events: initialEvents, announcements: initialAnnouncements }) {
  const sectionRef = useRef(null);
  const router = useRouter();



  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".carousel-wrapper", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".carousel-wrapper",
          start: "top 80%",
        },
      });

      gsap.from(".announcement-panel", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".announcement-panel",
          start: "top 85%",
        },
      });

      gsap.fromTo(
        ".announcement-panel",
        {
          boxShadow: "0 0 0px rgba(255, 215, 0, 0)",
          borderColor: "rgba(255, 215, 0, 0.05)",
        },
        {
          boxShadow:
            "0 0 24px rgba(29, 18, 183, 0.4), 0 0 12px rgba(255, 215, 0, 0.2)",
          borderColor: "rgba(0, 149, 255, 0.4)",
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".announcement-panel",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.to("#culture-tagline", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#culture-tagline",
          start: "top 90%",
        },
      });

      gsap.to(".blue-glow", {
        x: "20%",
        y: "10%",
        backgroundColor: "rgba(56, 189, 248, 0.25)",
        repeat: -1,
        yoyo: true,
        duration: 8,
        ease: "sine.inOut",
      });

      gsap.to(".blue-glow-2", {
        x: "-15%",
        y: "-5%",
        backgroundColor: "rgba(96, 165, 250, 0.25)",
        repeat: -1,
        yoyo: true,
        duration: 10,
        ease: "sine.inOut",
      });

      gsap.to(".blue-glow, .blue-glow-2", {
        scale: 1.2,
        repeat: -1,
        yoyo: true,
        duration: 6,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  return (
    <div
      id="dashboard-events"
      className="relative flex justify-center p-16 sm:p-10 bg-black min-h-screen box-border overflow-hidden"
      ref={sectionRef}
    >
      {/* Blue Glow Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="blue-glow absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl top-[-150px] left-[-200px]"></div>
        <div className="blue-glow-2 absolute w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-2xl bottom-[-100px] right-[-150px]"></div>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap gap-10 max-w-[1200px] w-full justify-center items-start px-5 relative z-10">
        {/* EVENTS CAROUSEL */}
        <div className="carousel-wrapper flex-1 min-w-auto max-w-[680px] w-full flex flex-col">
          <h2 className="flex flex-col items-start mb-6 bg-gradient-to-r from-purple-700 to-cyan-400 bg-clip-text text-transparent">
            <span className="flex items-center gap-2 text-2xl sm:text-xl">
              <span className="text-xl sm:text-xl">🗓️</span>
              <span className="text-xl md:text-2xl font-semibold">ಮುಂ. ಕಾರ್ಯಕ್ರಮಗಳು</span>
            </span>
            <span className="text-sm md:text-base text-red-500 mt-1 ml-7">(Events)</span>
          </h2>

          <Carousel
            items={initialEvents}
            baseWidth={typeof window !== 'undefined' && window.innerWidth < 640 ? 320 : 600}
            // baseHeight={window.innerWidth < 640 ? 520 : 60}
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
          {/* More Info Link */}
          <div className="mt-4 text-center">
            <span
              onClick={() => router.push("/events")}
              className="text-blue-400 hover:text-blue-300 cursor-pointer font-semibold"
            >
              More Info →
            </span>
          </div>
        </div>

        {/* ANNOUNCEMENTS SCROLL */}
        <div className="announcement-panel flex-1 min-w-[300px] max-w-[420px] bg-black/4 border border-yellow-400/10 backdrop-blur-md p-6 sm:p-4 rounded-xl shadow-lg max-h-[500px] flex flex-col transition-all duration-300">
          <h2 className="flex flex-col items-start mb-6 bg-gradient-to-r from-purple-700 to-cyan-400 bg-clip-text text-transparent">
            <span className="flex items-center gap-2 text-2xl sm:text-xl">
              <span className="text-2xl sm:text-xl">📢</span>
              <span className="text-xl md:text-2xl font-semibold">ಪ್ರಕಟಣೆಗಳು</span>
            </span>
            <span className="text-sm md:text-base text-red-500 mt-1 ml-7">(Announcements)</span>
          </h2>

          {/* <div className="relative flex-1">
            <InfiniteScroll
              items={announcements}
              isTilted={true}
              autoplay={true}
              autoplaySpeed={0.6}
              autoplayDirection="up"
              pauseOnHover={true}
            />
          </div> */}

          <div className="relative flex-1 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent">
            {initialAnnouncements.length > 0 ? (
              initialAnnouncements.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-4 rounded-lg mb-3 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-transform duration-300"
                >
                  <h4 className="text-yellow-400 text-lg mb-1">{item.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center">No announcements yet.</p>
            )}
          </div>

          {/* More Info Link */}
          <div className="mt-4 text-center">
            <span
              onClick={() => router.push("/announcements")}
              className="text-blue-400 hover:text-blue-300 cursor-pointer font-semibold"
            >
              More Info →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
