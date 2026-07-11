import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";

interface MedicineStockBadgeProps {
  status: string;
  stock: number;
  unit: string;
  className?: string;
}

export function MedicineStockBadge({ status, stock, unit, className }: MedicineStockBadgeProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm tabular-nums">
        {stock} {unit}
      </span>
      <StatusBadge status={status} domain="MedicineStatus" />
    </div>
  );
}
