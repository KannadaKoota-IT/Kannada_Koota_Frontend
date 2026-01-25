import ProtectedRoute from "../../src/components/admin/ProtectedRoute";
import AnnouncementPanel from "../../src/components/admin/AnnouncementPanel";

export default function AdminAnnouncementPage() {
  return (
    <ProtectedRoute>
      <AnnouncementPanel />
    </ProtectedRoute>
  );
}
