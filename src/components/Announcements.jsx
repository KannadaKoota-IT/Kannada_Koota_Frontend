import React, { useEffect, useState } from "react";

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [form, setForm] = useState({ title: "", message: "", link: "", date: "" });
    const [media, setMedia] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState(null);

    // Toggle expand/collapse
    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const API_BASE = import.meta.env.VITE_BACKEND_URL;

    // Fetch announcements
    const fetchAnnouncements = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/announcements`);
            const data = await res.json();
            if (data.success) {
                setAnnouncements(data.announcements);
            }
        } catch (err) {
            console.error("Failed to fetch announcements:", err);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);


    return (
        <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="fixed top-25 left-3 text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                        <span className="text-2xl">📢</span>
                    </div>
                    <h1 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Announcements
                    </h1>
                </div>

                {/* Announcements List */}
                <div className="space-y-4">
                    {announcements.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold text-slate-300 mb-2">No announcements yet</h3>
                        </div>
                    ) : (
                        announcements.map((a) => {
                            const isExpanded = expandedId === a._id;
                            return (
                                <div
                                    key={a._id}
                                    onClick={() => toggleExpand(a._id)}
                                    className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/15 ${isExpanded ? "ring-2 ring-purple-400 shadow-2xl" : "shadow-xl"
                                        }`}
                                >
                                    {/* Compact view */}
                                    {!isExpanded && (
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-xl font-bold text-lime-400 mr-4 flex-1">
                                                    {a.title}
                                                </h3>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {a.date && (
                                                        <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-medium">
                                                            {new Date(a.date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    <div className="text-slate-400 text-sm">
                                                        {isExpanded ? "▲" : "▼"}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-slate-300 mb-3 line-clamp-2">{a.message}</p>
                                            {a.link && (
                                                <a
                                                    href={a.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    🔗 View Link
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Expanded view */}
                                    {isExpanded && (
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-2xl font-bold text-lime-400 mr-4 flex-1">
                                                    {a.title}
                                                </h3>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {a.date && (
                                                        <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-medium">
                                                            {new Date(a.date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    <div className="text-slate-400 text-sm">▲</div>
                                                </div>
                                            </div>

                                            <p className="text-slate-300 mb-4 leading-relaxed">{a.message}</p>

                                            {a.link && (
                                                <div className="mb-4">
                                                    <a
                                                        href={a.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        🔗 Open Link
                                                    </a>
                                                </div>
                                            )}

                                            {/* Media Display */}
                                            {a.mediaUrl && (
                                                <div className="mb-6">
                                                    {a.mediaType === "image" ? (
                                                        <img
                                                            src={a.mediaUrl}
                                                            alt="announcement"
                                                            className="rounded-xl max-h-64 w-full object-cover border border-white/20 shadow-lg"
                                                        />
                                                    ) : (
                                                        <video
                                                            src={a.mediaUrl}
                                                            controls
                                                            className="rounded-xl max-h-64 w-full object-cover border border-white/20 shadow-lg"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}