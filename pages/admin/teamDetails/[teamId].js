import { useRouter } from "next/router";
import ProtectedRoute from "../../../src/components/admin/ProtectedRoute";
import TeamDetails from "../../../src/components/admin/TeamDetails";

export default function AdminTeamDetailsPage() {
  const router = useRouter();
  const { teamId } = router.query;

  if (!teamId) return <div>Loading...</div>;

  return (
    <ProtectedRoute>
      <TeamDetails teamId={teamId} />
    </ProtectedRoute>
  );
}
