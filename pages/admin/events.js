import ProtectedRoute from "../../src/components/admin/ProtectedRoute";
import AdminEvents from "../../src/components/admin/AdminEvents";

export default function AdminEventsPage() {
  return (
    <ProtectedRoute>
      <AdminEvents />
    </ProtectedRoute>
  );
}
