import React, { useEffect, useRef, useState } from "react";
import "../components/styles/Events.css";
import Carousel from "../../Reactbits/Carousel/Carousel";
import InfiniteScroll from "../../Reactbits/InfiniteScroll/InfiniteScroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const sectionRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Fetch events and announcements on mount
  useEffect(() => {
    fetchEvents();
    fetchAnnouncements();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      const formatted = data.map((event) => ({
        title: event.title,
        date: new Date(event.date).toLocaleDateString(),
        description: event.description,
        location: event.location || "TBA",
        image: `http://localhost:5000${event.imageUrl}`,
      }));
      setEvents(formatted);
    } catch (err) {
      console.error("❌ Failed to fetch events:", err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/announcements");
      const data = await res.json();
      if (data.success) {
        const formatted = data.announcements.map((item, index) => ({
          content: (
            <div className="announcement-scroll-item" key={index}>
              <h4>{item.title}</h4>
              <p>{item.message}</p>
            </div>
          ),
        }));
        setAnnouncements(formatted);
      }
    } catch (err) {
      console.error("❌ Failed to fetch announcements:", err);
    }
  };

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="events" className="events-wrapper" ref={sectionRef}>
      <div className="events-container">
        {/* === EVENTS CAROUSEL === */}
        <div className="carousel-wrapper">
          <h2>
            <span className="emoji">🗓️</span>
            <span className="section-heading"> Upcoming Events</span>
          </h2>
          <Carousel
            items={events}
            baseWidth={window.innerWidth < 640 ? 320 : 600}
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
          <div className="tagline" id="culture-tagline">
            "Preserving culture through celebration"
          </div>
        </div>

        {/* === ANNOUNCEMENTS SCROLL === */}
        <div className="announcement-panel">
          <h2>
            <span className="emoji">📢</span>
            <span className="section-heading"> Announcements</span>
          </h2>
          <div style={{ height: "500px", position: "relative" }}>
            <InfiniteScroll
              items={announcements}
              isTilted={true}
              autoplay={true}
              autoplaySpeed={0.6}
              autoplayDirection="up"
              pauseOnHover={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
