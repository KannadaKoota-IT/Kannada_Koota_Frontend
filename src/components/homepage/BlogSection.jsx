import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../context/LanguageContext";
import BlogCard from "../blogs/BlogCard";
import BlogDetail from "../blogs/BlogDetail";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// --- 1. Background Assets ---

const GoldDustPattern = () => (
  <div className="absolute inset-0 pointer-events-none opacity-40 z-0 mix-blend-screen">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.6"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0 0 0.8 0 0 0 0 0 0.2 0 0 0 0 0 1 0"
        />
      </filter>
      <rect
        width="100%"
        height="100%"
        filter="url(#noiseFilter)"
        opacity="0.15"
      />
    </svg>
  </div>
);

const CornerMandala = ({ position }) => (
  <div
    className={`absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] pointer-events-none z-0 opacity-[0.08] ${position}`}
  >
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-yellow-600 fill-current animate-spin-slow"
    >
      <path d="M100 0 L110 30 L140 20 L130 50 L160 60 L130 80 L140 110 L110 100 L100 130 L90 100 L60 110 L70 80 L40 60 L70 50 L60 20 L90 30 Z" />
      <circle
        cx="100"
        cy="100"
        r="45"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle
        cx="100"
        cy="100"
        r="65"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="4 2"
        fill="none"
      />
      <path
        d="M100 10 Q140 10 140 50 T100 90 T60 50 T100 10"
        fill="none"
        stroke="currentColor"
      />
      <path
        d="M100 190 Q60 190 60 150 T100 110 T140 150 T100 190"
        fill="none"
        stroke="currentColor"
      />
      <path
        d="M10 100 Q10 140 50 140 T90 100 T50 60 T10 100"
        fill="none"
        stroke="currentColor"
      />
      <path
        d="M190 100 Q190 60 150 60 T110 100 T150 140 T190 100"
        fill="none"
        stroke="currentColor"
      />
    </svg>
  </div>
);

