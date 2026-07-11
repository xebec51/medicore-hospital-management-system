"use client";

import { StatusBadge } from "@/components/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatCurrency, formatDate } from "@/lib/i18n/formatters";

interface PatientInvoiceRowProps {
  invoice: {
    id: string;
    invoiceCode: string;
    status: string;
    totalAmount: unknown;
    paidAmount: unknown;
    dueDate: Date | string | null;
    createdAt: Date | string;
  };
}

export function PatientInvoiceRow({ invoice }: PatientInvoiceRowProps) {
  const { locale } = useI18n();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
      <div>
        <p className="font-medium">{invoice.invoiceCode}</p>
        <p className="text-xs text-muted-foreground">
          Issued {formatDate(invoice.createdAt, locale)}
          {invoice.dueDate ? ` · Due ${formatDate(invoice.dueDate, locale)}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right text-sm">
          <p className="font-medium">{formatCurrency(String(invoice.totalAmount), locale)}</p>
          <p className="text-xs text-muted-foreground">Paid {formatCurrency(String(invoice.paidAmount), locale)}</p>
        </div>
        <StatusBadge status={invoice.status} domain="InvoiceStatus" />
      </div>
    </div>
  );
}
