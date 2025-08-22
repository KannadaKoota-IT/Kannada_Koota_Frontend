import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/teams`);
      const data = await res.json();
      setTeams(data.teams || []);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Failed to load teams" });
      setTimeout(() => setStatus(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);


  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Teams Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            All Teams ({teams.length})
          </h2>

          {loading && teams.length === 0 ? (
            <div className="text-center py-16">
              <div className="animate-spin h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-300 text-lg">Loading teams...</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">👥</div>
              <h3 className="text-2xl font-semibold text-slate-300 mb-4">No teams yet</h3>
              <p className="text-slate-400 text-lg">Create your first team using the form above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {teams.map((team) => (
                <div
                  key={team._id}
                  onClick={() => navigate(`/team-details/${team._id}`)}
                  className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-white/15 hover:shadow-cyan-500/20"
                >
                  {/* Team Image */}
                  {team.team_photo && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={team.team_photo}
                        alt={team.team_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                          👁️ View Team
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Team Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                        {team.team_name}
                      </h3>
                      <div className="bg-cyan-500/20 text-cyan-300 p-2 rounded-full group-hover:bg-cyan-500/30 transition-colors duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-slate-400 text-sm flex items-center gap-2">
                        <span>👥</span>
                        Click to manage team members
                      </p>
                    </div>
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