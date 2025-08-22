import React, { useEffect, useState } from "react";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);


  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const API = `${API_BASE}/api/events`;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen mt-25 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
    <div className="min-h-screen mt-25 bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="fixed top-25 right-6 text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mb-6 shadow-2xl">
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Events
          </h1>
        </div>

        {/* Events Grid */}
        <div className="mb-8">
          {loading && events.length === 0 ? (
            <div className="text-center py-16">
              <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-300 text-lg">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">📅</div>
              <h3 className="text-2xl font-semibold text-slate-300 mb-4">No events</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/15"
                >
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={`${event.imageUrl}`}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}

                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 flex-1 pr-2">
                        {event.title}
                      </h3>
                      <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <p className="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-3">
                      {event.description}
                    </p>

                    {event.location && (
                      <div className="flex items-center text-slate-400 text-sm mb-4">
                        <span className="mr-2">📍</span>
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}