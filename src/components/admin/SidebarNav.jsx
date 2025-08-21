import React from "react";
import { NavLink } from "react-router-dom";
import "./styles/SidebarNav.css";

export default function SidebarNav() {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin-login"; 
    }
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin</h2>
      <nav>
        <NavLink to="/admin/announcement" className="nav-link">
          Announcements
        </NavLink>
        <NavLink to="/admin/events" className="nav-link">
          Events
        </NavLink>
        <NavLink to="/admin/teams" className="nav-link">
          Domains
        </NavLink>
        <NavLink to="/admin/gallery" className="nav-link">
          Gallery
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          🚪 Logout
        </button>
      </div>

    </div>
  );
}