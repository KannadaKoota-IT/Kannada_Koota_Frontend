import ProtectedRoute from "../../src/components/admin/ProtectedRoute";
import AdminGallery from "../../src/components/admin/AdminGallery";

export default function AdminGalleryPage() {
  return (
    <ProtectedRoute>
      <AdminGallery />
    </ProtectedRoute>
  );
}
