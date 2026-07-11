import { HeartPulse, ListOrdered, NotebookPen, TriangleAlert } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";

// TODO(phase-9): connect to checked-in queue and vital sign records.
export default function NurseDashboardPage() {
  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow="Nurse" title="Care coordination workspace" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Checked-in patients" value="8" icon={ListOrdered} tone="info" />
        <StatCard label="Vitals recorded today" value="15" icon={HeartPulse} tone="success" />
        <StatCard label="Notes added" value="6" icon={NotebookPen} tone="primary" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <TriangleAlert className="size-4 text-warning" />
          <h3 className="font-semibold">Clinical alerts</h3>
        </div>
        <EmptyState
          className="mt-4 py-12"
          title="No alerts right now"
          description="Abnormal vitals and clinical flags will appear here once patient data is connected."
        />
      </div>
    </div>
  );
}
