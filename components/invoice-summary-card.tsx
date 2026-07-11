"use client";

import { StatusBadge } from "@/components/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatCurrency, formatDate } from "@/lib/i18n/formatters";
import { cn } from "@/lib/utils";

interface InvoiceSummaryCardProps {
  invoiceCode: string;
  status: string;
  createdAt: Date | string;
  dueDate?: Date | string | null;
  patientName: string;
  medicalRecordNumber: string;
  items: { id: string; description: string; quantity: number; unitPrice: unknown; subtotal: unknown }[];
  totalAmount: unknown;
  paidAmount: unknown;
  className?: string;
}

export function InvoiceSummaryCard({
  invoiceCode,
  status,
  createdAt,
  dueDate,
  patientName,
  medicalRecordNumber,
  items,
  totalAmount,
  paidAmount,
  className,
}: InvoiceSummaryCardProps) {
  const { locale } = useI18n();
  const balance = Number(totalAmount) - Number(paidAmount);

  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card p-5 shadow-sm", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm text-muted-foreground">{invoiceCode}</p>
          <p className="font-semibold">{patientName}</p>
          <p className="text-xs text-muted-foreground">{medicalRecordNumber}</p>
        </div>
        <StatusBadge status={status} domain="InvoiceStatus" />
      </div>

      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <span>Issued {formatDate(createdAt, locale)}</span>
        {dueDate ? <span>Due {formatDate(dueDate, locale)}</span> : null}
      </div>

      <div className="mt-4 space-y-1.5 border-t border-border/60 pt-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {item.description} × {item.quantity}
            </span>
            <span>{formatCurrency(String(item.subtotal), locale)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1 border-t border-border/60 pt-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-medium">{formatCurrency(String(totalAmount), locale)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Paid</span>
          <span className="text-success">{formatCurrency(String(paidAmount), locale)}</span>
        </div>
        <div className="flex items-center justify-between font-medium">
          <span>Balance</span>
          <span className={balance > 0 ? "text-destructive" : ""}>{formatCurrency(String(balance), locale)}</span>
        </div>
      </div>
    </div>
  );
}
