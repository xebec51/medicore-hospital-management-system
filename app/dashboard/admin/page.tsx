import { Activity, CalendarClock, Pill, Stethoscope, TriangleAlert, Users2, Wallet } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";

// TODO(phase-7/13): replace mock stats with real Prisma-backed analytics.
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow="Admin" title="Hospital command center" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total patients" value="1,284" icon={Users2} tone="primary" />
        <StatCard label="Today's appointments" value="42" icon={CalendarClock} tone="info" />
        <StatCard label="Active doctors" value="18" icon={Stethoscope} tone="clinical" />
        <StatCard label="Revenue this month" value="Rp 412M" icon={Wallet} tone="success" />
        <StatCard label="Pending prescriptions" value="9" icon={Pill} tone="warning" />
        <StatCard label="Low stock medicines" value="5" icon={Activity} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="font-semibold">Recent activity</h3>
          <EmptyState
            className="mt-4 py-10"
            title="Activity feed coming online"
            description="Once operational data is connected, recent hospital-wide activity will appear here."
          />
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TriangleAlert className="size-4 text-warning" />
            <h3 className="font-semibold">Operational alerts</h3>
          </div>
          <EmptyState className="mt-4 py-10" title="No alerts yet" description="Alerts will surface here once modules go live." />
        </div>
      </div>
    </div>
  );
}
