"use client";

import { CalendarClock, CheckCircle2, Clock, UserRound } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { useI18n } from "@/lib/i18n/use-i18n";

// TODO(phase-9): replace mock stats with the doctor's real consultation queue.
export default function DoctorDashboardPage() {
  const { t } = useI18n();
  const c = "dashboardPages.doctor";

  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow={t(`${c}.eyebrow`)} title={t(`${c}.title`)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t(`${c}.stats.todayAppointments`)} value="12" icon={CalendarClock} tone="info" />
        <StatCard label={t(`${c}.stats.completed`)} value="7" icon={CheckCircle2} tone="success" />
        <StatCard label={t(`${c}.stats.pending`)} value="5" icon={Clock} tone="warning" />
        <StatCard label={t(`${c}.stats.recentPatients`)} value="34" icon={UserRound} tone="primary" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">{t(`${c}.queueTitle`)}</h3>
        <EmptyState className="mt-4 py-12" title={t(`${c}.queueEmptyTitle`)} description={t(`${c}.queueEmptyDesc`)} />
      </div>
    </div>
  );
}
