"use client";

import { CheckCircle2, Receipt, TrendingUp, Wallet } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { useI18n } from "@/lib/i18n/use-i18n";

// TODO(phase-11): connect to real invoices, payments, and daily revenue.
export default function CashierDashboardPage() {
  const { t } = useI18n();
  const c = "dashboardPages.cashier";

  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow={t(`${c}.eyebrow`)} title={t(`${c}.title`)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t(`${c}.stats.unpaidInvoices`)} value="17" icon={Receipt} tone="warning" />
        <StatCard label={t(`${c}.stats.paidToday`)} value="23" icon={CheckCircle2} tone="success" />
        <StatCard label={t(`${c}.stats.dailyRevenue`)} value="Rp 18.4M" icon={Wallet} tone="primary" />
        <StatCard label={t(`${c}.stats.revenueTrend`)} value="+8.2%" icon={TrendingUp} tone="info" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">{t(`${c}.queueTitle`)}</h3>
        <EmptyState className="mt-4 py-12" title={t(`${c}.queueEmptyTitle`)} description={t(`${c}.queueEmptyDesc`)} />
      </div>
    </div>
  );
}
