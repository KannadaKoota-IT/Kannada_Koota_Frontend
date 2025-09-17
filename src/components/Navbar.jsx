import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./styles/Navbar.css";
import { gsap } from "gsap";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    gsap.from(".navbar", { y: -60, opacity: 0, duration: 1 });
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const menuItems = [
    { label: "Home", type: "scroll", id: "home" },
    { label: "About", type: "scroll", id: "about" },
    { label: "Contact", type: "scroll", id: "footer" },
    { label: "Announcements", type: "route", to: "/announcements" },
    { label: "Events", type: "route", to: "/events" },
    { label: "Teams", type: "route", to: "/teams" },
    { label: "Gallery", type: "route", to: "/gallery" },
    { label: "Admin", type: "route", to: "/admin-login" },
  ];

  return (
    <>
      <nav className="navbar">
        <img
          src={'/logo.png'}
          alt="Logo"
          className="logo"
          onClick={() =>
            location.pathname === "/"
              ? scrollToSection("home")
              : (window.location.href = "/") // if on another route, go home first
          }
        />

        <div className="menu-icon" onClick={() => setMenuOpen((prev) => !prev)}>
          &#9776;
        </div>

        <ul className={`nav-list ${menuOpen ? "show" : ""}`}>
          {menuItems.map((item, i) => (
            <li key={i}>
              {item.type === "scroll" && location.pathname === "/" ? (
                <button
                  className="nav-link"
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  className="nav-link"
                  to={item.to || "/"}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* This renders all child routes below Navbar */}
      <Outlet />
    </>
  );
}
