import React, { useEffect, useRef, useState } from "react";
import "./About.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "emailjs-com";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const aboutRef = useRef();
  const statsRef = useRef([]);
  const imageRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    gsap.from(aboutRef.current, {
      scrollTrigger: {
        trigger: aboutRef.current,
        start: "top 80%",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(imageRef.current, {
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top 85%",
      },
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "power3.out",
    });

    statsRef.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: [30, 200, 10][i],
          duration: 2,
          snap: "innerText",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });

    const paragraphs = aboutRef.current.querySelectorAll(".about-text p");
    paragraphs.forEach((p, index) => {
      gsap.from(p, {
        scrollTrigger: {
          trigger: p,
          start: "top 90%",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
      });
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_x9v20q7", "template_gyxbf7k", e.target, "mArKdrHINvHIZxIjI")
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
      <section className="about-section" id="about" ref={aboutRef}>
        <h2 className="about-heading">About Kannada Koota</h2>

        <div className="about-container">
          <div className="about-text">
            <h3>Who We Are</h3>
            <p>
              Kannada Koota is a cultural club at PES University that aims to
              celebrate and promote the beauty of Kannada language, traditions,
              and heritage.
            </p>
            <h3>What We Do</h3>
            <p>
              From folk dances and music festivals to literature events and
              workshops, we create unforgettable experiences that honor our
              roots.
            </p>
            <h3>Why It Matters</h3>
            <p>
              We believe in fostering a sense of identity and pride among
              students through culture, creativity, and connection.
            </p>
            <blockquote>“In our language, in our walk.” — Kannada Koota</blockquote>
            <button className="cta-button" onClick={() => setShowModal(true)}>
              Join our Community
            </button>
          </div>

          <div className="about-image" ref={imageRef}>
            <img src={"/about.png"} alt="Kannada Culture" />
            <div className="stats-container">
              <div className="stat">
                <span ref={(el) => (statsRef.current[0] = el)}>0</span>+ Events
              </div>
              <div className="stat">
                <span ref={(el) => (statsRef.current[1] = el)}>0</span>+ Members
              </div>
              <div className="stat">
                <span ref={(el) => (statsRef.current[2] = el)}>0</span>+ Awards
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="join-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="join-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Join Kannada Koota</h2>
            <form className="join-form" onSubmit={handleSubmit}>
              <input name="name" type="text" placeholder="Your Name" required />
              <input name="email" type="email" placeholder="Your Email" required />
              <textarea
                name="message"
                placeholder="Why do you want to join?"
                required
              ></textarea>
              <button type="submit">Submit</button>
            </form>
            <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="success-box">
          ✅ Successfully submitted! We’ll reach out soon.
        </div>
      )}
    </>
  );
}
