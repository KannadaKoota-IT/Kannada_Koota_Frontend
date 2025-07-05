// src/components/ScrollToTop.js
import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import "./styles/ScrollToTop.css";

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const el = document.getElementById("full");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    show && (
      <button className="scroll-to-top" onClick={scrollToTop}>
        <FaArrowUp />
      </button>
    )
  );
}
