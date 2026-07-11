"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicineStockBadge } from "@/components/medicine-stock-badge";
import { MedicineFormDialog } from "./medicine-form-dialog";
import { adjustMedicineStock } from "@/lib/actions/medicines";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatCurrency, formatDate } from "@/lib/i18n/formatters";
import type { MedicineListItem } from "@/lib/queries/pharmacy";

function PriceCell({ price }: { price: unknown }) {
  const { locale } = useI18n();
  return <span className="text-sm">{formatCurrency(String(price), locale)}</span>;
}

function ExpiryCell({ date }: { date: Date | string | null }) {
  const { locale } = useI18n();
  if (!date) return <span className="text-sm text-muted-foreground">—</span>;
  return <span className="text-sm">{formatDate(date, locale)}</span>;
}

function StockAdjustCell({ medicine }: { medicine: MedicineListItem }) {
  const router = useRouter();

  async function adjust(delta: number) {
    const result = await adjustMedicineStock({ id: medicine.id, delta });
    if (result.success) {
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon-sm" aria-label="Decrease stock" onClick={() => adjust(-1)} disabled={medicine.stock <= 0}>
        <Minus className="size-3.5" />
      </Button>
      <MedicineStockBadge status={medicine.status} stock={medicine.stock} unit={medicine.unit} />
      <Button variant="ghost" size="icon-sm" aria-label="Increase stock" onClick={() => adjust(1)}>
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}

export const medicineColumns: ColumnDef<MedicineListItem>[] = [
  {
    accessorKey: "name",
    header: "Medicine",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.medicineCode} · {row.original.category}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => <StockAdjustCell medicine={row.original} />,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <PriceCell price={row.original.price} />,
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry",
    cell: ({ row }) => <ExpiryCell date={row.original.expiryDate} />,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <MedicineFormDialog
          medicine={row.original}
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit medicine">
              <Pencil className="size-4" />
            </Button>
          }
        />
      </div>
    ),
  },
];
