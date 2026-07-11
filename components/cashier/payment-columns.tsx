"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatCurrency, formatDateTime } from "@/lib/i18n/formatters";
import type { PaymentListItem } from "@/lib/queries/cashier";

function MoneyCell({ value }: { value: unknown }) {
  const { locale } = useI18n();
  return <span className="text-sm">{formatCurrency(String(value), locale)}</span>;
}

function DateCell({ date }: { date: Date | string }) {
  const { locale } = useI18n();
  return <span className="text-sm">{formatDateTime(date, locale)}</span>;
}

function MethodCell({ method }: { method: string }) {
  const { t } = useI18n();
  return <span className="text-sm">{t(`status.PaymentMethod.${method}`)}</span>;
}

export const paymentColumns: ColumnDef<PaymentListItem>[] = [
  {
    id: "patientName",
    accessorFn: (row) => row.invoice.patient.name,
    header: "Patient",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.invoice.patient.name}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.paymentCode} · {row.original.invoice.invoiceCode}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <MoneyCell value={row.original.amount} />,
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => <MethodCell method={row.original.method} />,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} domain="PaymentStatus" />,
  },
];
