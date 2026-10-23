import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Users, ChevronDown, ChevronUp, UserCheck, Shield } from "lucide-react";
import {
  getMediaUrl,
  handleImageError,
  DEFAULT_PERSON_IMAGE,
} from "../utils/mediaUtils";

export default function Teams() {
  const { isKannada } = useLanguage();
  const [teams, setTeams] = useState([]);
  const [teamHeads, setTeamHeads] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState(new Set());

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  const toggleTeamExpansion = (teamId) => {
    setExpandedTeams((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  };

  const expandAllTeams = () => {
    setExpandedTeams(new Set(teams.slice(6).map((team) => team._id)));
  };

  const collapseAllTeams = () => {
    setExpandedTeams(new Set());
  };

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
        console.error("fetchTeams error:", err);
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
          // Only include members whose role is Head (exclude general members)
          const headsOnly = (json.heads || []).filter(
            (m) => (m.role || "").toLowerCase() === "head",
          );
          return { teamId: team._id, heads: headsOnly };
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

  const renderHeadCard = (head) => {
    const roleLabel =
      head.role?.toUpperCase() === "HEAD"
        ? "HEAD"
        : head.role?.toUpperCase() || "HEAD";

    return (
      <div
        key={head._id}
        className="group bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden elevation-1 hover:elevation-2 hover:-translate-y-1 transition-all duration-300 w-64 flex-shrink-0 flex flex-col justify-between"
      >
        <div className="h-0.5 w-full bg-transparent group-hover:gold-crimson-bar transition-all duration-300" />
        <div>
          <div className="relative aspect-[4/5] overflow-hidden bg-[#F6F3F2]">
            <img
              src={getMediaUrl(
                head.image_url || head.photoUrl,
                DEFAULT_PERSON_IMAGE,
              )}
              alt={head.name}
              onError={(e) => handleImageError(e, DEFAULT_PERSON_IMAGE)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute bottom-2.5 right-2.5 bg-white/95 text-[#9B000E] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-[#EFEBE4] flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#9B000E]" />
              <span>{roleLabel}</span>
            </div>
          </div>
          <div className="p-4 space-y-1">
            <h3 className="text-base font-bold text-[#1C1B1B] font-kannada line-clamp-1 group-hover:text-[#9B000E] transition-colors">
              {head.name_k || head.name}
            </h3>
            {head.name_k && head.name && (
              <p className="text-xs text-[#5C403D] font-medium tracking-wide truncate">
                {head.name}
              </p>
            )}
            {head.email && head.email !== "NA@na.com" && (
              <p className="text-[11px] text-[#916F6B] truncate">
                {head.email}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FCF9F8] text-[#1C1B1B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EFEBE4] mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E1] border border-[#F5B000]/30 text-[#7C5800] text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5 text-[#9B000E]" />
              <span>{isKannada ? "ನಾಯಕತ್ವ ಮಂಡಳಿ" : "Leadership Council"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1B1B] font-kannada">
              {isKannada ? "ತಂಡಗಳು ಮತ್ತು ನಾಯಕರು" : "Domains & Domain Leads"}
            </h1>
            <p className="text-xs sm:text-sm text-[#5C403D] mt-1">
              Meet the coordinators and leads shaping cultural excellence,
              logistics, music, theatre, and arts.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && teams.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-12 h-12 mx-auto border-4 border-[#EFEBE4] border-t-[#9B000E] rounded-full animate-spin mb-4" />
            <p className="text-[#5C403D] font-kannada">
              {isKannada ? "ತಂಡಗಳ ವಿವರ ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Loading teams..."}
            </p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EFEBE4] p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F6F3F2] flex items-center justify-center mx-auto text-[#5C403D]">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1C1B1B] font-kannada">
              {isKannada ? "ಇನ್ನೂ ಯಾವುದೇ ತಂಡಗಳಿಲ್ಲ" : "No teams listed yet"}
            </h4>
            <p className="text-xs text-[#5C403D]">
              Teams and their coordinators will appear here once registered.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* First batch of teams */}
            {teams.slice(0, 7).map((team) => {
              const heads = teamHeads[team._id] || [];
              return (
                <section key={team._id} className="space-y-6">
                  {/* Domain Title Bar */}
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#9B000E] rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1C1B1B] font-kannada">
                      {team.team_name_k || team.team_name}
                      {team.team_name_k && team.team_name && (
                        <span className="text-base sm:text-lg font-normal text-[#5C403D] ml-2">
                          ({team.team_name})
                        </span>
                      )}
                    </h2>
                  </div>

                  {/* Heads Row/Grid */}
                  {heads.length > 0 ? (
                    <div className="flex flex-wrap gap-6">
                      {heads.map(renderHeadCard)}
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-white border border-[#EFEBE4] text-xs text-[#5C403D]">
                      Domain coordinators will be updated soon.
                    </div>
                  )}
                </section>
              );
            })}

            {/* Remaining Teams in Accordion */}
            {teams.length > 7 && (
              <div className="pt-8 border-t border-[#EFEBE4] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-[#1C1B1B] font-kannada">
                    {isKannada ? "ಇನ್ನಷ್ಟು ತಂಡಗಳು" : "Other Domain Teams"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={expandAllTeams}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg border border-[#EFEBE4] bg-white text-[#1C1B1B] hover:bg-[#F6F3F2] transition-colors"
                    >
                      Expand All
                    </button>
                    <button
                      onClick={collapseAllTeams}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg border border-[#EFEBE4] bg-white text-[#5C403D] hover:bg-[#F6F3F2] transition-colors"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {teams.slice(6).map((team) => {
                    const isExpanded = expandedTeams.has(team._id);
                    const heads = teamHeads[team._id] || [];

                    return (
                      <div
                        key={team._id}
                        className="bg-white rounded-2xl border border-[#EFEBE4] overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleTeamExpansion(team._id)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#FCF9F8] transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#9B000E]" />
                            <span className="text-base sm:text-lg font-bold text-[#1C1B1B] font-kannada">
                              {team.team_name_k || team.team_name}
                              {team.team_name_k && team.team_name && (
                                <span className="text-sm font-normal text-[#5C403D] ml-2">
                                  ({team.team_name})
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-[#916F6B] ml-2">
                              • {heads.length}{" "}
                              {heads.length === 1 ? "Lead" : "Leads"}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-[#5C403D]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#5C403D]" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-6 pb-6 pt-2 border-t border-[#EFEBE4] bg-[#FCF9F8]">
                            {heads.length > 0 ? (
                              <div className="flex flex-wrap gap-6 pt-4">
                                {heads.map(renderHeadCard)}
                              </div>
                            ) : (
                              <p className="text-xs text-[#5C403D] py-4">
                                Coordinators list for this team will be
                                announced soon.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
