import { CalendarClock, ClipboardList, Pill, Receipt } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";

// TODO(phase-12): connect to the patient's own appointments, records, prescriptions, and invoices.
export default function PatientDashboardPage() {
  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow="Patient" title="Your health, at a glance" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Upcoming appointments" value="1" icon={CalendarClock} tone="info" />
        <StatCard label="Medical records" value="4" icon={ClipboardList} tone="primary" />
        <StatCard label="Active prescriptions" value="2" icon={Pill} tone="clinical" />
        <StatCard label="Unpaid invoices" value="1" icon={Receipt} tone="warning" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">Upcoming appointment</h3>
        <EmptyState
          className="mt-4 py-12"
          title="No upcoming appointments"
          description="Your next scheduled visit will appear here once appointments are connected."
        />
      </div>
    </div>
  );
}
