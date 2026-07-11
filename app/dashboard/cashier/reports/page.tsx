import { Wallet } from "lucide-react";
import { getCashierDashboardStats } from "@/lib/queries/cashier";
import { StatCard } from "@/components/stat-card";
import { formatCurrency } from "@/lib/i18n/formatters";
import { getStatusLabel } from "@/lib/domain/status-labels";

export default async function CashierReportsPage() {
  const stats = await getCashierDashboardStats();
  const methodEntries = Object.entries(stats.methodTotals).filter(([, amount]) => amount > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Daily revenue report</h1>
        <p className="text-sm text-muted-foreground">Today&apos;s revenue broken down by payment method.</p>
      </div>

      <StatCard
        label="Revenue today"
        value={formatCurrency(stats.dailyRevenue, "en")}
        icon={Wallet}
        tone="success"
        className="max-w-xs"
      />

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="mb-3 font-semibold">Payment method distribution</h3>
        {methodEntries.length ? (
          <div className="space-y-2">
            {methodEntries.map(([method, amount]) => (
              <div key={method} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 text-sm">
                <span>{getStatusLabel("PaymentMethod", method)}</span>
                <span className="font-medium">{formatCurrency(amount, "en")}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No payments recorded today yet.</p>
        )}
      </div>
    </div>
  );
}
