import React from "react";
import { NavLink } from "react-router-dom";

export default function SidebarNav() {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin-login";
    }
  };

  return (
    <div className="fixed top-0 left-0 w-56 h-full bg-gray-900 text-white flex flex-col p-5">
      <h2 className="text-2xl font-semibold mb-6">Admin</h2>

      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin/announcement"
          className={({ isActive }) =>
            `block px-3 py-2 rounded-md transition ${
              isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Announcements
        </NavLink>
        <NavLink
          to="/admin/events"
          className={({ isActive }) =>
            `block px-3 py-2 rounded-md transition ${
              isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Events
        </NavLink>
        <NavLink
          to="/admin/teams"
          className={({ isActive }) =>
            `block px-3 py-2 rounded-md transition ${
              isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Domains
        </NavLink>
        <NavLink
          to="/admin/gallery"
          className={({ isActive }) =>
            `block px-3 py-2 rounded-md transition ${
              isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Gallery
        </NavLink>
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
