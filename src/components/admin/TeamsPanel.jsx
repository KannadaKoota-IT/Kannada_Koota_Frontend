import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/TeamPanel.css"

export default function TeamsPanel() {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({ team_name: "" });
  const [teamPhoto, setTeamPhoto] = useState(null);
  const [status, setStatus] = useState("");

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/teams`);
      const data = await res.json();
      setTeams(data.teams || []);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to load teams");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("team_name", formData.team_name);
    if (teamPhoto) form.append("photo", teamPhoto);

    try {
      const res = await fetch(`${API_BASE}/api/teams`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (data?.team) {
        setStatus("✅ Team added");
        setFormData({ team_name: "" });
        setTeamPhoto(null);
        fetchTeams();
      } else {
        setStatus(data?.message || "❌ Failed to add team");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error");
    }
  };

  return (
    <div className="teams-container">
      <h2 className="teams-title">Teams Panel</h2>
      {status && <p className="status">{status}</p>}

      {/* Add Team Form */}
      <form className="team-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Team Name"
          className="input"
          value={formData.team_name}
          onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
          required
        />
        <input
          type="file"
          accept="image/*"
          className="file-input"
          onChange={(e) => setTeamPhoto(e.target.files[0])}
          required
        />
        <button type="submit" className="btn">
          Add Team
        </button>
      </form>

      {/* All Teams */}
      <div className="teams-grid">
        {teams.map((team) => (
          <div
            key={team._id}
            className="team-card"
            onClick={() => navigate(`/admin/teamDetails/${team._id}`)}
          >
            {team.team_photo && (
              <img src={`${team.team_photo}`} alt={team.team_name} className="team-img" />
            )}
            <h3 className="team-name">{team.team_name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
