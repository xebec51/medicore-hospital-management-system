import { listPayments } from "@/lib/queries/cashier";
import { DataTable } from "@/components/data-table";
import { paymentColumns } from "@/components/cashier/payment-columns";

export default async function CashierPaymentsPage() {
  const payments = await listPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">Every payment processed at the counter.</p>
      </div>

      <DataTable
        columns={paymentColumns}
        data={payments}
        searchKey="patientName"
        searchPlaceholder="Search by patient…"
        emptyTitle="No payments yet"
        emptyDescription="Payments processed against invoices will appear here."
      />
    </div>
  );
}
