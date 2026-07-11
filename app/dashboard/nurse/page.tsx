import { getNurseDashboardStats } from "@/lib/queries/nurse";
import { NurseDashboardView } from "@/components/dashboard/nurse-dashboard-view";

export default async function NurseDashboardPage() {
  const stats = await getNurseDashboardStats();

  return (
    <NurseDashboardView
      checkedInCount={stats.checkedInCount}
      vitalsToday={stats.vitalsToday}
      notesToday={stats.notesToday}
    />
  );
}
