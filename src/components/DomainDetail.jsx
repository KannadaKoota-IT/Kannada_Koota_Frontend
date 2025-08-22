import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DomainDetails() {
  const { teamId } = useParams();

  const [heads, setHeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamPhoto, setTeamPhoto] = useState("");
  const [modalImg, setModalImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamId}/members`);
      const data = await res.json();
      setMembers(data.members || []);
      setHeads(data.heads || []);
      setTeamName(data.team_name);
      setTeamPhoto(data.team_photo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Team Header */}
        <div className="fixed top-20 right-6 flex flex-col items-center z-50">
          {teamPhoto && (
            <div className="relative mb-3">
              <img
                src={teamPhoto}
                alt="Team"
                className="w-30 h-30 object-cover rounded-full border-4 border-emerald-400 shadow-2xl"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}
          <h1 className="text-xl font-bold text-lime-400 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent text-center">
            {teamName}
          </h1>
        </div>

        {/* Heads Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3">
              <span className="text-2xl">👑</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Team Heads</h2>
            <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
              {heads.length} {heads.length === 1 ? 'Head' : 'Heads'}
            </span>
          </div>

          {heads.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-6xl mb-4">👑</div>
              <p className="text-slate-300 text-lg">No team heads yet</p>
              <p className="text-slate-400">Add a member with 'Head' role below</p>
            </div>
          ) : (
            <div className="flex items-center justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {heads.map((member) => (
                <div
                  key={member._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/15"
                >
                  {/* Member Image */}
                  {member.image_url && (
                    <div className="relative h-25 overflow-hidden">
                      <img
                        src={member.image_url}
                        alt={member.name}
                        onClick={() => setModalImg(member.image_url)}
                        className="w-20 h-20 ml-5 mt-2 object-cover cursor-pointer rounded-full border-2 border-white/20 transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-yellow-500/20 backdrop-blur-sm text-yellow-300 px-3 py-1 rounded-full text-xs font-medium border border-yellow-400/30">
                        👑 HEAD
                      </div>
                    </div>
                  )}

                  {/* Member Info */}
                  <div className="p-3">
                    <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-slate-300 text-sm flex items-center gap-2">
                        <span>📧</span> {member.email}
                      </p>
                      <p className="text-slate-300 text-sm flex items-center gap-2">
                        <span>📱</span> {member.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Members Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full p-3">
              <span className="text-2xl">👥</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Team Members</h2>
            <span className="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-sm font-medium">
              {members.length} {members.length === 1 ? 'Member' : 'Members'}
            </span>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-slate-300 text-lg">No team members yet</p>
              <p className="text-slate-400">Add members using the form below</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10 border-b border-white/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Photo</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {members.map((member) => (
                      <tr key={member._id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <img
                            src={member.image_url || "/default_img.jpg"}
                            alt={member.name}
                            onClick={() => setModalImg(member.image_url || "/default_img.jpg")}
                            className="w-12 h-12 rounded-full object-cover cursor-pointer border-2 border-white/20 hover:border-teal-400 transition-colors duration-200"
                          />
                        </td>
                        <td className="px-6 py-4 text-white font-medium">{member.name}</td>
                        <td className="px-6 py-4 text-slate-300">{member.email}</td>
                        <td className="px-6 py-4 text-slate-300">{member.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {modalImg && (
          <div className="fixed mt-20 inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative">
              <img
                src={modalImg}
                alt="Enlarged"
                className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl border-4 border-white/20 object-contain"
              />
              <button
                onClick={() => setModalImg(null)}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                ✕ Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}