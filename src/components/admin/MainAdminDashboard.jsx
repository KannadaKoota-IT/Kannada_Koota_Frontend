import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "./AdminLayout";
import { 
  Calendar, 
  Bell, 
  Users, 
  Camera, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  ExternalLink 
} from "lucide-react";

export default function MainAdminDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    announcements: 0,
    teams: 0,
    gallery: 0,
    blogs: 0,
  });
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, annRes, teamsRes, galRes, blogsRes] = await Promise.allSettled([
          fetch(`${API_BASE}/api/events?admin=true`),
          fetch(`${API_BASE}/api/announcements?admin=true`),
          fetch(`${API_BASE}/api/teams`),
          fetch(`${API_BASE}/api/gallery`),
          fetch(`${API_BASE}/api/blogs`),
        ]);

        const eventsData = eventsRes.status === 'fulfilled' ? await eventsRes.value.json() : [];
        const annData = annRes.status === 'fulfilled' ? await annRes.value.json() : {};
        const teamsData = teamsRes.status === 'fulfilled' ? await teamsRes.value.json() : {};
        const galData = galRes.status === 'fulfilled' ? await galRes.value.json() : [];
        const blogsData = blogsRes.status === 'fulfilled' ? await blogsRes.value.json() : [];

        setStats({
          events: Array.isArray(eventsData) ? eventsData.length : 0,
          announcements: annData?.announcements?.length || 0,
          teams: teamsData?.teams?.length || 0,
          gallery: Array.isArray(galData) ? galData.length : 0,
          blogs: Array.isArray(blogsData) ? blogsData.length : (blogsData?.blogs?.length || 0),
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [API_BASE]);

  const cards = [
    {
      title: "Events Management",
      title_k: "ಕಾರ್ಯಕ್ರಮ ನಿರ್ವಹಣೆ",
      description: "Create, schedule, update dates, venue, and registration links for campus events.",
      href: "/admin/events",
      count: stats.events,
      icon: Calendar,
      accent: "border-l-4 border-l-[#9B000E]",
    },
    {
      title: "Announcements Hub",
      title_k: "ಪ್ರಕಟಣೆಗಳ ನಿರ್ವಹಣೆ",
      description: "Post circulars, auditions, and general notifications with image or video attachments.",
      href: "/admin/announcement",
      count: stats.announcements,
      icon: Bell,
      accent: "border-l-4 border-l-[#F5B000]",
    },
    {
      title: "Domains & Leads",
      title_k: "ತಂಡಗಳು ಮತ್ತು ಸಂಯೋಜಕರು",
      description: "Manage student coordinators, teams, domain details, and lead photos.",
      href: "/admin/teams",
      count: stats.teams,
      icon: Users,
      accent: "border-l-4 border-l-[#9B000E]",
    },
    {
      title: "Media Gallery",
      title_k: "ಗ್ಯಾಲರಿ ಸಂಗ್ರಹ",
      description: "Upload and organize photos, videos, and event highlights into the archives.",
      href: "/admin/gallery",
      count: stats.gallery,
      icon: Camera,
      accent: "border-l-4 border-l-[#F5B000]",
    },
    {
      title: "Articles & Blogs",
      title_k: "ಲೇಖನಗಳು ಮತ್ತು ಬ್ಲಾಗ್",
      description: "Review, edit, and publish cultural and technical articles by club members.",
      href: "/admin/blogs",
      count: stats.blogs,
      icon: BookOpen,
      accent: "border-l-4 border-l-[#9B000E]",
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFEBE4] elevation-1 relative overflow-hidden">
          <div className="h-1.5 w-full gold-crimson-bar absolute top-0 left-0" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E1] border border-[#F5B000]/30 text-[#7C5800] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#9B000E]" />
                <span>Admin Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1B1B] font-kannada">
                ಸ್ವಾಗತ (Welcome to Admin Dashboard)
              </h1>
              <p className="text-xs sm:text-sm text-[#5C403D] mt-1">
                Manage all Kannada Koota public content, events, announcements, and media archives.
              </p>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] text-xs font-semibold text-[#1C1B1B] hover:bg-[#F6F3F2] transition-colors self-start md:self-auto"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#9B000E]" />
            </Link>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className={`group bg-white rounded-2xl p-6 border border-[#EFEBE4] elevation-1 hover:elevation-2 hover:-translate-y-1 transition-all flex flex-col justify-between ${card.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FCF9F8] border border-[#EFEBE4] flex items-center justify-center text-[#9B000E] group-hover:bg-[#9B000E] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FCF9F8] text-[#5C403D] border border-[#EFEBE4]">
                      {loading ? '...' : `${card.count} Items`}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1C1B1B] group-hover:text-[#9B000E] transition-colors font-kannada mb-1">
                    {card.title_k}
                  </h3>
                  <h4 className="text-sm font-semibold text-[#5C403D] mb-2">
                    {card.title}
                  </h4>
                  <p className="text-xs text-[#5C403D] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EFEBE4] flex items-center justify-between text-xs font-semibold text-[#9B000E]">
                  <span>Manage</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
