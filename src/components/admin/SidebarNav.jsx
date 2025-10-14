import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SidebarNav() {
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      router.push("/admin-login");
    }
  };

  const isActive = (path) => router.pathname === path;

  return (
    <div className="fixed top-0 left-0 w-56 h-full bg-gray-900 text-white flex flex-col p-5">
      <h2 className="text-2xl font-semibold mb-6">Admin</h2>

      <nav className="flex flex-col space-y-2">
        <Link
          href="/admin/announcement"
          className={`block px-3 py-2 rounded-md transition ${
            isActive("/admin/announcement") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          Announcements
        </Link>
        <Link
          href="/admin/events"
          className={`block px-3 py-2 rounded-md transition ${
            isActive("/admin/events") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          Events
        </Link>
        <Link
          href="/admin/teams"
          className={`block px-3 py-2 rounded-md transition ${
            isActive("/admin/teams") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          Domains
        </Link>
        <Link
          href="/admin/gallery"
          className={`block px-3 py-2 rounded-md transition ${
            isActive("/admin/gallery") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          Gallery
        </Link>
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 mt-4 rounded-md bg-red-600 hover:bg-red-700 transition flex items-center justify-center"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
