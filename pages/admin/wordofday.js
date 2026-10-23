import ProtectedRoute from "../../src/components/admin/ProtectedRoute";
import AdminWordOfDay from "../../src/components/admin/AdminWordOfDay";
import AdminLayout from "../../src/components/admin/AdminLayout";

export default function AdminWordOfDayPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <AdminWordOfDay />
      </AdminLayout>
    </ProtectedRoute>
  );
}
