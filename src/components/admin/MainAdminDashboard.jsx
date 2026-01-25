import React, { useEffect } from "react";
import { useRouter } from "next/router";
import SidebarNav from "./SidebarNav";

export default function MainAdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin-login");
    } else {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("adminToken");
          router.push("/admin-login");
        }
      } catch (err) {
        localStorage.removeItem("adminToken");
        router.push("/admin-login");
      }
    }
  }, [router]);

  return (
    <div className="flex min-h-screen font-['Segoe_UI',sans-serif]">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-56 bg-[#2c3e50] text-white p-8 shadow-md">
        <SidebarNav />
      </div>

      {/* Main content */}
      <div className="ml-56 flex-grow p-8 bg-black min-h-screen overflow-y-auto">
        <div className="text-white">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <p>Welcome to the admin panel. Use the sidebar to navigate to different sections.</p>
        </div>
      </div>
    </div>
  );
}
