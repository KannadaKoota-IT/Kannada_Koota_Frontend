import ProtectedRoute from "../src/components/admin/ProtectedRoute";
import MainAdminDashboard from "../src/components/admin/MainAdminDashboard";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <MainAdminDashboard />
    </ProtectedRoute>
  );
}
