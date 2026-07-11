import { Boxes, CalendarX, Pill, TriangleAlert } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";

// TODO(phase-10): connect to prescription queue and medicine stock levels.
export default function PharmacistDashboardPage() {
  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow="Pharmacist" title="Pharmacy workspace" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending prescriptions" value="9" icon={Pill} tone="warning" />
        <StatCard label="Prepared" value="4" icon={Boxes} tone="info" />
        <StatCard label="Low stock medicines" value="5" icon={TriangleAlert} tone="warning" />
        <StatCard label="Expired medicines" value="2" icon={CalendarX} tone="destructive" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">Prescription queue</h3>
        <EmptyState
          className="mt-4 py-12"
          title="No pending prescriptions"
          description="Prescriptions submitted by doctors will appear here for preparation and dispensing."
        />
      </div>
    </div>
  );
}
