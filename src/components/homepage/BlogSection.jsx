import React, { useEffect, useState } from "react";
import { BookOpen, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import BlogCard from "../blogs/BlogCard";
import BlogDetail from "../blogs/BlogDetail";

export default function BlogSection() {
  const { language, isKannada } = useLanguage();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/blogs?lang=${language}`);
        const data = await res.json();
        if (isMounted) {
          const list = data?.blogs || (Array.isArray(data) ? data : []);
          setBlogs(list);
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        if (isMounted) setBlogs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, [language, API_BASE]);

  const handleReviewSubmit = async (blogId, reviewData) => {
    try {
      const res = await fetch(`${API_BASE}/api/blogs/${blogId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (data?.success && data?.blog) {
        setBlogs((prev) => prev.map((b) => (b._id === blogId ? data.blog : b)));
        setSelectedBlog(data.blog);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  const handleNext = () => {
    if (currentIndex + 3 < blogs.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section id="blogs" className="py-16 sm:py-20 border-t border-[#EFEBE4] scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EFEBE4]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E1] text-[#7C5800] border border-[#F5B000]/40 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C4151C]" />
            <span className="font-kannada">
              {isKannada
                ? "ಸಾಹಿತ್ಯ & ಲೇಖನಗಳು • LITERATURE"
                : "LITERATURE & ESSAYS"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1B1B] font-kannada">
            {isKannada
              ? "ಸಾಹಿತ್ಯ ಕಣಜ & ವಿದ್ಯಾರ್ಥಿ ಲೇಖನಗಳು"
              : "Literature & Student Chronicles"}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C403D] mt-1 font-kannada">
            {isKannada
              ? "ನಮ್ಮ ಸದಸ್ಯರಿಂದ ಕವಿತೆ, ವಿಮರ್ಶಾತ್ಮಕ ಪ್ರಬಂಧಗಳು ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಬರಹಗಳು."
              : "Poetry, analytical essays, theatre retrospectives, and cultural writings from our members."}
          </p>
        </div>

        {/* Carousel controls if blogs > 3 */}
        {blogs.length > 3 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg border border-[#EFEBE4] bg-white hover:bg-[#F6F3F2] disabled:opacity-40 text-[#1C1B1B] cursor-pointer transition-colors"
              aria-label="Previous Articles"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex + 3 >= blogs.length}
              className="p-2 rounded-lg border border-[#EFEBE4] bg-white hover:bg-[#F6F3F2] disabled:opacity-40 text-[#1C1B1B] cursor-pointer transition-colors"
              aria-label="Next Articles"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#5C403D] font-kannada">
          {isKannada ? "ಲೇಖನಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ..." : "Loading articles..."}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#EFEBE4] p-8 space-y-2">
          <BookOpen className="w-8 h-8 text-[#916F6B] mx-auto" />
          <h4 className="text-base font-bold text-[#1C1B1B] font-kannada">
            {isKannada
              ? "ಇನ್ನೂ ಲೇಖನಗಳನ್ನು ಪ್ರಕಟಿಸಲಾಗಿಲ್ಲ"
              : "No articles published yet"}
          </h4>
          <p className="text-xs text-[#5C403D] font-kannada">
            {isKannada
              ? "ಲೇಖನಗಳು ಮತ್ತು ಸಾಹಿತ್ಯ ಕೃತಿಗಳು ಶೀಘ್ರದಲ್ಲೇ ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳಲಿವೆ."
              : "Articles and literary works will appear here soon."}
          </p>
        </div>
      ) : (
        /* items-stretch applied here to ensure equal heights across the grid row */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {blogs.slice(currentIndex, currentIndex + 3).map((blog) => (
            <BlogCard
              key={`${blog._id}-${language}`}
              blog={blog}
              onClick={(b) => setSelectedBlog(b)}
            />
          ))}
        </div>
      )}

      {/* Reading Detail Modal */}
      {selectedBlog && (
        <BlogDetail
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
          onReviewSubmit={handleReviewSubmit}
        />
      )}
    </section>
  );
}
