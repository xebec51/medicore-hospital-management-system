import { CalendarClock, ListOrdered, Stethoscope, UserRound } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";

// TODO(phase-8): connect to live queue and appointment data.
export default function ReceptionistDashboardPage() {
  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow="Receptionist" title="Front desk operations" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Checked-in patients" value="19" icon={UserRound} tone="info" />
        <StatCard label="Scheduled today" value="42" icon={CalendarClock} tone="primary" />
        <StatCard label="In queue" value="11" icon={ListOrdered} tone="warning" />
        <StatCard label="Doctors available" value="14 / 18" icon={Stethoscope} tone="clinical" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">Today&apos;s appointment timeline</h3>
        <EmptyState
          className="mt-4 py-12"
          title="No appointments yet"
          description="The intake timeline will populate once patient registration and scheduling go live."
        />
      </div>
    </div>
  );
}
