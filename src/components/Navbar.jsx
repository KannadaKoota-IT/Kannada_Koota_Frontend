import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { gsap } from "gsap";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  useEffect(() => {
    gsap.from(".navbar-container", {
      y: -80,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  // IntersectionObserver to update activeSection on scroll
  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = ["home", "about", "footer"];
    const options = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [location.pathname]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const navbarHeight = document.querySelector(".navbar-container").offsetHeight;
      const top = el.offsetTop - navbarHeight;
      window.scrollTo({ top, behavior: "smooth" });
      setMenuOpen(false);
      setActiveSection(id);
    }
  };

  const mainMenuItems = [
    { label: "Home", type: "scroll", id: "home" },
    { label: "About", type: "scroll", id: "about" },
    { label: "Contact", type: "scroll", id: "footer" },
    { label: "Announcements", type: "route", to: "/announcements" },
  ];

  const dropdownItems = [
    { label: "Events", to: "/events" },
    { label: "Teams", to: "/teams" },
    { label: "Gallery", to: "/gallery" },
  ];

  // Determine if link is active
  const isActive = (item) => {
    if (item.type === "scroll") {
      return location.pathname === "/" && activeSection === item.id;
    } else if (item.type === "route") {
      return location.pathname === item.to;
    }
    return false;
  };

  return (
    <>
      <nav className="navbar-container fixed top-0 left-0 w-full z-[1000] bg-black/90 backdrop-blur-xl border-b border-blue-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer group"
            onClick={() =>
              location.pathname === "/"
                ? scrollToSection("home")
                : (window.location.href = "/")
            }
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/50 group-hover:ring-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-400/50 group-hover:scale-105"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {mainMenuItems.map((item, i) => (
              <div key={i}>
                {item.type === "scroll" && location.pathname === "/" ? (
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-2 text-base font-medium transition-all duration-300 ${
                      isActive(item)
                        ? "text-blue-400 border-b-2 border-blue-500"
                        : "text-gray-300 hover:text-blue-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    to={item.to || "/"}
                    className={`px-4 py-2 text-base font-medium transition-all duration-300 ${
                      isActive(item)
                        ? "text-blue-400 border-b-2 border-blue-500"
                        : "text-gray-300 hover:text-blue-400"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 text-base font-medium text-gray-300 hover:text-blue-400 flex items-center gap-1 transition">
                More
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="bg-black/95 backdrop-blur-xl rounded-lg shadow-2xl border border-blue-500/20 overflow-hidden">
                  {dropdownItems.map((item, i) => (
                    <Link
                      key={i}
                      to={item.to}
                      className={`block px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        location.pathname === item.to
                          ? "text-blue-400 bg-blue-500/10"
                          : "text-gray-300 hover:text-blue-400 hover:bg-blue-500/10"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative w-10 h-10 text-blue-400 focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span
                className={`block w-6 h-0.5 bg-current mb-1.5 transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-current mb-1.5 transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-1 bg-black/95 backdrop-blur-xl border-t border-blue-500/10">
            {mainMenuItems.map((item, i) => (
              <div key={i}>
                {item.type === "scroll" && location.pathname === "/" ? (
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive(item)
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-gray-300 hover:bg-blue-500/10 hover:text-blue-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    to={item.to || "/"}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive(item)
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-gray-300 hover:bg-blue-500/10 hover:text-blue-400"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Dropdown Items */}
            <div className="pt-2 border-t border-blue-500/10">
              {dropdownItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    location.pathname === item.to
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-300 hover:bg-blue-500/10 hover:text-blue-400"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}
