import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, Plus, X, Upload } from "lucide-react";

const AdminBlogs = () => {
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
  // Fallback for when localStorage isn't available (SSR)
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // Fetch Blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/blogs`);
      if (res.data.success) {
        setBlogs(res.data.blogs);
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

  // Handle Form Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Change
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Create Blog
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
        toast.success("Blog created successfully!");
        setBlogs([res.data.blog, ...blogs]);
        setShowModal(false);
        setFormData({ title: "", content: "", author: "", image: null });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create blog");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await axios.delete(`${API_BASE}/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res.data.success) {
        toast.success("Blog deleted successfully");
        setBlogs(blogs.filter((blog) => blog._id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div className="text-white p-6">
      <ToastContainer position="top-right" theme="dark" />

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Manage Blogs
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-900/20 font-medium"
        >
          <Plus size={20} />
          Create Blog
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-gray-800/30 rounded-xl border border-white/5">
              <p className="text-gray-400 text-lg">No blogs found.</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gray-800/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all group"
              >
                <div className="relative h-48 bg-gray-900">
                  {blog.imageUrl ? (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      📝
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="bg-red-500/80 hover:bg-red-600 p-2 rounded-full text-white transition-colors"
                      title="Delete Blog"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3
                    className="font-bold text-lg mb-1 line-clamp-1"
                    title={blog.title}
                  >
                    {blog.title}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      Author: {blog.author}
                    </span>
                    <span className="bg-white/5 px-2 py-0.5 rounded text-xs border border-white/5">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded border border-yellow-500/20">
                      Rating:{" "}
                      {blog.ratings?.length
                        ? (
                            blog.ratings.reduce((a, b) => a + b, 0) /
                            blog.ratings.length
                          ).toFixed(1)
                        : "New"}
                    </div>
                    <div className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">
                      Reviews: {blog.reviews?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-800 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-xl font-bold text-white">Create New Blog</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter blog title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Author Name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Content (Kannada)
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="6"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-kannada"
                  placeholder="Write content here..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cover Image
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors bg-black/20">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    name="image"
                    id="file-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {formData.image ? (
                      <div className="text-green-400 font-medium flex items-center gap-2">
                        <span>Selected: {formData.image.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-gray-400" size={32} />
                        <span className="text-gray-400 text-sm">
                          Click to upload cover image
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-purple-900/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? "Creating..." : "Create Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
