import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import "./styles/AdminDashboard.css";

export default function MainAdminDashboard() {
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

  return (
    <div className="admin-layout">
      <SidebarNav />
      <div className="admin-main-content">
        <Outlet />
      </div>
    </div>
  );
}
