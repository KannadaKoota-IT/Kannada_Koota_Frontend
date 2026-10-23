import React from "react";
import { Star, User, BookOpen } from "lucide-react";
import {
  getMediaUrl,
  handleImageError,
  DEFAULT_BLOG_IMAGE,
  DEFAULT_PERSON_IMAGE,
} from "../../utils/mediaUtils";
import { useLanguage } from "../../context/LanguageContext";

const BlogCard = ({ blog, onClick }) => {
  const { isKannada } = useLanguage();

  const averageRating =
    blog.ratings && blog.ratings.length > 0
      ? (blog.ratings.reduce((a, b) => a + b, 0) / blog.ratings.length).toFixed(
          1,
        )
      : "4.8";

  // Language translation helpers
  const getTitle = () =>
    isKannada ? blog.title_k || blog.title : blog.title || blog.title_k;
  const getContent = () =>
    isKannada ? blog.content_k || blog.content : blog.content || blog.content_k;
  const getAuthor = () => {
    if (blog.author_k && isKannada) return blog.author_k;
    return (
      blog.author || (isKannada ? "ಕನ್ನಡ ಕೂಟ ಸದಸ್ಯರು" : "Kannada Koota Member")
    );
  };

  return (
    <div
      onClick={() => onClick(blog)}
      className="group relative bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 hover:elevation-2 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
    >
      {/* 2px Gradient reveal on hover - shrink-0 prevents it from altering flex layout */}
      <div className="h-0.5 w-full bg-transparent group-hover:gold-crimson-bar transition-all duration-300 shrink-0" />

      {/* flex-1 ensures this container fills the card height */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Aspect-video banner - shrink-0 ensures the image never squishes */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-[#F6F3F2] border border-[#EFEBE4] shrink-0">
          {blog.imageUrl ? (
            <img
              src={getMediaUrl(blog.imageUrl, DEFAULT_BLOG_IMAGE)}
              alt={getTitle()}
              onError={(e) => handleImageError(e, DEFAULT_BLOG_IMAGE)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full crimson-gradient flex items-center justify-center text-white/50">
              <BookOpen className="w-10 h-10 text-white/70" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#7C5800] border border-[#F5B000]/40 shadow-xs font-kannada">
              {isKannada ? "ಸಾಹಿತ್ಯ ಲೇಖನ" : "Article"}
            </span>
          </div>
        </div>

        {/* Content Wrapper - flex-1 pushes the footer down to the bottom */}
        <div className="flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-lg font-bold text-[#1C1B1B] font-kannada leading-snug group-hover:text-[#9B000E] transition-colors line-clamp-2 mb-2">
            {getTitle()}
          </h3>

          {/* Excerpt if present */}
          {getContent() && (
            <p className="text-xs sm:text-sm text-[#5C403D] line-clamp-2 mb-4 leading-relaxed font-kannada">
              {getContent()}
            </p>
          )}
        </div>

        {/* Footer: Author & Rating - mt-auto keeps it locked to the bottom, shrink-0 maintains size */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-[#EFEBE4] shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#FFF8E1] border border-[#F5B000]/40 flex items-center justify-center overflow-hidden shrink-0 text-[#7C5800]">
              {blog.authorImage ? (
                <img
                  src={getMediaUrl(blog.authorImage, DEFAULT_PERSON_IMAGE)}
                  alt={getAuthor()}
                  onError={(e) => handleImageError(e, DEFAULT_PERSON_IMAGE)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={14} />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#1C1B1B] truncate block font-kannada">
                {getAuthor()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#FFF8E1] px-2 py-0.5 rounded-md border border-[#F5B000]/40 shrink-0">
            <Star size={12} className="text-[#F5B000] fill-[#F5B000]" />
            <span className="text-xs font-bold text-[#7C5800]">
              {averageRating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
