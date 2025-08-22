import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DomainDetail() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [heads, setHeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamPhoto, setTeamPhoto] = useState("");
  const [status, setStatus] = useState("");
  const [modalImg, setModalImg] = useState(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamId}/members`);
      const data = await res.json();
      setMembers(data.members || []);
      setHeads(data.heads || []);
      setTeamName(data.team_name);
      setTeamPhoto(data.team_photo);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to load members");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  return (
    <div className="p-6 mt-20 bg-gray-900 text-white min-h-screen font-sans">
      {/* Team Header */}
      <div className="flex flex-col items-center justify-center mb-8">
        {teamPhoto && (
          <img
            src={teamPhoto}
            alt="Team"
            className="w-32 h-32 object-cover rounded-xl border-2 border-lime-400 mb-3"
          />
        )}
        <h2 className="text-3xl font-bold text-lime-400">{teamName}</h2>
      </div>

      {status && <p className="mb-4 text-sm text-gray-400">{status}</p>}

      {/* Heads Section */}
      <div className="mb-10 flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-4">Heads</h3>
        <div className="flex flex-wrap gap-5">
          {heads.map((member) => (
            <div
              key={member._id}
              className="bg-gray-700 rounded-xl p-5 text-center shadow-md w-64"
            >
              {member.image_url && (
                <img
                  src={member.image_url}
                  alt={member.name}
                  onClick={() => setModalImg(member.image_url)}
                  className="w-full h-44 object-cover rounded-lg mb-3"
                />
              )}
              <h4 className="text-lg font-semibold">{member.name}</h4>
              <p className="text-sm text-gray-300">{member.email}</p>
              <p className="text-sm text-gray-400">{member.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <h3 className="text-xl font-semibold mb-4">Members</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className="border-b border-gray-700">
                <td className="px-4 py-3">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      onClick={() => setModalImg(member.image_url)}
                      className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />
                  ) : (
                    <img
                      src={"/default_img.jpg"}
                      alt={member.name}
                      onClick={() => setModalImg("/default_img.jpg")}
                      className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />
                  )
                }
                </td>
                <td className="px-4 py-3">{member.name}</td>
                <td className="px-4 py-3">{member.email}</td>
                <td className="px-4 py-3">{member.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Enlarged Image */}
      {modalImg && (
        <div className="fixed mt-20 inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50">
          <img
            src={modalImg}
            alt="Enlarged"
            className="max-w-[80%] max-h-[80%] rounded-xl border-4 border-white"
          />
          <button
            onClick={() => setModalImg(null)}
            className="absolute top-8 right-10 px-5 py-2 text-lg bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
