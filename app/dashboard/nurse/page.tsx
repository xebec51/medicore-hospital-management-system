"use client";

import { HeartPulse, ListOrdered, NotebookPen, TriangleAlert } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { useI18n } from "@/lib/i18n/use-i18n";

// TODO(phase-9): connect to checked-in queue and vital sign records.
export default function NurseDashboardPage() {
  const { t } = useI18n();
  const c = "dashboardPages.nurse";

  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow={t(`${c}.eyebrow`)} title={t(`${c}.title`)} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t(`${c}.stats.checkedInPatients`)} value="8" icon={ListOrdered} tone="info" />
        <StatCard label={t(`${c}.stats.vitalsRecordedToday`)} value="15" icon={HeartPulse} tone="success" />
        <StatCard label={t(`${c}.stats.notesAdded`)} value="6" icon={NotebookPen} tone="primary" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <TriangleAlert className="size-4 text-warning" />
          <h3 className="font-semibold">{t(`${c}.alertsTitle`)}</h3>
        </div>
        <EmptyState className="mt-4 py-12" title={t(`${c}.alertsEmptyTitle`)} description={t(`${c}.alertsEmptyDesc`)} />
      </div>
    </div>
  );
}
