import ProtectedRoute from "../../src/components/admin/ProtectedRoute";
import AdminVachana from "../../src/components/admin/AdminVachana";
import AdminLayout from "../../src/components/admin/AdminLayout";

export default function AdminVachanaPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <AdminVachana />
      </AdminLayout>
    </ProtectedRoute>
  );
}
