import type { MedicineStatus } from "@/app/generated/prisma/enums";

/**
 * Derives the natural stock/expiry status for a medicine. INACTIVE is a
 * manual admin/pharmacist override and is preserved rather than recalculated.
 */
export function computeMedicineStatus(
  stock: number,
  minimumStock: number,
  expiryDate: Date | null,
  currentStatus?: MedicineStatus,
): MedicineStatus {
  if (currentStatus === "INACTIVE") return "INACTIVE";
  if (expiryDate && expiryDate.getTime() < Date.now()) return "EXPIRED";
  if (stock <= minimumStock) return "LOW_STOCK";
  return "ACTIVE";
}

export function isDispensable(stock: number, requestedQuantity: number): boolean {
  return stock >= requestedQuantity;
}
