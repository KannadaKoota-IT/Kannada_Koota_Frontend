import React from "react";
import "./styles/AdminDashboard.css";

export default function SidebarNav({ active, onChange }) {
  return (
    <nav className="admin-sidebar">
      <h2 className="sidebar-title">Dashboard</h2>
      <ul className="sidebar-menu">
        <li
          className={active === "announcements" ? "active" : ""}
          onClick={() => onChange("announcements")}
        >
          📢 Announcements
        </li>
        <li
          className={active === "events" ? "active" : ""}
          onClick={() => onChange("events")}
        >
          📅 Events
        </li>
        <li
          className={active === "team" ? "active" : ""}
          onClick={() => onChange("team")}
        >
          👥 Team
        </li>
        <li
          className={active === "gallery" ? "active" : ""}
          onClick={() => onChange("gallery")}
        >
          🖼️ Gallery
        </li>
      </ul>
    </nav>
  );
}
