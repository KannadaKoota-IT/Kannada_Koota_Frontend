import React, { useEffect, useRef, useState } from "react";
import "./styles/Gallery.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const [mediaItems, setMediaItems] = useState([]);
  const galleryRef = useRef();
  const containerRef = useRef();

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/gallery`);
        const data = await res.json();
        console.log("gallery data: ", data);
        if (Array.isArray(data)) {
          setMediaItems(data);
        } else {
          console.error("❌ Invalid media response", data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch gallery items:", err);
      }
    };

    fetchMedia();
  }, [API_BASE]);

  useEffect(() => {
    if (mediaItems.length === 0) return;

    const galleryEl = galleryRef.current;
    const containerEl = containerRef.current;
    const heading = containerEl.querySelector(".gallery-text h2");
    const paragraph = containerEl.querySelector(".gallery-text p");

    gsap.fromTo(
      heading,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
        },
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
        scrollTrigger: {
          trigger: paragraph,
          start: "top 90%",
        },
      }
    );

    const images = galleryEl.querySelectorAll("img, video");
    let loadedCount = 0;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        const totalScroll =
          galleryEl.scrollWidth - containerRef.current.offsetWidth;

        gsap.to(galleryEl, {
          x: -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${totalScroll}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }
    };

    images.forEach((media) => {
      if (media.complete || media.readyState >= 3) {
        checkAllLoaded();
      } else {
        media.addEventListener("load", checkAllLoaded);
        media.addEventListener("loadeddata", checkAllLoaded);
      }
    });

    return () => ScrollTrigger.kill();
  }, [mediaItems]);

  return (
    <section className="gallery-wrapper" id="gallery" ref={containerRef}>
      <div className="gallery-text">
        <h2>Gallery</h2>
        <p>
          A glimpse into the vibrant moments captured by Kannada Koota.
          <br />
          Here's a beautiful collection of moments we've lived, laughed, and
          celebrated together. From on-stage brilliance to candid backstage fun,
          these memories define the spirit of our club.
        </p>
      </div>

      <div className="gallery-horizontal" ref={galleryRef}>
        {mediaItems.map((item, i) => (
          <div className="gallery-card" key={i}>
            {item.mediaType === "video" ? (
              <video
                src={`${API_BASE}${item.mediaUrl}`}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="gallery-video"
              />
            ) : (
              <img
                src={`${API_BASE}${item.mediaUrl}`}
                alt={item.title || `Gallery ${i}`}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
