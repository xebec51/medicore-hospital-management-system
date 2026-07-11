import { notFound } from "next/navigation";
import { getInvoiceDetail } from "@/lib/queries/invoices";
import { InvoiceSummaryCard } from "@/components/invoice-summary-card";
import { PaymentPanel } from "@/components/payment-panel";
import { AddInvoiceItemDialog } from "@/components/cashier/add-invoice-item-dialog";
import { StatusBadge } from "@/components/status-badge";
import { PrintButton } from "@/components/print-button";
import { toMoneyNumber } from "@/lib/domain/billing";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getInvoiceDetail(id);
  if (!invoice) notFound();

  const balance = toMoneyNumber(invoice.totalAmount) - toMoneyNumber(invoice.paidAmount);
  const canModify = invoice.status !== "PAID" && invoice.status !== "CANCELLED";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{invoice.invoiceCode}</h1>
          <p className="text-sm text-muted-foreground">
            {invoice.appointment ? `Appointment ${invoice.appointment.appointmentCode}` : "Standalone invoice"}
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <PrintButton />
          {canModify ? <AddInvoiceItemDialog invoiceId={invoice.id} /> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 print:grid-cols-1">
        <InvoiceSummaryCard
          invoiceCode={invoice.invoiceCode}
          status={invoice.status}
          createdAt={invoice.createdAt}
          dueDate={invoice.dueDate}
          patientName={invoice.patient.name}
          medicalRecordNumber={invoice.patient.medicalRecordNumber}
          items={invoice.items}
          totalAmount={invoice.totalAmount}
          paidAmount={invoice.paidAmount}
        />

        {canModify ? (
          <PaymentPanel invoiceId={invoice.id} balance={balance} />
        ) : (
          <div className="rounded-2xl border border-border/70 bg-card p-5 text-center text-sm text-muted-foreground shadow-sm print:hidden">
            This invoice is {invoice.status.toLowerCase()} and cannot accept further payments.
          </div>
        )}
      </div>

      {invoice.payments.length > 0 && (
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <h3 className="mb-3 font-semibold">Payment history</h3>
          <div className="space-y-2">
            {invoice.payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium">{payment.paymentCode}</p>
                  <p className="text-xs text-muted-foreground">
                    {payment.referenceNumber ?? "No reference"} · {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p>{toMoneyNumber(payment.amount).toLocaleString()}</p>
                  <StatusBadge status={payment.status} domain="PaymentStatus" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
