import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./styles/Teams.css";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [teamHeads, setTeamHeads] = useState({});
  const [currentHead, setCurrentHead] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    let mounted = true;
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/teams`);
        const data = await res.json();
        if (!mounted) return;
        setTeams(data.teams || []);
      } catch (err) {
        console.error("fetchTeams:", err);
        if (!mounted) return;
        setTeams([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchTeams();
    return () => (mounted = false);
  }, [API_BASE]);

  useEffect(() => {
    let mounted = true;
    const fetchAllHeads = async () => {
      if (!teams || teams.length === 0) {
        setTeamHeads({});
        return;
      }
      const promises = teams.map(async (team) => {
        try {
          const res = await fetch(`${API_BASE}/api/teams/${team._id}/members`);
          const json = await res.json();
          return { teamId: team._id, heads: json.heads || [] };
        } catch (err) {
          console.error("fetch heads for", team._id, err);
          return { teamId: team._id, heads: [] };
        }
      });
      const results = await Promise.all(promises);
      if (!mounted) return;
      const obj = {};
      results.forEach((r) => (obj[r.teamId] = r.heads));
      setTeamHeads(obj);
    };
    fetchAllHeads();
    return () => (mounted = false);
  }, [teams, API_BASE]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && currentHead) setCurrentHead(null);
    },
    [currentHead]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // Inline background style using the OurMembers gradient (applies to entire page)
  const globalBgStyle = {
    position: "fixed",
    inset: 0,
    zIndex: -1,
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
  };

  const globalBgHighlightsStyle = {
    content: "''",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 255, 117, 0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  };

  return (
    <div className="teams-page">
      {/* single global background layer (full-page gradient from OurMembers) */}
      <div className="teams-global-bg" style={globalBgStyle}>
        <div style={globalBgHighlightsStyle} />
      </div>

      <div className="container">
        <header className="teams-header">
          <h1 className="teams-main-title">All Teams</h1>
        </header>

        {loading && teams.length === 0 ? (
          <div className="teams-loading">Loading…</div>
        ) : teams.length === 0 ? (
          <div className="teams-empty">
            <div className="empty-emoji">👥</div>
            <h2>No teams yet</h2>
            <p>Create teams in the admin to populate this page.</p>
          </div>
        ) : (
          teams.map((team) => (
            <section key={team._id} className="team-section">
              <div className="team-title-row">
                <Link to={`/team-details/${team._id}`} className="team-name-link">
                  {team.team_name}
                </Link>
              </div>

              <div className="heads-grid">
                {Array.isArray(teamHeads[team._id]) && teamHeads[team._id].length > 0 ? (
                  teamHeads[team._id].map((head) => (
                    <div
                      key={head._id}
                      className="head-portrait-card"
                    >
                      <img
                        src={head.image_url || "/default_img.jpg"}
                        alt={head.name}
                        className="head-portrait-image"
                      />
                      <div className="head-portrait-overlay">
                        <div className="head-portrait-text">
                          <h3>{head.name}</h3>
                          {head.role && <p>Head</p>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-heads">No heads added yet.</div>
                )}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Modal */}
      {/* {currentHead && (
        <div className="modal-overlay" onClick={() => setCurrentHead(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${currentHead.name} details`}
          >
            <button className="modal-close" onClick={() => setCurrentHead(null)} aria-label="Close">
              ✕
            </button>

            <div className="modal-grid">
              <div className="modal-left">
                <img
                  src={currentHead.image_url || "/default_img.jpg"}
                  alt={currentHead.name}
                  className="modal-avatar"
                />
              </div>
              <div className="modal-right">
                <h3 className="modal-name">{currentHead.name}</h3>
                <p className="modal-role">{currentHead.role || "Head"}</p>
                {currentHead.bio ? (
                  <p className="modal-bio">{currentHead.bio}</p>
                ) : (
                  <p className="modal-bio muted">No bio provided.</p>
                )}

                <div className="modal-meta">
                  {currentHead.email && (
                    <div>
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${currentHead.email}`}>{currentHead.email}</a>
                    </div>
                  )}
                  {currentHead.phone && (
                    <div>
                      <strong>Phone:</strong> <span>{currentHead.phone}</span>
                    </div>
                  )}
                  {currentHead.linkedin && (
                    <div>
                      <strong>LinkedIn:</strong>{" "}
                      <a href={currentHead.linkedin} target="_blank" rel="noreferrer">
                        Profile
                      </a>
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button className="btn-close" onClick={() => setCurrentHead(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
