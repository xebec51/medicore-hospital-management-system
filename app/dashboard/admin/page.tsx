"use client";

import { Activity, CalendarClock, Pill, Stethoscope, TriangleAlert, Users2, Wallet } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { useI18n } from "@/lib/i18n/use-i18n";

// TODO(phase-7/13): replace mock stats with real Prisma-backed analytics.
export default function AdminDashboardPage() {
  const { t } = useI18n();
  const c = "dashboardPages.admin";

  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow={t(`${c}.eyebrow`)} title={t(`${c}.title`)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label={t(`${c}.stats.totalPatients`)} value="1,284" icon={Users2} tone="primary" />
        <StatCard label={t(`${c}.stats.todayAppointments`)} value="42" icon={CalendarClock} tone="info" />
        <StatCard label={t(`${c}.stats.activeDoctors`)} value="18" icon={Stethoscope} tone="clinical" />
        <StatCard label={t(`${c}.stats.revenueThisMonth`)} value="Rp 412M" icon={Wallet} tone="success" />
        <StatCard label={t(`${c}.stats.pendingPrescriptions`)} value="9" icon={Pill} tone="warning" />
        <StatCard label={t(`${c}.stats.lowStockMedicines`)} value="5" icon={Activity} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="font-semibold">{t("dashboard.recentActivity")}</h3>
          <EmptyState
            className="mt-4 py-10"
            title={t(`${c}.activityEmptyTitle`)}
            description={t(`${c}.activityEmptyDesc`)}
          />
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TriangleAlert className="size-4 text-warning" />
            <h3 className="font-semibold">{t("dashboard.operationalAlerts")}</h3>
          </div>
          <EmptyState
            className="mt-4 py-10"
            title={t(`${c}.alertsEmptyTitle`)}
            description={t(`${c}.alertsEmptyDesc`)}
          />
        </div>
      </div>
    </div>
  );
}
