import React from "react";
import ProtectedRoute from "../../src/components/admin/ProtectedRoute";
import AdminBlogs from "../../src/components/admin/AdminBlogs";
import AdminLayout from "../../src/components/admin/AdminLayout";

export default function AdminBlogsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <AdminBlogs />
      </AdminLayout>
    </ProtectedRoute>
  );
}
