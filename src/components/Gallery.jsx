import React, { useState, useEffect } from "react";

export default function AdminGallery() {
  const [mediaList, setMediaList] = useState([]);
  const [preview, setPreview] = useState(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const fetchMedia = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/gallery`);
      const data = await res.json();
      setMediaList(data);
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error while fetching media.");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setStatus("🗑️ Media deleted.");
        fetchMedia();
      } else {
        setStatus("❌ Failed to delete.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error during delete.");
    }
  };

  return (
    <div className="p-6 mt-20 min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🖼️ Gallery
      </h2>

      {/* Media List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaList.length === 0 ? (
          <p className="col-span-full text-center text-gray-400">
            No media uploaded yet.
          </p>
        ) : (
          mediaList.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col cursor-pointer relative group"
              onClick={() => setPreview(item)} // open modal
            >
              {item.mediaType === "video" ? (
                <div className="relative">
                  <video
                    src={`${item.mediaUrl}`}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                    muted
                  />
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black bg-opacity-50 rounded-full p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="white"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="w-10 h-10"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.25 5.25v13.5l13.5-6.75-13.5-6.75z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              ) : (
                <img
                  src={`${item.mediaUrl}`}
                  alt={item.desc}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="text-sm font-semibold text-lime-400 text-center">
                {item.desc}
              </h3>
            </div>
          ))
        )}
      </div>


      {/* Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {preview.mediaType === "video" ? (
              <video
                controls
                autoPlay
                src={`${preview.mediaUrl}`}
                className="max-h-[80vh] w-auto rounded-lg"
              />
            ) : (
              <img
                src={`${preview.mediaUrl}`}
                alt={preview.desc}
                className="max-h-[80vh] w-auto rounded-lg"
              />
            )}
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
