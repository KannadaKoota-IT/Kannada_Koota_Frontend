import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#9B000E] text-white hover:bg-[#7D000B] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-[#F5B000]/40 flex items-center justify-center cursor-pointer"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 text-white" />
    </button>
  );
}
