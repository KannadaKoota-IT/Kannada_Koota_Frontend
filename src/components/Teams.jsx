import React, { useEffect, useState, useCallback } from "react";


export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [teamHeads, setTeamHeads] = useState({});
  const [loading, setLoading] = useState(false);
  const [hoveredTeam, setHoveredTeam] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

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

  return (
    <div className="min-h-screen mt-20 relative overflow-hidden bg-black">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] -top-48 -right-48 rounded-full border-2 border-yellow-500/10 animate-spin-slow"
          style={{ animationDuration: "60s" }}
        ></div>
        <div
          className="absolute w-[500px] h-[500px] -bottom-32 -left-32 rounded-full border-2 border-yellow-500/10 animate-spin-slow"
          style={{ animationDuration: "80s", animationDirection: "reverse" }}
        ></div>
        <div
          className="absolute w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-500/5 animate-spin-slow opacity-50"
          style={{ animationDuration: "100s" }}
        ></div>

        {/* Glowing Orbs */}
        <div className="absolute w-[300px] h-[300px] top-[10%] right-[10%] rounded-full bg-yellow-500/15 blur-[80px] animate-float"></div>
        <div className="absolute w-[400px] h-[400px] bottom-[20%] left-[5%] rounded-full bg-amber-500/12 blur-[80px] animate-float-delayed"></div>
        <div className="absolute w-[350px] h-[350px] top-[60%] right-[20%] rounded-full bg-yellow-600/10 blur-[80px] animate-float-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header Section */}
        <div className="mb-10 text-center">
          {/* <p className="text-lg text-amber-200/80 max-w-5xl mx-auto leading-relaxed">
            Meet the visionary leaders of Kannada Koota, guiding our community
            with passion and dedication. These brilliant minds drive culture,
            collaboration, and creativity forward, shaping the spirit of our
            club.
          </p> */}
        </div>

        {/* Teams Grid */}
        {loading && teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-semibold text-yellow-400">
              Loading Teams...
            </h2>
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-32 h-32 mb-8 rounded-full bg-yellow-500/10 flex items-center justify-center border-2 border-yellow-500/30">
              <svg
                className="w-16 h-16 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-3">
              No Teams Yet
            </h2>
            <p className="text-amber-200/60 text-lg">
              Teams will appear here once they're created.
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {teams.map((team, teamIndex) => (
              <div
                key={team._id}
                className="relative group"
                onMouseEnter={() => setHoveredTeam(team._id)}
                onMouseLeave={() => setHoveredTeam(null)}
              >
                {/* Team Header */}
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/50 to-transparent"></div>
                    <div className="relative">
                      <span className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 relative group/link">
                        {team.team_name_k} 
                      </span>
                      <span className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-500 hover:from-red-300 hover:to-amber-400 transition-all duration-300 relative group/link ml-2">
                        ({team.team_name}) 
                      </span>

                      {/* Decorative corner elements */}
                      <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-yellow-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-yellow-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-l from-yellow-500/50 to-transparent"></div>
                  </div>
                </div>

                {/* Team Heads Grid */}
                {Array.isArray(teamHeads[team._id]) &&
                teamHeads[team._id].length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {teamHeads[team._id].map((head, headIndex) => (
                      <div
                        key={head._id}
                        className="group/card relative"
                        style={{
                          animation: `fadeInUp 0.6s ease-out ${
                            headIndex * 0.1
                          }s both`,
                        }}
                      >
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black/80 to-yellow-900/20 border-2 border-yellow-500/30 transition-all duration-500 hover:border-yellow-400/60 hover:shadow-2xl hover:shadow-yellow-500/20 hover:-translate-y-2 h-full flex flex-col">
                          {/* Image Container */}
                          <div className="relative aspect-[5/6] overflow-hidden">
                            <img
                              src={head.image_url || "/default_img.jpg"}
                              alt={head.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity duration-300"></div>

                            {/* Animated Border Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-shimmer"></div>
                              <div
                                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-shimmer"
                                style={{ animationDelay: "0.5s" }}
                              ></div>
                            </div>

                            {/* Corner Decorations */}
                            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-yellow-400/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-yellow-400/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-yellow-400/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-yellow-400/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>

                            {/* Role Badge */}
                            <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-xs font-bold rounded-full shadow-lg transform group-hover/card:scale-110 transition-transform duration-300">
                              HEAD
                            </div>
                          </div>

                          {/* Info Section */}
                          <div className="relative py-3 px-5 bg-black/90 flex-1 flex flex-col justify-end">
                          <h3 className="text-xl font-bold text-yellow-400 mb-1 group-hover/card:text-yellow-300 transition-colors duration-300 min-h-[4rem] leading-relaxed line-clamp-3">
                              {head.name_k}
                            </h3>
                            <h5 className="text-xl font-bold !text-blue-400 mb-1 group-hover/card:text-blue-300 transition-colors duration-300">
                              {head.name}
                            </h5>

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-radial from-yellow-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          </div>

                          {/* Shine Effect */}
                          <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent transform -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-16 px-6 rounded-2xl bg-gradient-to-br from-yellow-900/10 to-amber-900/10 border-2 border-dashed border-yellow-500/30">
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-yellow-500/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="text-lg text-yellow-500/60 font-medium">
                        No team heads assigned yet
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(30px, -30px);
          }
          50% {
            transform: translate(-20px, 20px);
          }
          75% {
            transform: translate(20px, 30px);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-spin-slow {
          animation: spin 60s linear infinite;
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 25s ease-in-out infinite;
          animation-delay: 7s;
        }

        .animate-float-slow {
          animation: float 30s ease-in-out infinite;
          animation-delay: 14s;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
