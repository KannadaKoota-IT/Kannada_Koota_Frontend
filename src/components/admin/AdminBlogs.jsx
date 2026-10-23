import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Trash2, 
  Plus, 
  X, 
  Upload, 
  BookOpen, 
  Star, 
  MessageSquare, 
  User, 
  Calendar 
} from "lucide-react";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/blogs`);
      if (res.data.success) {
        setBlogs(res.data.blogs || []);
      }
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author) {
      toast.warning("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("author", formData.author);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const res = await axios.post(`${API_BASE}/api/blogs`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res.data.success) {
        toast.success("Article created and published!");
        setBlogs([res.data.blog, ...blogs]);
        setShowModal(false);
        setFormData({ title: "", content: "", author: "", image: null });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create article");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await axios.delete(`${API_BASE}/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res.data.success) {
        toast.success("Article deleted successfully");
        setBlogs(blogs.filter((blog) => blog._id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete article");
    }
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" theme="light" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFEBE4]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#9B000E]">
            ಲೇಖನಗಳ ನಿರ್ವಹಣೆ
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1B1B] font-kannada">
            Articles & Blogs Console
          </h1>
          <p className="text-xs sm:text-sm text-[#5C403D]">
            Publish member essays, poetry, club chronicles, and literary reviews.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-[#9B000E] hover:bg-[#7D000B] text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-20 text-[#5C403D]">
          <div className="w-10 h-10 mx-auto border-4 border-[#EFEBE4] border-t-[#9B000E] rounded-full animate-spin mb-3" />
          <p className="text-xs">Loading articles...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#EFEBE4] text-sm text-[#5C403D]">
          No articles published yet. Click "New Article" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-[#F6F3F2] overflow-hidden">
                  {blog.imageUrl ? (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full crimson-gradient flex items-center justify-center text-white/30">
                      <BookOpen className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-base text-[#1C1B1B] font-kannada line-clamp-1">
                    {blog.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-[#916F6B]">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#9B000E]" />
                      <span className="truncate">{blog.author}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold bg-[#FFF8E1] text-[#7C5800] px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#F5B000] fill-current" />
                      <span>
                        {blog.ratings?.length
                          ? (blog.ratings.reduce((a, b) => a + b, 0) / blog.ratings.length).toFixed(1)
                          : "New"}
                      </span>
                    </span>
                    <span className="text-[11px] font-semibold bg-[#FCF9F8] text-[#5C403D] px-2 py-0.5 rounded-md border border-[#EFEBE4] flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-[#916F6B]" />
                      <span>{blog.reviews?.length || 0} reviews</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#EFEBE4] mt-2 pt-3 flex justify-end">
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Article</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#EFEBE4] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#EFEBE4] flex justify-between items-center bg-[#FCF9F8]">
              <h3 className="text-lg font-bold text-[#1C1B1B] font-kannada">
                ಹೊಸ ಲೇಖನ ಪ್ರಕಟಿಸಿ (Create New Article)
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#5C403D] hover:text-[#1C1B1B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. History of Yakshagana in Karnataka"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1">
                  Author Name *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="e.g. Sahana Rao"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Write article content here..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFEBE4] text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1">
                  Cover Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-[#5C403D] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-[#EFEBE4] file:bg-[#FCF9F8] file:text-xs file:font-semibold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EFEBE4]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl border border-[#EFEBE4] text-[#5C403D] hover:bg-[#F6F3F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-[#9B000E] text-white hover:bg-[#7D000B] shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? "Publishing..." : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
