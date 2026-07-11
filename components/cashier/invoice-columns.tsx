"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatCurrency, formatDate } from "@/lib/i18n/formatters";
import type { InvoiceListItem } from "@/lib/queries/invoices";

function MoneyCell({ value }: { value: unknown }) {
  const { locale } = useI18n();
  return <span className="text-sm">{formatCurrency(String(value), locale)}</span>;
}

function DateCell({ date }: { date: Date | string | null }) {
  const { locale } = useI18n();
  if (!date) return <span className="text-sm text-muted-foreground">—</span>;
  return <span className="text-sm">{formatDate(date, locale)}</span>;
}

export const invoiceColumns: ColumnDef<InvoiceListItem>[] = [
  {
    id: "patientName",
    accessorFn: (row) => row.patient.name,
    header: "Patient",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.patient.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.invoiceCode}</p>
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => <MoneyCell value={row.original.totalAmount} />,
  },
  {
    accessorKey: "paidAmount",
    header: "Paid",
    cell: ({ row }) => <MoneyCell value={row.original.paidAmount} />,
  },
  {
    accessorKey: "dueDate",
    header: "Due",
    cell: ({ row }) => <DateCell date={row.original.dueDate} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} domain="InvoiceStatus" />,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button variant="ghost" size="icon-sm" render={<Link href={`/dashboard/cashier/invoices/${row.original.id}`} />}>
          <Eye className="size-4" />
        </Button>
      </div>
    ),
  },
];
