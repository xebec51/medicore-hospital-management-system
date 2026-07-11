import { listAllMedicines } from "@/lib/queries/pharmacy";
import { DataTable } from "@/components/data-table";
import { medicineColumns } from "@/components/pharmacist/medicine-columns";
import { MedicineFormDialog } from "@/components/pharmacist/medicine-form-dialog";

export default async function PharmacistMedicinesPage() {
  const medicines = await listAllMedicines();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Medicine catalog</h1>
          <p className="text-sm text-muted-foreground">Manage the full pharmacy medicine catalog.</p>
        </div>
        <MedicineFormDialog />
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
