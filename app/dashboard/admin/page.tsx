import { listActivityLogs } from "@/lib/queries/activity-logs";
import { AdminDashboardView } from "@/components/dashboard/admin-dashboard-view";

export default async function AdminDashboardPage() {
  const recentActivity = await listActivityLogs(8);

  return <AdminDashboardView recentActivity={recentActivity} />;
}
