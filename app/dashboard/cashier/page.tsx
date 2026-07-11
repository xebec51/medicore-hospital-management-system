import { getCashierDashboardStats } from "@/lib/queries/cashier";
import { listUnpaidInvoices } from "@/lib/queries/invoices";
import { CashierDashboardView } from "@/components/dashboard/cashier-dashboard-view";

export default async function CashierDashboardPage() {
  const [stats, unpaidInvoices] = await Promise.all([getCashierDashboardStats(), listUnpaidInvoices()]);

  return (
    <CashierDashboardView
      unpaidCount={stats.unpaidCount}
      paidToday={stats.paidToday}
      dailyRevenue={stats.dailyRevenue}
      unpaidInvoices={unpaidInvoices}
    />
  );
}
