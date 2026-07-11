"use client";

import { CalendarClock, ListOrdered, Stethoscope, UserRound } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { useI18n } from "@/lib/i18n/use-i18n";

// TODO(phase-8): connect to live queue and appointment data.
export default function ReceptionistDashboardPage() {
  const { t } = useI18n();
  const c = "dashboardPages.receptionist";

  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow={t(`${c}.eyebrow`)} title={t(`${c}.title`)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t(`${c}.stats.checkedInPatients`)} value="19" icon={UserRound} tone="info" />
        <StatCard label={t(`${c}.stats.scheduledToday`)} value="42" icon={CalendarClock} tone="primary" />
        <StatCard label={t(`${c}.stats.inQueue`)} value="11" icon={ListOrdered} tone="warning" />
        <StatCard label={t(`${c}.stats.doctorsAvailable`)} value="14 / 18" icon={Stethoscope} tone="clinical" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">{t(`${c}.timelineTitle`)}</h3>
        <EmptyState
          className="mt-4 py-12"
          title={t(`${c}.timelineEmptyTitle`)}
          description={t(`${c}.timelineEmptyDesc`)}
        />
      </div>
    </div>
  );
}
