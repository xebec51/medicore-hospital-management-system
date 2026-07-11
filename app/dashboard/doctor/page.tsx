import { CalendarClock, CheckCircle2, Clock, UserRound } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";

// TODO(phase-9): replace mock stats with the doctor's real consultation queue.
export default function DoctorDashboardPage() {
  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow="Doctor" title="Today's consultations" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's appointments" value="12" icon={CalendarClock} tone="info" />
        <StatCard label="Completed" value="7" icon={CheckCircle2} tone="success" />
        <StatCard label="Pending" value="5" icon={Clock} tone="warning" />
        <StatCard label="Recent patients" value="34" icon={UserRound} tone="primary" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">Consultation queue</h3>
        <EmptyState
          className="mt-4 py-12"
          title="No patients checked in yet"
          description="Patients ready for consultation will appear here once the appointment workflow is connected."
        />
      </div>
    </div>
  );
}
