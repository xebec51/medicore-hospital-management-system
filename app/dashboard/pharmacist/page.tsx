import { getPharmacistDashboardStats } from "@/lib/queries/pharmacy";
import { PharmacistDashboardView } from "@/components/dashboard/pharmacist-dashboard-view";

export default async function PharmacistDashboardPage() {
  const stats = await getPharmacistDashboardStats();

  return (
    <PharmacistDashboardView
      pending={stats.pending}
      prepared={stats.prepared}
      lowStock={stats.lowStock}
      expired={stats.expired}
      hasQueue={stats.pending + stats.prepared > 0}
    />
  );
}
