import ProtectedRoute from "../../src/components/admin/ProtectedRoute";
import AdminGallery from "../../src/components/admin/AdminGallery";
import AdminLayout from "../../src/components/admin/AdminLayout";

export default function AdminGalleryPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <AdminGallery />
      </AdminLayout>
    </ProtectedRoute>
  );
}
