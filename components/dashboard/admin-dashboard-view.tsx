"use client";

import { Activity, CalendarClock, Pill, Stethoscope, TriangleAlert, Users2, Wallet } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { ActivityFeed } from "@/components/activity-feed";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatCurrency } from "@/lib/i18n/formatters";
import type { ActivityLogItem } from "@/lib/queries/activity-logs";

interface AdminDashboardViewProps {
  recentActivity: ActivityLogItem[];
  totalPatients: number;
  appointmentsToday: number;
  activeDoctors: number;
  revenueThisMonth: number;
  pendingPrescriptions: number;
  lowStockMedicines: number;
}

export function AdminDashboardView({
  recentActivity,
  totalPatients,
  appointmentsToday,
  activeDoctors,
  revenueThisMonth,
  pendingPrescriptions,
  lowStockMedicines,
}: AdminDashboardViewProps) {
  const { locale, t } = useI18n();
  const c = "dashboardPages.admin";

  const alerts = [
    lowStockMedicines > 0 ? `${lowStockMedicines} medicine(s) are running low on stock.` : null,
    pendingPrescriptions > 0 ? `${pendingPrescriptions} prescription(s) are awaiting pharmacy action.` : null,
  ].filter((alert): alert is string => alert !== null);

  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow={t(`${c}.eyebrow`)} title={t(`${c}.title`)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label={t(`${c}.stats.totalPatients`)} value={totalPatients} icon={Users2} tone="primary" />
        <StatCard label={t(`${c}.stats.todayAppointments`)} value={appointmentsToday} icon={CalendarClock} tone="info" />
        <StatCard label={t(`${c}.stats.activeDoctors`)} value={activeDoctors} icon={Stethoscope} tone="clinical" />
        <StatCard
          label={t(`${c}.stats.revenueThisMonth`)}
          value={formatCurrency(revenueThisMonth, locale)}
          icon={Wallet}
          tone="success"
        />
        <StatCard label={t(`${c}.stats.pendingPrescriptions`)} value={pendingPrescriptions} icon={Pill} tone="warning" />
        <StatCard label={t(`${c}.stats.lowStockMedicines`)} value={lowStockMedicines} icon={Activity} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="font-semibold">{t("dashboard.recentActivity")}</h3>
          <ActivityFeed
            className="mt-2 max-h-96 overflow-y-auto"
            items={recentActivity}
            emptyTitle={t(`${c}.activityEmptyTitle`)}
            emptyDescription={t(`${c}.activityEmptyDesc`)}
          />
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TriangleAlert className="size-4 text-warning" />
            <h3 className="font-semibold">{t("dashboard.operationalAlerts")}</h3>
          </div>
          {alerts.length ? (
            <ul className="mt-4 space-y-2">
              {alerts.map((alert) => (
                <li key={alert} className="rounded-xl bg-warning/10 px-3 py-2 text-sm text-warning-foreground">
                  {alert}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              className="mt-4 py-10"
              title={t(`${c}.alertsEmptyTitle`)}
              description={t(`${c}.alertsEmptyDesc`)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
