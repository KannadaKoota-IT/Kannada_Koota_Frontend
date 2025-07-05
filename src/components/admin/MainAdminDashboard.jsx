import React, { useState } from "react";
import SidebarNav from "./SidebarNav";
import AnnouncementPanel from "./AnnouncementPanel";
import AdminEvents from "./AdminEvents";
import TeamsPanel from "./TeamsPanel";
import AdminGallery from "./AdminGallery"; // ✅ new import
import "./styles/AdminDashboard.css";

export default function MainAdminDashboard() {
  const [activePanel, setActivePanel] = useState("announcements");

  const renderPanel = () => {
    switch (activePanel) {
      case "announcements":
        return <AnnouncementPanel />;
      case "events":
        return <AdminEvents />;
      case "team":
        return <TeamsPanel />;
      case "gallery":
        return <AdminGallery />;
      default:
        return <AnnouncementPanel />;
    }
  };

  return (
    <div className="admin-layout">
      <SidebarNav active={activePanel} onChange={setActivePanel} />
      <div className="admin-main-content">
        {renderPanel()}
      </div>
    </div>
  );
}
