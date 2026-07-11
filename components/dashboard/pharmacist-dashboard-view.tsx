"use client";

import { Boxes, CalendarX, Pill, TriangleAlert } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { useI18n } from "@/lib/i18n/use-i18n";

interface PharmacistDashboardViewProps {
  pending: number;
  prepared: number;
  lowStock: number;
  expired: number;
  hasQueue: boolean;
}

export function PharmacistDashboardView({ pending, prepared, lowStock, expired, hasQueue }: PharmacistDashboardViewProps) {
  const { t } = useI18n();
  const c = "dashboardPages.pharmacist";

  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow={t(`${c}.eyebrow`)} title={t(`${c}.title`)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t(`${c}.stats.pendingPrescriptions`)} value={pending} icon={Pill} tone="warning" />
        <StatCard label={t(`${c}.stats.prepared`)} value={prepared} icon={Boxes} tone="info" />
        <StatCard label={t(`${c}.stats.lowStockMedicines`)} value={lowStock} icon={TriangleAlert} tone="warning" />
        <StatCard label={t(`${c}.stats.expiredMedicines`)} value={expired} icon={CalendarX} tone="destructive" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">{t(`${c}.queueTitle`)}</h3>
        {!hasQueue ? (
          <EmptyState className="mt-4 py-12" title={t(`${c}.queueEmptyTitle`)} description={t(`${c}.queueEmptyDesc`)} />
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            You have {pending} prescription(s) waiting to be prepared and {prepared} ready to dispense.
          </p>
        )}
      </div>
    </div>
  );
}
