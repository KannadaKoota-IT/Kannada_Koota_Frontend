import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
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
    <Wrapper id="members">
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
    </Wrapper>
  );
}


const Wrapper = styled.section`
  padding: 5rem 8%;
  background: black;
  color: white;
  text-align: center;

  .title {
    font-size: 2.8rem;
    margin-bottom: 3rem;
    background: linear-gradient(90deg, #ffd700, #ff8800);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    justify-items: center;
  }

  .card {
    background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
    border-radius: 20px;
    transition: all 0.3s;
    width: 100%;
    max-width: 260px;
    height: 320px;
    box-shadow: 0 0 24px rgba(29, 18, 183, 0.4), 0 0 12px rgba(255, 215, 0, 0.2);
    border: 1px solid rgba(0, 149, 255, 0.4);
  }

  .card:hover {
    box-shadow: 0px 0px 30px 1px rgba(0, 255, 117, 0.3),
                0 0 24px rgba(255, 215, 0, 0.2);
    transform: translateY(-6px);
  }

  .card2 {
    width: 100%;
    height: 100%;
    background-color: #1a1a1a;
    border-radius: 20px;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .card2:hover {
    transform: scale(0.98);
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #ffd700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
    margin-bottom: 0.6rem;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .member-info {
    margin-top: 0.2rem;
    text-align: center;
  }

  .member-info h3 {
    font-size: 1rem;
    margin: 0.2rem 0 0;
    color: #ffd700;
  }

  .member-info p {
    font-size: 0.9rem;
    color: #ccc;
    margin-top: 0.2rem;
  }

  @media (max-width: 1024px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .grid {
      grid-template-columns: repeat(1, 1fr);
    }

    .card {
      height: 300px;
    }

    .avatar {
      width: 100px;
      height: 100px;
    }
  }
`;
