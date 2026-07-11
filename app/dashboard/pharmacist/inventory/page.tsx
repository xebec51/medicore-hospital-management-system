import { CalendarX, TriangleAlert } from "lucide-react";
import { listAllMedicines } from "@/lib/queries/pharmacy";
import { MedicineStockBadge } from "@/components/medicine-stock-badge";
import { EmptyState } from "@/components/empty-state";

export default async function PharmacistInventoryPage() {
  const medicines = await listAllMedicines();
  const lowStock = medicines.filter((m) => m.status === "LOW_STOCK");
  const expired = medicines.filter((m) => m.status === "EXPIRED");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inventory alerts</h1>
        <p className="text-sm text-muted-foreground">Medicines that need restocking or removal.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <TriangleAlert className="size-4 text-warning" />
            <h3 className="font-semibold">Low stock</h3>
          </div>
          {lowStock.length ? (
            <div className="mt-3 space-y-2">
              {lowStock.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">Minimum: {m.minimumStock}</p>
                  </div>
                  <MedicineStockBadge status={m.status} stock={m.stock} unit={m.unit} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState className="mt-3 py-8" title="No low-stock medicines" />
          )}
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarX className="size-4 text-destructive" />
            <h3 className="font-semibold">Expired</h3>
          </div>
          {expired.length ? (
            <div className="mt-3 space-y-2">
              {expired.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Expired: {m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <MedicineStockBadge status={m.status} stock={m.stock} unit={m.unit} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState className="mt-3 py-8" title="No expired medicines" />
          )}
        </div>
      </div>
    </div>
  );
}
