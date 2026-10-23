import { useRouter } from "next/router";
import ProtectedRoute from "../../../src/components/admin/ProtectedRoute";
import TeamDetails from "../../../src/components/admin/TeamDetails";
import AdminLayout from "../../../src/components/admin/AdminLayout";

export default function AdminTeamDetailsPage() {
  const router = useRouter();
  const { teamId } = router.query;

  if (!teamId) return <div className="p-8 text-center text-sm text-[#5C403D]">Loading...</div>;

  return (
    <ProtectedRoute>
      <AdminLayout>
        <TeamDetails teamId={teamId} />
      </AdminLayout>
    </ProtectedRoute>
  );
}