const BlogSection = () => {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const { language } = useLanguage();

  // State
  const [blogs, setBlogs] = useState([]);
  const [processedBlogs, setProcessedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Helper: Calculate Average Rating
  const getAverageRating = (blog) => {
    if (!blog.reviews || blog.reviews.length === 0) return 0;
    const total = blog.reviews.reduce((acc, r) => acc + r.rating, 0);
    return total / blog.reviews.length;
  };

  const fetchBlogs = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${API_BASE}/api/blogs`, { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (blogId, reviewData) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${API_BASE}/api/blogs/${blogId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (data.success) {
        setBlogs((prev) => prev.map((b) => (b._id === blogId ? data.blog : b)));
        setSelectedBlog(data.blog);
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  // --- Scroll Handler (Dynamic Calculation) ---
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Calculate scroll amount based on the width of the first card + gap
      const card = container.querySelector(".blog-card-wrapper");
      const cardWidth = card ? card.offsetWidth : 400;
      const gap = 24; // gap-6 = 24px

      const scrollAmount = cardWidth + gap;
      const targetScroll =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  // --- Sorting Logic ---
  useEffect(() => {
    if (blogs.length > 0) {
      const sortedByDate = [...blogs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      const newestBlog = sortedByDate[0];
      const otherBlogs = sortedByDate.slice(1);
      const sortedByRating = otherBlogs.sort(
        (a, b) => getAverageRating(b) - getAverageRating(a),
      );
      const finalOrder = [newestBlog, ...sortedByRating].filter(Boolean);
      setProcessedBlogs(finalOrder);
    }
  }, [blogs]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (loading || processedBlogs.length === 0) return;
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      gsap.from(".blog-header", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      gsap.from(".blog-card-wrapper", {
        x: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: { trigger: ".blog-scroller", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, processedBlogs]);

  return (
    <section
      ref={sectionRef}
      className="blog-section relative min-h-screen py-20 overflow-hidden flex flex-col items-center"
      style={{ backgroundColor: "#0a0300" }}
    >
      {/* CSS Overrides */}
      <style jsx>{`
        .blog-card-wrapper h3,
        .blog-card-wrapper h4,
        .blog-card-wrapper .card-title {
          color: #ffffff !important;
          font-size: 1.1rem !important;
          line-height: 1.4 !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-[radial-gradient(circle,rgba(234,179,8,0.15)_0%,transparent_70%)] pointer-events-none z-0"></div>
      <GoldDustPattern />
      <CornerMandala position="-top-[10%] -left-[10%] rotate-0" />
      <CornerMandala position="-bottom-[10%] -right-[10%] rotate-90" />

      {/* --- HEADER --- */}
      <div className="blog-header text-center mb-12 z-10 relative px-4">
        <h2 className="text-5xl md:text-6xl font-bold mb-3 tracking-wide drop-shadow-lg text-[#fbbf24]">
          {language === "kn" ? "ಬರಹಗಳು" : "Articles"}
        </h2>
        <div className="flex flex-col items-center justify-center gap-1 opacity-90">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent"></div>
            <div className="text-[#fbbf24] text-lg">♦</div>
            <div className="h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent via-[#fbbf24] to-transparent"></div>
          </div>
          <p className="text-[#fbbf24] text-lg md:text-xl font-light tracking-wide mt-1">
            {language === "kn" ? "ಇಲ್ಲಿ ಮೂಡುವ ಬರಹಗಳು ಕೇವಲ ಕಲ್ಪನೆಗಳಲ್ಲ, ನಮ್ಮ ಮನಸಿನ ಮಾತುಗಳು, ನಮ್ಮ ಊರಿನ ಸುಗಂಧ, ನಮ್ಮ ಜನರ ಬದುಕಿನ ಸ್ಪಂದನ." 
            : "The writings that emerge here are not mere imaginations; they are the voices of our hearts, the fragrance of our village, and the pulse of our people’s lives."}
          </p>
        </div>
      </div>

      {/* --- HORIZONTAL SCROLL CONTAINER --- */}
      <div className="relative w-full max-w-[1600px] z-10 px-6 sm:px-8 md:px-12">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center gap-4 mt-12 text-[#fbbf24]">
            <div className="w-12 h-12 border-4 border-[#fbbf24] border-t-transparent rounded-full animate-spin"></div>
            <p className="tracking-widest text-sm uppercase">Loading...</p>
          </div>
        )}

        {!loading && processedBlogs.length > 0 && (
          <div className="relative group/carousel">
            {/* Left Button (Desktop) */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-20 
                bg-[#0a0500] border border-[#fbbf24]/50 text-[#fbbf24] p-3 rounded-full 
                shadow-[0_0_15px_rgba(251,191,36,0.2)]
                hover:bg-[#fbbf24] hover:text-black hover:scale-110 transition-all duration-300
                hidden md:flex items-center justify-center opacity-80 hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Scrollable Area */}
            <div
              ref={scrollContainerRef}
              className="blog-scroller no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-8"
            >
              {processedBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="blog-card-wrapper flex-shrink-0 snap-start w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-h-[420px]"
                >
                  <BlogCard blog={blog} onClick={setSelectedBlog} />
                </div>
              ))}
            </div>

            {/* Right Button (Desktop) */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-20 
                bg-[#0a0500] border border-[#fbbf24]/50 text-[#fbbf24] p-3 rounded-full 
                shadow-[0_0_15px_rgba(251,191,36,0.2)]
                hover:bg-[#fbbf24] hover:text-black hover:scale-110 transition-all duration-300
                hidden md:flex items-center justify-center opacity-80 hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>

            {/* --- MOBILE NAVIGATION BUTTONS (Visible only on small screens) --- */}
            <div className="flex md:hidden items-center justify-center gap-6 mt-4">
              <button
                onClick={() => scroll("left")}
                className="bg-[#0a0500] border border-[#fbbf24]/50 text-[#fbbf24] p-4 rounded-full 
                  active:scale-95 active:bg-[#fbbf24] active:text-black transition-all duration-200"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="bg-[#0a0500] border border-[#fbbf24]/50 text-[#fbbf24] p-4 rounded-full 
                  active:scale-95 active:bg-[#fbbf24] active:text-black transition-all duration-200"
                aria-label="Scroll Right"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && processedBlogs.length === 0 && (
          <div className="text-center bg-black/40 p-10 rounded-2xl border border-[#fbbf24]/20 backdrop-blur-md max-w-lg mx-auto">
            <p className="text-2xl text-[#fbbf24] font-serif mb-2">
              No Articles Available
            </p>
            <p className="text-stone-400">Check back later for updates.</p>
          </div>
        )}
      </div>

      {/* --- DETAIL MODAL --- */}
      {selectedBlog && (
        <BlogDetail
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
          onReviewSubmit={handleReviewSubmit}
        />
      )}
    </section>
  );
};

export default BlogSection;