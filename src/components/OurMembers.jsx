import React, { useEffect, useRef, useState } from "react";
import "./styles/OurMembers.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OurMembers() {
  const [members, setMembers] = useState([]);
  const cardsRef = useRef([]);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/team`);
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error("❌ Failed to fetch team members:", err);
      }
    };

    fetchMembers();
  }, [API_BASE]);

  useEffect(() => {
    if (!members.length) return;

    cardsRef.current.forEach((card, i) => {
      gsap.from(card, {
        scale: 0.85,
        opacity: 0,
        duration: 1,
        delay: i * 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
      });
    });
  }, [members]);

  return (
    <section id="members">
      <h2 className="title">Our Members</h2>
      <div className="grid">
        {members.map((member, i) => (
          <div
            className="card"
            key={member._id}
            ref={(el) => (cardsRef.current[i] = el)}
          >
            <div className="card2">
              <div className="avatar">
                <img src={`${API_BASE}${member.photoUrl}`} alt={member.name} />
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
