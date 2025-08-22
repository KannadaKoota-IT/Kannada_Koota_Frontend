import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="p-6 bg-black min-h-screen text-white">
      {status && (
        <p className="mb-4 text-center text-sm font-semibold text-green-500">
          {status}
        </p>
      )}

      {/* Add Team Form */}
      <form
        className="bg-gray-100 p-6 rounded-xl shadow-md flex flex-col gap-4 mb-8"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <input
          type="text"
          placeholder="Team Name"
          className="p-3 border border-gray-300 rounded-lg text-black"
          value={formData.team_name}
          onChange={(e) =>
            setFormData({ ...formData, team_name: e.target.value })
          }
          required
        />
        <input
          type="file"
          accept="image/*"
          className="text-gray-500"
          onChange={(e) => setTeamPhoto(e.target.files[0])}
          required
        />
        <button
          type="submit"
          className="bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
        >
          Add Team
        </button>
      </form>

      {/* All Teams */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
        {teams.map((team) => (
          <div
            key={team._id}
            className="bg-yellow-600 rounded-xl p-4 cursor-pointer transform transition hover:scale-105 w-[250px]"
            onClick={() => navigate(`/admin/teamDetails/${team._id}`)}
          >
            {team.team_photo && (
              <img
                src={team.team_photo}
                alt={team.team_name}
                className="w-full h-44 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-lg font-bold italic text-center text-black">
              {team.team_name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
