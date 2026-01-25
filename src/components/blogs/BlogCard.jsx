import React from "react";
import { Star, User } from "lucide-react";

const BlogCard = ({ blog, onClick }) => {
  // Calculate average rating
  const averageRating =
    blog.ratings && blog.ratings.length > 0
      ? (blog.ratings.reduce((a, b) => a + b, 0) / blog.ratings.length).toFixed(
          1,
        )
      : "New";

  return (
    <div
      onClick={() => onClick(blog)}
      className="relative w-full h-full bg-black/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#fbbf24]/40 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-[1.02] hover:border-[#fbbf24] transition-all duration-300 group"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24]/10 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Content Container with consistent padding */}
      <div className="flex flex-col h-full p-5 sm:p-6 relative z-10">
        {/* Title at Top */}
        <h3 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200 mb-4 text-center line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem] flex items-center justify-center font-kannada leading-tight">
          {blog.title}
        </h3>

        {/* Poster in Middle */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 border border-white/10 shadow-inner bg-gray-900">
          {blog.imageUrl ? (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <span className="text-3xl sm:text-4xl">📝</span>
            </div>
          )}
        </div>

        {/* Footer: Author (Left) & Rating (Right) */}
        <div className="flex justify-between items-end mt-auto pt-3 border-t border-white/10">
          {/* Author Details - Left */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center overflow-hidden border border-white/20">
              {blog.authorImage ? (
                <img
                  src={blog.authorImage}
                  alt={blog.author}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-400">Author</span>
              <span className="text-sm text-gray-200 font-medium line-clamp-1">
                {blog.author}
              </span>
            </div>
          </div>

          {/* Rating - Right */}
          <div className="flex flex-col items-end flex-shrink-0 ml-2">
            <span className="text-xs text-gray-400 mb-0.5">Rating</span>
            <div className="flex items-center gap-1 bg-yellow-500/10 px-2.5 py-1 rounded-md border border-yellow-500/20">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-yellow-300">
                {averageRating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
