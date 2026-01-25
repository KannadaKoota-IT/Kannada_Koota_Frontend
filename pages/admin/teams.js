import ProtectedRoute from "../../src/components/admin/ProtectedRoute";
import TeamsPanel from "../../src/components/admin/TeamsPanel";

export default function AdminTeamsPage() {
  return (
    <ProtectedRoute>
      <TeamsPanel />
    </ProtectedRoute>
  );
}
