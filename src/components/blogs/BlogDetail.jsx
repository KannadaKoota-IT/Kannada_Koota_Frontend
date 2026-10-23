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
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import {
  getMediaUrl,
  handleImageError,
  DEFAULT_BLOG_IMAGE,
} from "../../utils/mediaUtils";

const BlogDetail = ({ blog, onClose, onReviewSubmit }) => {
  const { language, isKannada } = useLanguage();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // --- Reviews Toggle ---
  const [showAllReviews, setShowAllReviews] = useState(false);

  // --- Lock Body Scroll ---
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
        month: "short",
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
    setShowAllReviews(true);
  };

  // --- Translation Dictionary ---
  const t = {
    writeReview: language === "kn" ? "ವಿಮರ್ಶೆ ಬರೆಯಿರಿ" : "Write a Review",
    shareExp:
      language === "kn"
        ? "ನಿಮ್ಮ ಅನಿಸಿಕೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ."
        : "Share your thoughts with the community.",
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
      language === "kn" ? "ಇನ್ನೂ ಯಾವುದೇ ವಿಮರ್ಶೆಗಳಿಲ್ಲ." : "No reviews yet.",
    noReviewsSub:
      language === "kn"
        ? "ಮೊದಲಿಗರಾಗಿ ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ತಿಳಿಸಿ."
        : "Be the first to share your wisdom.",
    anonymous: language === "kn" ? "ಅನಾಮಧೇಯ" : "Anonymous",
    admin: language === "kn" ? "ನಿರ್ವಾಹಕ" : "Admin",
    viewAll:
      language === "kn" ? "ಎಲ್ಲಾ ವಿಮರ್ಶೆಗಳನ್ನು ನೋಡಿ" : "View all reviews",
    viewLess: language === "kn" ? "ಕಡಿಮೆ ನೋಡಿ" : "Show less",
    blogCategory: language === "kn" ? "ಲೇಖನ" : "Article",
  };

  // Language translation helpers
  const getTitle = () =>
    isKannada ? blog.title_k || blog.title : blog.title || blog.title_k;
  const getContent = () => {
    const content = isKannada
      ? blog.content_k || blog.content
      : blog.content || blog.content_k;
    return content || "";
  };
  const getAuthor = () => {
    if (blog.author_k && isKannada) return blog.author_k;
    return blog.author || t.admin;
  };

  // Prepare Reviews List (Latest First)
  const allReviews = blog.reviews ? blog.reviews.slice().reverse() : [];
  const visibleReviews = showAllReviews ? allReviews : allReviews.slice(0, 3);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* 1. Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 2. Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-5xl bg-[#FCF9F8] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] border border-[#EFEBE4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 bg-black/40 hover:bg-black/80 text-white rounded-full backdrop-blur-sm shadow-md transition-all duration-200 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- Scrollable Content Body --- */}
        <div className="flex-1 overflow-y-auto custom-light-scrollbar bg-[#FCF9F8]">
          {/* Hero Image Section - Fixed cropping using atmospheric background + object-contain */}
          <div className="relative h-64 sm:h-80 md:h-[26rem] w-full bg-[#1A1A1A] shrink-0 overflow-hidden flex items-center justify-center">
            {blog.imageUrl ? (
              <>
                {/* Atmospheric blurred background */}
                <img
                  src={getMediaUrl(blog.imageUrl, DEFAULT_BLOG_IMAGE)}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
                />
                {/* Uncropped main image */}
                <img
                  src={getMediaUrl(blog.imageUrl, DEFAULT_BLOG_IMAGE)}
                  alt={getTitle()}
                  onError={(e) => handleImageError(e, DEFAULT_BLOG_IMAGE)}
                  className="relative z-10 w-full h-full object-contain"
                />
              </>
            ) : (
              <div className="w-full h-full crimson-gradient flex flex-col items-center justify-center text-white/50 relative z-10">
                <FileText className="w-16 h-16 mb-2 opacity-80" />
                <span className="font-kannada text-lg">{t.blogCategory}</span>
              </div>
            )}
            {/* Subtle bottom gradient to blend image smoothly into the content below */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none z-10" />
          </div>

          {/* Main Article Content */}
          <div className="px-5 sm:px-10 lg:px-14 pt-8 pb-12 bg-white rounded-t-3xl -mt-6 relative z-20 border-t border-[#EFEBE4]">
            {/* Title & Meta */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E1] text-[#7C5800] border border-[#F5B000]/40 text-xs font-semibold mb-4">
                <FileText className="w-3.5 h-3.5 text-[#C4151C]" />
                <span className="font-kannada uppercase tracking-wider">
                  {t.blogCategory}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1B1B] font-kannada leading-tight mb-6">
                {getTitle()}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#5C403D] border-y border-[#EFEBE4] py-3">
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="w-4 h-4 text-[#9B000E]" />
                  <span className="font-kannada uppercase tracking-wide">
                    {getAuthor()}
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#D1C8C6] hidden sm:block" />
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-[#9B000E]" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Article Text */}
            <div className="prose max-w-none text-base sm:text-lg text-[#1C1B1B] leading-relaxed space-y-6 font-kannada font-medium">
              {getContent()
                .split("\n")
                .map((paragraph, idx) => {
                  if (!paragraph.trim()) return null;
                  return (
                    <p
                      key={idx}
                      className={
                        idx === 0
                          ? "first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-bold first-letter:text-[#9B000E] first-letter:mr-2 first-letter:float-left first-letter:leading-none"
                          : ""
                      }
                    >
                      {paragraph}
                    </p>
                  );
                })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative h-px w-full bg-[#EFEBE4]">
            <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-[#FCF9F8] px-4 text-[#9B000E]">
              <MessageSquare className="w-5 h-5 opacity-40" />
            </div>
          </div>

          {/* Comments & Reviews Section */}
          <div className="px-5 sm:px-10 lg:px-14 py-12 bg-[#FCF9F8]">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: Form */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EFEBE4] elevation-1 lg:sticky lg:top-6">
                  <h3 className="text-xl font-bold text-[#1C1B1B] font-kannada mb-1 flex items-center gap-2">
                    {t.writeReview}
                  </h3>
                  <p className="text-xs text-[#5C403D] font-kannada mb-6">
                    {t.shareExp}
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5 font-kannada"
                  >
                    {/* Name Input */}
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#916F6B] mb-2">
                        {t.nameLabel}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.namePlaceholder}
                        className="w-full bg-[#F6F3F2] border border-[#EFEBE4] rounded-xl px-4 py-3 text-sm text-[#1C1B1B] placeholder:text-[#916F6B] focus:outline-none focus:border-[#9B000E] focus:ring-1 focus:ring-[#9B000E] transition-all"
                      />
                    </div>

                    {/* Rating Input */}
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#916F6B] mb-2">
                        {t.ratingLabel}
                      </label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="group p-1 transition-transform active:scale-90"
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                rating >= star
                                  ? "fill-[#F5B000] text-[#F5B000]"
                                  : "text-[#EFEBE4] fill-[#EFEBE4] group-hover:fill-[#F5B000]/40"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Input */}
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#916F6B] mb-2">
                        {t.thoughtsLabel}
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows="4"
                        placeholder={t.thoughtsPlaceholder}
                        className="w-full bg-[#F6F3F2] border border-[#EFEBE4] rounded-xl px-4 py-3 text-sm text-[#1C1B1B] placeholder:text-[#916F6B] focus:outline-none focus:border-[#9B000E] focus:ring-1 focus:ring-[#9B000E] transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 crimson-gradient text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-95 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{t.submitBtn}</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Reviews List */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="flex items-center justify-between mb-6 border-b border-[#EFEBE4] pb-3">
                  <h3 className="text-xl font-bold text-[#1C1B1B] font-kannada">
                    {t.communityThoughts}
                  </h3>
                  <span className="text-xs font-bold bg-[#F6F3F2] text-[#9B000E] px-2.5 py-1 rounded-full border border-[#EFEBE4]">
                    {blog.reviews?.length || 0} {t.reviewsCount}
                  </span>
                </div>

                <div className="space-y-4">
                  {allReviews.length > 0 ? (
                    <>
                      <AnimatePresence>
                        {visibleReviews.map((review, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className="bg-white p-5 rounded-xl border border-[#EFEBE4] hover:shadow-sm transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#F6F3F2] border border-[#EFEBE4] flex items-center justify-center text-[#9B000E] font-bold text-sm shrink-0">
                                  {review.name
                                    ? review.name.charAt(0).toUpperCase()
                                    : "A"}
                                </div>
                                <div className="font-kannada">
                                  <span className="font-bold text-[#1C1B1B] block text-sm">
                                    {review.name || t.anonymous}
                                  </span>
                                  <span className="text-[10px] text-[#5C403D] uppercase tracking-wider block mt-0.5">
                                    {formatDate(review.date)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < review.rating
                                        ? "fill-[#F5B000] text-[#F5B000]"
                                        : "text-[#EFEBE4] fill-[#EFEBE4]"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-[#5C403D] text-sm leading-relaxed pl-12 font-kannada">
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
                          className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-[#9B000E] bg-[#F6F3F2] hover:bg-[#EFEBE4] rounded-xl transition-colors mt-2 cursor-pointer font-kannada"
                        >
                          {showAllReviews ? (
                            <>
                              {t.viewLess} <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              {t.viewAll} <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </motion.button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 bg-white border border-[#EFEBE4] rounded-2xl font-kannada">
                      <div className="w-12 h-12 bg-[#F6F3F2] rounded-full flex items-center justify-center mx-auto mb-3 text-[#916F6B]">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <p className="text-[#1C1B1B] font-bold text-base px-4 mb-1">
                        {t.noReviewsTitle}
                      </p>
                      <p className="text-xs text-[#5C403D]">{t.noReviewsSub}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Global Styles for the Light Custom Scrollbar */}
      <style jsx global>{`
        .custom-light-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-light-scrollbar::-webkit-scrollbar-track {
          background: #fcf9f8;
          border-radius: 10px;
        }
        .custom-light-scrollbar::-webkit-scrollbar-thumb {
          background: #efebe4;
          border-radius: 10px;
          border: 2px solid #fcf9f8;
        }
        .custom-light-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1c8c6;
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;
