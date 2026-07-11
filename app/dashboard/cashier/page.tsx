import { CheckCircle2, Receipt, TrendingUp, Wallet } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";

// TODO(phase-11): connect to real invoices, payments, and daily revenue.
export default function CashierDashboardPage() {
  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow="Cashier" title="Billing & payments workspace" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Unpaid invoices" value="17" icon={Receipt} tone="warning" />
        <StatCard label="Paid today" value="23" icon={CheckCircle2} tone="success" />
        <StatCard label="Daily revenue" value="Rp 18.4M" icon={Wallet} tone="primary" />
        <StatCard label="Revenue trend" value="+8.2%" icon={TrendingUp} tone="info" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">Unpaid invoices queue</h3>
        <EmptyState
          className="mt-4 py-12"
          title="No unpaid invoices yet"
          description="Outstanding invoices will appear here once the billing workflow is connected."
        />
      </div>
    </div>
  );
}
