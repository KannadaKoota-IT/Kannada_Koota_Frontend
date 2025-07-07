import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import AnnouncementPanel from "./AnnouncementPanel";
import AdminEvents from "./AdminEvents";
import TeamsPanel from "./TeamsPanel";
import AdminGallery from "./AdminGallery";
import "./styles/AdminDashboard.css";

export default function MainAdminDashboard() {
  const [activePanel, setActivePanel] = useState("announcements");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
    } else {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }
      } catch (err) {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
      }
    }
  }, [navigate]);

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
      <div className="admin-main-content">{renderPanel()}</div>
    </div>
  );
}
