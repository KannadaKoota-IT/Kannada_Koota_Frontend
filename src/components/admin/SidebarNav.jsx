import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { 
  Calendar, 
  Bell, 
  Users, 
  Camera, 
  BookOpen, 
  LayoutDashboard, 
  LogOut, 
  ExternalLink,
  Shield,
  Sparkles,
  BookMarked
} from "lucide-react";

export default function SidebarNav() {
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      router.push("/admin-login");
    }
  };

  const isActive = (path) => router.pathname === path;

  const navItems = [
    { href: "/admin", label: "Dashboard", label_k: "ಮುಖಪುಟ", icon: LayoutDashboard },
    { href: "/admin/events", label: "Events", label_k: "ಕಾರ್ಯಕ್ರಮಗಳು", icon: Calendar },
    { href: "/admin/announcement", label: "Announcements", label_k: "ಪ್ರಕಟಣೆಗಳು", icon: Bell },
    { href: "/admin/teams", label: "Domains & Leads", label_k: "ತಂಡಗಳು", icon: Users },
    { href: "/admin/gallery", label: "Gallery", label_k: "ಗ್ಯಾಲರಿ", icon: Camera },
    { href: "/admin/blogs", label: "Articles / Blogs", label_k: "ಲೇಖನಗಳು", icon: BookOpen },
    { href: "/admin/vachana", label: "Daily Vachana", label_k: "ದಿನದ ವಚನ", icon: Sparkles },
    { href: "/admin/wordofday", label: "Word of Day", label_k: "ದಿನದ ಪದ", icon: BookMarked },
  ];

  return (
    <div className="w-64 h-full bg-[#1A1818] text-[#F6F3F2] flex flex-col justify-between border-r border-[#2C2626] select-none">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-[#2C2626]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9B000E] flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5 text-[#F5B000]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-kannada leading-tight">
                ಕನ್ನಡ ಕೂಟ
              </h2>
              <p className="text-[11px] text-[#A69E9D] font-medium">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-[#9B000E] text-white shadow-md font-bold"
                    : "text-[#D0C8C6] hover:bg-[#2A2424] hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-[#F5B000]" : "text-[#A69E9D]"}`} />
                <div className="flex flex-col">
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[#2C2626] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#A69E9D] hover:text-white hover:bg-[#2A2424] transition-all"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </span>
          <span className="text-[10px] bg-[#2A2424] px-1.5 py-0.5 rounded text-[#D0C8C6]">↗</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-300 hover:text-white hover:bg-red-950/40 border border-red-900/30 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
