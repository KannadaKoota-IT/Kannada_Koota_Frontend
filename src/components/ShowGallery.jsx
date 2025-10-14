import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ShowGallery() {
  const [mediaItems, setMediaItems] = useState([]);
  const galleryRef = useRef();
  const containerRef = useRef();
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch media from backend
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/gallery`);
        const data = await res.json();
        if (Array.isArray(data)) setMediaItems(data);
        else console.error("❌ Invalid media response", data);
      } catch (err) {
        console.error("❌ Failed to fetch gallery items:", err);
      }
    };
    fetchMedia();
  }, [API_BASE]);

  // GSAP horizontal scroll + text animation
  useEffect(() => {
    if (!mediaItems.length) return;

    const heading = containerRef.current.querySelector(".gallery-text h2");
    const paragraph = containerRef.current.querySelector(".gallery-text p");
    const galleryEl = galleryRef.current;
    const containerEl = containerRef.current;

    // Animate heading & paragraph
    gsap.fromTo(
      heading,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 85%" },
      }
    );
    gsap.fromTo(
      paragraph,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: paragraph, start: "top 90%" },
      }
    );

    // Wait for all media to load
    const mediaElements = galleryEl.querySelectorAll("img, video");
    let loadedCount = 0;

    const initScrollTrigger = () => {
      const totalScroll = galleryEl.scrollWidth - containerEl.offsetWidth;
      if (totalScroll <= 0) return; // nothing to scroll

      gsap.to(galleryEl, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: containerEl,
          start: "top top",
          end: `+=${totalScroll}`,
          scrub: true,
          pin: true, // still pinned but only during horizontal scroll
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    };

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === mediaElements.length) {
        initScrollTrigger();
      }
    };

    if (!mediaElements.length) {
      initScrollTrigger(); // fallback if no media
    } else {
      mediaElements.forEach((media) => {
        if (media.tagName === "IMG") {
          media.complete ? checkAllLoaded() : media.addEventListener("load", checkAllLoaded);
        } else if (media.tagName === "VIDEO") {
          media.readyState >= 3 ? checkAllLoaded() : media.addEventListener("loadeddata", checkAllLoaded);
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [mediaItems]);

  return (
    <section
      className="relative bg-black py-16 overflow-hidden"
      ref={containerRef}
      id="show-gallery"
    >
      {/* Heading */}
      <div className="gallery-text text-center mb-12 px-4 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
          Gallery
        </h2>
        <p className="text-amber-200/80">
          A glimpse into the vibrant moments captured by Kannada Koota.
          <br />
          Here's a beautiful collection of moments we've lived, laughed, and
          celebrated together.
        </p>
      </div>

      {/* Horizontal Gallery Wrapper */}
      <div className="relative w-full overflow-x-hidden">
        <div
          className="flex space-x-6 overflow-visible"
          ref={galleryRef}
          style={{ willChange: "transform" }}
        >
          {mediaItems.map((item, i) => (
            <div
              key={item._id || i}
              className="flex-shrink-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-gray-900 via-black to-gray-800 rounded-2xl overflow-hidden shadow-lg relative group flex items-center justify-center"
            >
              {item.mediaType === "video" ? (
                <video
                  src={item.mediaUrl}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={item.mediaUrl}
                  alt={item.desc || `Gallery ${i}`}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/60 to-transparent p-3 text-amber-100 text-sm group-hover:text-yellow-300 transition-colors text-center">
                {item.desc || "Untitled"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
