import { listPayments } from "@/lib/queries/cashier";
import { DataTable } from "@/components/data-table";
import { paymentColumns } from "@/components/cashier/payment-columns";
import { ExportButton } from "@/components/export-button";
import { getStatusLabel } from "@/lib/domain/status-labels";
import { toMoneyNumber } from "@/lib/domain/billing";

export default async function CashierPaymentsPage() {
  const payments = await listPayments();

  const exportRows = payments.map((p) => ({
    "Payment Code": p.paymentCode,
    Patient: p.invoice.patient.name,
    Invoice: p.invoice.invoiceCode,
    Amount: toMoneyNumber(p.amount),
    Method: getStatusLabel("PaymentMethod", p.method),
    Status: getStatusLabel("PaymentStatus", p.status),
    Date: new Date(p.createdAt).toISOString().slice(0, 16).replace("T", " "),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">Every payment processed at the counter.</p>
        </div>
        <ExportButton data={exportRows} filename="medicore-payments" sheetName="Payments" />
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
