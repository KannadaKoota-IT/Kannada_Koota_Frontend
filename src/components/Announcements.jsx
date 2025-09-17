import React, { useEffect, useState } from "react";
import "./styles/Announcements.css";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchAnnouncements() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/announcements`);
        const data = await res.json();
        if (data && data.success) {
          setAnnouncements(data.announcements);
        } else {
          setAnnouncements([]);
        }
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, [API_BASE]);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="announcements-section">
      <div className="announcements-container">
        {/* Header */}
        <div className="announcements-header">
          <h1 className="announcements-title">Announcements</h1>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="loading-box">
            <div className="loader"></div>
            <p>Loading announcements…</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="empty-box">
            <div className="emoji">📝</div>
            <h3>No announcements yet</h3>
            <p>Check back later for updates!</p>
          </div>
        ) : (
          <div className="announcements-list">
            {announcements.map((a) => {
              const isExpanded = expandedId === a._id;
              return (
                <div
                  key={a._id}
                  onClick={() => toggleExpand(a._id)}
                  className={`announcement-card ${isExpanded ? "expanded" : ""}`}
                >
                  {/* Compact view */}
                  {!isExpanded && (
                    <>
                      <div className="card-header">
                        <h3>{a.title}</h3>
                        {a.date && (
                          <span className="date">
                            {new Date(a.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="card-message">{a.message}</p>
                      {a.link && (
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="card-link"
                        >
                          🔗 View Link
                        </a>
                      )}
                    </>
                  )}

                  {/* Expanded view */}
                  {isExpanded && (
                    <div className="expanded-content">
                      <div className="card-header">
                        <h3>{a.title}</h3>
                        {a.date && (
                          <span className="date">
                            {new Date(a.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p>{a.message}</p>
                      {a.link && (
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="expanded-link"
                        >
                          🔗 Open Link
                        </a>
                      )}
                      {a.mediaUrl && (
                        <div className="media-box">
                          {a.mediaType === "image" ? (
                            <img src={a.mediaUrl} alt="announcement" />
                          ) : (
                            <video src={a.mediaUrl} controls />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
