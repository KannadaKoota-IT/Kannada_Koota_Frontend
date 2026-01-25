import React, { useState, useEffect } from "react";
import {
  X,
  Star,
  User,
  Calendar,
  Send,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";

const BlogDetail = ({ blog, onClose, onReviewSubmit }) => {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // --- New State for Reviews Toggle ---
  const [showAllReviews, setShowAllReviews] = useState(false);

  // --- 1. Lock Body Scroll ---
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      language === "kn" ? "kn-IN" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;

    setSubmitting(true);
    await onReviewSubmit(blog._id, { name, comment, rating });
    setSubmitting(false);
    setComment("");
    setName("");
    setRating(5);
    // Optionally open the list to show the new review
    setShowAllReviews(true);
  };

  // --- Translation Dictionary ---
  const t = {
    writeReview: language === "kn" ? "ವಿಮರ್ಶೆ ಬರೆಯಿರಿ" : "Write a Review",
    shareExp:
      language === "kn"
        ? "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ."
        : "Share your experience with the community.",
    nameLabel: language === "kn" ? "ಹೆಸರು" : "Name",
    namePlaceholder:
      language === "kn" ? "ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)" : "Your name (optional)",
    ratingLabel: language === "kn" ? "ರೇಟಿಂಗ್" : "Rating",
    thoughtsLabel: language === "kn" ? "ಅಭಿಪ್ರಾಯ" : "Thoughts",
    thoughtsPlaceholder:
      language === "kn" ? "ನಿಮ್ಮ ಅಭಿಪ್ರಾಯವೇನು?" : "What did you think?",
    submitBtn: language === "kn" ? "ಸಲ್ಲಿಸಿ" : "Post Review",
    communityThoughts:
      language === "kn" ? "ಸಮುದಾಯದ ಅಭಿಪ್ರಾಯಗಳು" : "Community Thoughts",
    reviewsCount: language === "kn" ? "ವಿಮರ್ಶೆಗಳು" : "REVIEWS",
    noReviewsTitle:
      language === "kn"
        ? "ಇನ್ನೂ ಯಾವುದೇ ವಿಮರ್ಶೆಗಳಿಲ್ಲ."
        : "The scroll is yet to be written.",
    noReviewsSub:
      language === "kn"
        ? "ಮೊದಲಿಗರಾಗಿ ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ತಿಳಿಸಿ."
        : "Be the first to share your wisdom.",
    anonymous: language === "kn" ? "ಅನಾಮಧೇಯ" : "Anonymous User",
    admin: language === "kn" ? "ನಿರ್ವಾಹಕ" : "Admin",
    viewAll:
      language === "kn" ? "ಎಲ್ಲಾ ವಿಮರ್ಶೆಗಳನ್ನು ನೋಡಿ" : "View all reviews",
    viewLess: language === "kn" ? "ಕಡಿಮೆ ನೋಡಿ" : "Show less",
  };

  // Prepare Reviews List (Latest First)
  const allReviews = blog.reviews ? blog.reviews.slice().reverse() : [];
  const visibleReviews = showAllReviews ? allReviews : allReviews.slice(0, 3);

  return (
    // Outer Container: Z-Index 9999 to cover navbar
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 font-sans">
      {/* 1. Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={onClose}
      />

      {/* 2. Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-6xl bg-[#0a0500] border border-yellow-500/30 rounded-lg sm:rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/80 hover:bg-red-600 text-white p-2 sm:p-2.5 rounded-full transition-all duration-200 z-50 border border-white/20 hover:border-red-500 shadow-lg"
        >
          <X size={18} className="sm:hidden" />
          <X size={20} className="hidden sm:block" />
        </button>

        {/* --- Scrollable Content Body (INCLUDES IMAGE) --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 bg-[#0a0500]">
          {/* Hero Image Section - Now Inside Scrollable Area */}
          <div className="relative h-56 sm:h-72 md:h-80 lg:h-96 flex-shrink-0 group">
            {blog.imageUrl ? (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-yellow-900/20 via-[#0a0500] to-black flex items-center justify-center">
                <span className="text-4xl sm:text-6xl opacity-20 text-yellow-500">
                  ✤
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0500] via-[#0a0500]/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-10">
              <div className="mb-2 w-8 sm:w-12 h-0.5 sm:h-1 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" />

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2 sm:mb-3 font-serif drop-shadow-lg leading-tight">
                {blog.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-amber-100/80 text-xs sm:text-sm font-medium tracking-wide">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <User size={14} className="text-yellow-500 sm:w-4 sm:h-4" />
                  <span className="uppercase tracking-wider text-[10px] sm:text-xs">
                    {blog.author || t.admin}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar
                    size={14}
                    className="text-yellow-500 sm:w-4 sm:h-4"
                  />
                  <span className="uppercase tracking-wider text-[10px] sm:text-xs">
                    {formatDate(blog.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            {/* 1. Article Text */}
            <div className="prose prose-invert max-w-none mb-8 sm:mb-10 md:mb-12">
              <div className="text-base sm:text-lg md:text-xl leading-relaxed text-amber-100/90 font-light space-y-4 sm:space-y-5 md:space-y-6">
                {blog.content.split("\n").map((paragraph, idx) => (
                  <p
                    key={idx}
                    className={`${idx === 0 ? "first-letter:text-3xl sm:first-letter:text-4xl md:first-letter:text-5xl first-letter:font-serif first-letter:text-yellow-400 first-letter:mr-1 sm:first-letter:mr-2 first-letter:float-left" : ""}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 opacity-50 my-8 sm:my-10">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
              <div className="text-yellow-500 text-lg sm:text-xl">♦</div>
              <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-yellow-500 to-transparent" />
            </div>

            {/* 2. Reviews Section */}
            <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
              {/* Left Column: Form */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="bg-white/[0.03] p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-yellow-500/20 lg:sticky lg:top-4">
                  <h3 className="text-lg sm:text-xl font-serif text-yellow-400 mb-1 flex items-center gap-2">
                    <MessageSquare size={18} className="sm:w-5 sm:h-5" />{" "}
                    {t.writeReview}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-stone-500 mb-4 sm:mb-6">
                    {t.shareExp}
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-5"
                  >
                    {/* Name Input */}
                    <div>
                      <label className="block text-[10px] sm:text-xs uppercase tracking-widest text-yellow-500/80 mb-2">
                        {t.nameLabel}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.namePlaceholder}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>

                    {/* Rating Input */}
                    <div>
                      <label className="block text-[10px] sm:text-xs uppercase tracking-widest text-yellow-500/80 mb-2">
                        {t.ratingLabel}
                      </label>
                      <div className="flex gap-1.5 sm:gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="group p-0.5 sm:p-1 transition-transform active:scale-95"
                          >
                            <Star
                              size={20}
                              className={`sm:w-[22px] sm:h-[22px] transition-all ${
                                rating >= star
                                  ? "fill-yellow-500 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                                  : "text-stone-700 fill-none group-hover:text-stone-500"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Input */}
                    <div>
                      <label className="block text-[10px] sm:text-xs uppercase tracking-widest text-yellow-500/80 mb-2">
                        {t.thoughtsLabel}
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows="4"
                        placeholder={t.thoughtsPlaceholder}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black text-sm sm:text-base font-bold rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(234,179,8,0.3)]"
                    >
                      {submitting ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{t.submitBtn}</span>
                          <Send
                            size={14}
                            strokeWidth={2.5}
                            className="sm:w-4 sm:h-4"
                          />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Reviews List */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-serif text-white">
                    {t.communityThoughts}
                  </h3>
                  <span className="text-[10px] sm:text-xs font-mono text-yellow-500 border border-yellow-500/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    {blog.reviews?.length || 0} {t.reviewsCount}
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4 pr-1 sm:pr-2">
                  {allReviews.length > 0 ? (
                    <>
                      {/* Render Reviews */}
                      <AnimatePresence>
                        {visibleReviews.map((review, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className="bg-gradient-to-br from-white/[0.05] to-transparent p-4 sm:p-5 rounded-lg sm:rounded-xl border-l-2 border-l-yellow-500 border-t border-r border-b border-white/5 hover:border-white/10 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2 sm:mb-3">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-700 flex items-center justify-center text-black font-bold text-xs shadow-md flex-shrink-0">
                                  {review.name
                                    ? review.name.charAt(0).toUpperCase()
                                    : "A"}
                                </div>
                                <div>
                                  <span className="font-bold text-stone-200 block text-xs sm:text-sm">
                                    {review.name || t.anonymous}
                                  </span>
                                  <span className="text-[9px] sm:text-[10px] text-stone-500 uppercase tracking-wider block">
                                    {formatDate(review.date)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={11}
                                    className={`sm:w-3 sm:h-3 ${
                                      i < review.rating
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-stone-800 fill-stone-800"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed pl-9 sm:pl-11">
                              "{review.comment}"
                            </p>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* View More / View Less Toggle */}
                      {allReviews.length > 3 && (
                        <motion.button
                          layout
                          onClick={() => setShowAllReviews(!showAllReviews)}
                          className="w-full py-2 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-yellow-500/70 hover:text-yellow-400 border border-dashed border-yellow-500/30 rounded-lg hover:border-yellow-500/60 hover:bg-yellow-500/5 transition-all mt-2"
                        >
                          {showAllReviews ? (
                            <>
                              {t.viewLess}{" "}
                              <ChevronUp
                                size={12}
                                className="sm:w-[14px] sm:h-[14px]"
                              />
                            </>
                          ) : (
                            <>
                              {t.viewAll}{" "}
                              <ChevronDown
                                size={12}
                                className="sm:w-[14px] sm:h-[14px]"
                              />
                            </>
                          )}
                        </motion.button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-10 sm:py-12 border border-dashed border-white/10 rounded-lg sm:rounded-xl">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 text-yellow-500">
                        <MessageSquare size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <p className="text-stone-400 italic font-serif text-base sm:text-lg px-4">
                        "{t.noReviewsTitle}"
                      </p>
                      <p className="text-[10px] sm:text-xs text-stone-600 mt-1">
                        {t.noReviewsSub}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Styles for the custom golden scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(234, 179, 8, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(234, 179, 8, 0.6);
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;
