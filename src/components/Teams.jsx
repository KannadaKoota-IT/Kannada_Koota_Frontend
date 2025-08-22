import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TeamsPanel() {
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState("");

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
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

  return (
    <div className="p-6 mt-20 bg-gray-900 min-h-screen text-white">
      {status && <p className="mb-3 text-sm text-gray-400">{status}</p>}

      {/* All Teams */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {teams.map((team) => (
          <div
            key={team._id}
            onClick={() => navigate(`/team-details/${team._id}`)}
            className="bg-yellow-600 rounded-xl p-3 cursor-pointer transform transition-transform duration-200 hover:scale-105 w-64 mx-auto"
          >
            {team.team_photo && (
              <img
                src={team.team_photo}
                alt={team.team_name}
                className="w-full h-44 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-lg text-black font-bold italic text-center">
              {team.team_name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
