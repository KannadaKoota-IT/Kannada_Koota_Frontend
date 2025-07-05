import { useState, useEffect } from "react";
import "./styles/Navbar.css";
import logo from "./assets/logo.png";
import { gsap } from "gsap";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.from(".navbar", { y: -60, opacity: 0, duration: 1 });
  }, []);

  const menuItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Events", href: "#events" },
    { label: "Teams", href: "#teams" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <img
        src={logo}
        alt="Logo"
        className="logo"
        onClick={() => scrollToSection("home")}
      />

      <div className="menu-icon" onClick={() => setMenuOpen((prev) => !prev)}>
        &#9776;
      </div>

      <ul className={`nav-list ${menuOpen ? "show" : ""}`}>
        {menuItems.map((item, i) => (
          <li key={i}>
            <button
              className="nav-link"
              onClick={() => scrollToSection(item.href.slice(1))}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
