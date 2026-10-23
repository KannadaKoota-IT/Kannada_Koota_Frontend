import ProtectedRoute from "../../src/components/admin/ProtectedRoute";
import TeamsPanel from "../../src/components/admin/TeamsPanel";
import AdminLayout from "../../src/components/admin/AdminLayout";

export default function AdminTeamsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <TeamsPanel />
      </AdminLayout>
    </ProtectedRoute>
  );
}
