import { listCompletedAppointmentsWithoutInvoice, listInvoices } from "@/lib/queries/invoices";
import { DataTable } from "@/components/data-table";
import { invoiceColumns } from "@/components/cashier/invoice-columns";
import { GenerateInvoiceButton } from "@/components/cashier/generate-invoice-button";
import { EmptyState } from "@/components/empty-state";
import { ExportButton } from "@/components/export-button";
import { getStatusLabel } from "@/lib/domain/status-labels";
import { toMoneyNumber } from "@/lib/domain/billing";

export default async function CashierInvoicesPage() {
  const [invoices, uninvoiced] = await Promise.all([listInvoices(), listCompletedAppointmentsWithoutInvoice()]);

  const exportRows = invoices.map((inv) => ({
    "Invoice Code": inv.invoiceCode,
    Patient: inv.patient.name,
    MRN: inv.patient.medicalRecordNumber,
    Total: toMoneyNumber(inv.totalAmount),
    Paid: toMoneyNumber(inv.paidAmount),
    Due: inv.dueDate ? new Date(inv.dueDate).toISOString().slice(0, 10) : "",
    Status: getStatusLabel("InvoiceStatus", inv.status),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">Generate invoices and track payment status.</p>
        </div>
        <ExportButton data={exportRows} filename="medicore-invoices" sheetName="Invoices" />
      </div>

      {uninvoiced.length > 0 && (
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
          <h3 className="mb-3 font-semibold">Ready to invoice</h3>
          <div className="space-y-2">
            {uninvoiced.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">{appt.patient.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {appt.patient.medicalRecordNumber} · {appt.doctor.user.name} ({appt.doctor.specialization})
                  </p>
                </div>
                <GenerateInvoiceButton appointmentId={appt.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {invoices.length ? (
        <DataTable
          columns={invoiceColumns}
          data={invoices}
          searchKey="patientName"
          searchPlaceholder="Search by patient…"
        />
      ) : (
        <EmptyState title="No invoices yet" description="Generate an invoice from a completed appointment above." />
      )}
    </div>
  );
}
