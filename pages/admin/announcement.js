import ProtectedRoute from "../../src/components/admin/ProtectedRoute";
import AnnouncementPanel from "../../src/components/admin/AnnouncementPanel";
import AdminLayout from "../../src/components/admin/AdminLayout";

export default function AdminAnnouncementPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <AnnouncementPanel />
      </AdminLayout>
    </ProtectedRoute>
  );
}
