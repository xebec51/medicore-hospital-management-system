import { listAllMedicines } from "@/lib/queries/pharmacy";
import { DataTable } from "@/components/data-table";
import { medicineColumns } from "@/components/pharmacist/medicine-columns";
import { MedicineFormDialog } from "@/components/pharmacist/medicine-form-dialog";
import { ExportButton } from "@/components/export-button";
import { getStatusLabel } from "@/lib/domain/status-labels";
import { toMoneyNumber } from "@/lib/domain/billing";

export default async function PharmacistMedicinesPage() {
  const medicines = await listAllMedicines();

  const exportRows = medicines.map((m) => ({
    Code: m.medicineCode,
    Name: m.name,
    Category: m.category,
    Stock: m.stock,
    Unit: m.unit,
    "Minimum Stock": m.minimumStock,
    Price: toMoneyNumber(m.price),
    Expiry: m.expiryDate ? new Date(m.expiryDate).toISOString().slice(0, 10) : "",
    Status: getStatusLabel("MedicineStatus", m.status),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Medicine catalog</h1>
          <p className="text-sm text-muted-foreground">Manage the full pharmacy medicine catalog.</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton data={exportRows} filename="medicore-medicine-inventory" sheetName="Inventory" />
          <MedicineFormDialog />
        </div>
      </div>

      <DataTable
        columns={medicineColumns}
        data={medicines}
        searchKey="name"
        searchPlaceholder="Search medicines…"
        emptyTitle="No medicines yet"
        emptyDescription="Add the first medicine to start building prescriptions."
      />
    </div>
  );
}
