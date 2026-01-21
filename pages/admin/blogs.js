import React from "react";
import ProtectedRoute from "../../src/components/admin/ProtectedRoute";
import AdminBlogs from "../../src/components/admin/AdminBlogs";
import SidebarNav from "../../src/components/admin/SidebarNav";

export default function AdminBlogsPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen font-['Segoe_UI',sans-serif]">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-screen w-56 bg-[#2c3e50] text-white p-8 shadow-md">
          <SidebarNav />
        </div>

        {/* Main content */}
        <div className="ml-56 flex-grow p-8 bg-black min-h-screen overflow-y-auto">
          <AdminBlogs />
        </div>
      </div>
    </ProtectedRoute>
  );
}
