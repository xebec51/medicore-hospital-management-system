"use client";

import Link from "next/link";
import { CheckCircle2, Receipt, Wallet } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatCurrency } from "@/lib/i18n/formatters";
import type { InvoiceListItem } from "@/lib/queries/invoices";

interface CashierDashboardViewProps {
  unpaidCount: number;
  paidToday: number;
  dailyRevenue: number;
  unpaidInvoices: InvoiceListItem[];
}

export function CashierDashboardView({ unpaidCount, paidToday, dailyRevenue, unpaidInvoices }: CashierDashboardViewProps) {
  const { locale, t } = useI18n();
  const c = "dashboardPages.cashier";

  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow={t(`${c}.eyebrow`)} title={t(`${c}.title`)} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t(`${c}.stats.unpaidInvoices`)} value={unpaidCount} icon={Receipt} tone="warning" />
        <StatCard label={t(`${c}.stats.paidToday`)} value={paidToday} icon={CheckCircle2} tone="success" />
        <StatCard label={t(`${c}.stats.dailyRevenue`)} value={formatCurrency(dailyRevenue, locale)} icon={Wallet} tone="primary" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">{t(`${c}.queueTitle`)}</h3>
        {unpaidInvoices.length ? (
          <div className="mt-4 space-y-2">
            {unpaidInvoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/dashboard/cashier/invoices/${invoice.id}`}
                className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-2.5 transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm font-medium">{invoice.patient.name}</p>
                  <p className="text-xs text-muted-foreground">{invoice.invoiceCode}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{formatCurrency(String(invoice.totalAmount), locale)}</span>
                  <StatusBadge status={invoice.status} domain="InvoiceStatus" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState className="mt-4 py-12" title={t(`${c}.queueEmptyTitle`)} description={t(`${c}.queueEmptyDesc`)} />
        )}
      </div>
    </div>
  );
}
