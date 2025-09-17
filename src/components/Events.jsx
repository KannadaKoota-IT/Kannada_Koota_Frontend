import React, { useEffect, useState } from "react";
import "./styles/Events.css";

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
    <div className="events-section">
      <div className="events-container">
        {/* Header */}
        <div className="events-header">
          <h1 className="events-title">Events</h1>
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {loading && events.length === 0 ? (
            <div className="loading-box">
              <div className="loader"></div>
              <p>Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-box">
              <div className="emoji">📅</div>
              <h3>No events yet</h3>
              <p>Check back later for upcoming events!</p>
            </div>
          ) : (
            <div className="grid-cards">
              {events.map((event) => (
                <div key={event._id} className="event-card">
                  {/* Image */}
                  {event.imageUrl && (
                    <div className="event-image">
                      <img src={event.imageUrl} alt={event.title} />
                      <div className="image-overlay"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="event-content">
                    <div className="card-header">
                      <h3>{event.title}</h3>
                      <span className="date">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="description">{event.description}</p>
                    {event.location && (
                      <div className="location">
                        <span>📍 {event.location}</span>
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
