import ProtectedRoute from "../../src/components/admin/ProtectedRoute";
import AdminEvents from "../../src/components/admin/AdminEvents";
import AdminLayout from "../../src/components/admin/AdminLayout";

export default function AdminEventsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <AdminEvents />
      </AdminLayout>
    </ProtectedRoute>
  );
}
