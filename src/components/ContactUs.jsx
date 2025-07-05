import React, { useState } from "react";
import Tooltip from "./Tooltip";
import "./styles/ContactUs.css";

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(null); // null | "success" | "error"
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const message = e.target[2].value;

    setLoading(true);
    setSubmitted(null);

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted("success");
        e.target.reset();
      } else {
        setSubmitted("error");
      }
    } catch (err) {
      console.error(err);
      setSubmitted("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <h2>Contact Us</h2>
        <p>
          We'd love to hear from you! Whether you have questions, feedback, or
          want to collaborate on something exciting — drop us a message. Our
          team will get back to you as soon as possible.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {submitted === "success" && (
          <div className="form-message success-message">
            ✅ Your message has been sent! We'll get back to you shortly.
          </div>
        )}
        {submitted === "error" && (
          <div className="form-message error-message">
            ❌ Something went wrong. Please try again later.
          </div>
        )}

        <div className="social-media-icons">
          <Tooltip />
        </div>
      </div>
    </section>
  );
}
