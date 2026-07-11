import { listActivityLogs } from "@/lib/queries/activity-logs";
import { getAdminOverviewStats } from "@/lib/queries/admin-analytics";
import { AdminDashboardView } from "@/components/dashboard/admin-dashboard-view";

export default async function AdminDashboardPage() {
  const [recentActivity, overview] = await Promise.all([listActivityLogs(8), getAdminOverviewStats()]);

  return (
    <AdminDashboardView
      recentActivity={recentActivity}
      totalPatients={overview.totalPatients}
      appointmentsToday={overview.appointmentsToday}
      activeDoctors={overview.activeDoctors}
      revenueThisMonth={overview.revenueThisMonth}
      pendingPrescriptions={overview.pendingPrescriptions}
      lowStockMedicines={overview.lowStockMedicines}
    />
  );
}
