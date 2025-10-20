import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { gsap } from "gsap";
import { Outlet } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const router = useRouter();
  const location = { pathname: router.pathname };
  const navigate = router.push;

  useEffect(() => {
    gsap.set(".navbar-container", { y: -80, opacity: 0 });
    gsap.to(".navbar-container", {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") return;
    const sections = ["home", "about", "footer"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navbarHeight =
      document.querySelector(".navbar-container")?.offsetHeight || 0;
    const top = el.offsetTop - navbarHeight;
    window.scrollTo({ top, behavior: "smooth" });
    setMenuOpen(false);
    setActiveSection(id);
  };

  const mainMenuItems = [
    { label: "Home", type: "scroll", id: "home" },
    { label: "About", type: "scroll", id: "about" },
    { label: "Announcements", type: "route", to: "/announcements" },
    { label: "Gallery", type: "route", to: "/gallery" },
    { label: "Contact", type: "scroll", id: "footer" },
  ];

  const dropdownItems = [
    { label: "Events", to: "/events" },
    { label: "Teams", to: "/teams" },
  ];

  const isActive = (item) => {
    if (item.type === "scroll") {
      return location.pathname === "/" && activeSection === item.id;
    }
    return location.pathname === item.to;
  };

  const handleNavClick = (item) => {
    if (item.type === "scroll") {
      if (location.pathname === "/") {
        scrollToSection(item.id);
      } else {
        navigate("/");
        setTimeout(() => scrollToSection(item.id), 300);
      }
    } else if (item.type === "route") {
      navigate(item.to);
      setMenuOpen(false);
    }
  };

  const NavItem = ({ item, onClick }) => (
    <button
      onClick={() => onClick(item)}
      className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${isActive(item)
          ? "bg-blue-500/20 text-blue-400"
          : "text-yellow-300 hover:bg-blue-500/10 hover:text-blue-400"
        }`}
    >
      {item.label}
    </button>
  );

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
                : navigate("/")
            }
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-yellow-500/50 group-hover:ring-yellow-400 transition-all duration-300 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-400/50 group-hover:scale-105"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {mainMenuItems.map((item, i) => (
                <NavItem key={i} item={item} onClick={handleNavClick} />
              ))}

              {/* Desktop Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 text-yellow-300 hover:text-blue-400 focus:outline-none flex flex-col justify-center items-center gap-1"
                >
                  <span
                    className={`block w-6 h-0.5 bg-current transition-all duration-300 ${dropdownOpen ? "rotate-45 translate-y-1.5" : ""
                      }`}
                  ></span>
                  <span
                    className={`block w-6 h-0.5 bg-current transition-all duration-300 ${dropdownOpen ? "opacity-0" : ""
                      }`}
                  ></span>
                  <span
                    className={`block w-6 h-0.5 bg-current transition-all duration-300 ${dropdownOpen ? "-rotate-45 -translate-y-1.5" : ""
                      }`}
                  ></span>
                </button>

                <div
                  className={`absolute top-full right-0 mt-3 w-48 bg-black/95 backdrop-blur-xl border border-blue-500/20 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${dropdownOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                    }`}
                >
                  {dropdownItems.map((item, i) => (
                    <Link
                      key={i}
                      href={item.to}
                      onClick={() => setDropdownOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium transition-all duration-200 ${location.pathname === item.to
                          ? "text-blue-400 bg-blue-500/10"
                          : "text-yellow-300 hover:text-blue-400 hover:bg-blue-500/10"
                        }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Language Toggle (Always Visible) */}
            <div className="flex items-center space-x-2">
              <span className="text-m font-bold text-amber-500">ಕ</span>
              <button
                onClick={toggleLanguage}
                className="relative w-8 h-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 shadow-inner ring-1 ring-amber-300 transition-all duration-300 hover:shadow-[0_0_10px_rgba(251,191,36,0.7)] focus:outline-none"
                aria-label="Toggle language"
              >
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-md transition-all duration-300 ${language === "en"
                      ? "translate-x-[1.0rem] bg-gradient-to-br from-amber-200 to-red-300"
                      : "translate-x-[-0.2rem] bg-gradient-to-br from-green-200 to-amber-200"
                    }`}
                ></div>
              </button>
              <span className="text-sm font-bold text-amber-500">EN</span>
            </div>


            {/* Mobile Hamburger */}
            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setDropdownOpen(false);
              }}
              className="md:hidden w-10 h-10 text-blue-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col justify-center items-center">
                <span
                  className={`block w-6 h-0.5 bg-current mb-1.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-current mb-1.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""
                    }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2 bg-black/95 backdrop-blur-xl border-t border-blue-500/10 flex flex-col">
            {[...mainMenuItems, ...dropdownItems].map((item, i) =>
              item.type ? (
                <NavItem key={i} item={item} onClick={handleNavClick} />
              ) : (
                <button
                  key={i}
                  onClick={() => {
                    navigate(item.to);
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${location.pathname === item.to
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-yellow-300 hover:bg-blue-500/10 hover:text-blue-400"
                    }`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}
