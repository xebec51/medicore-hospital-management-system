"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/domain/activity-log";
import { generateMedicineCode } from "@/lib/domain/codes";
import { computeMedicineStatus } from "@/lib/domain/medicine";
import { adjustStockSchema, createMedicineSchema, updateMedicineSchema } from "@/lib/validations/medicine";

type ActionResult = { success: true } | { success: false; error: string };

const MEDICINE_PATHS = ["/dashboard/pharmacist/medicines", "/dashboard/pharmacist/inventory", "/dashboard/pharmacist"];

function revalidateMedicinePaths() {
  for (const path of MEDICINE_PATHS) revalidatePath(path);
}

export async function createMedicine(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "PHARMACIST");
  const parsed = createMedicineSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
  const status = computeMedicineStatus(data.stock, data.minimumStock, expiryDate);

  const medicine = await prisma.medicine.create({
    data: {
      medicineCode: generateMedicineCode(),
      name: data.name,
      category: data.category,
      unit: data.unit,
      stock: data.stock,
      minimumStock: data.minimumStock,
      price: data.price,
      expiryDate,
      status,
    },
  });

  await recordActivity({
    userId: session.user.id,
    action: "CREATE",
    module: "Inventory",
    description: `Added medicine ${medicine.name}`,
  });

  revalidateMedicinePaths();
  return { success: true };
}

export async function updateMedicine(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "PHARMACIST");
  const parsed = updateMedicineSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
  const status = computeMedicineStatus(data.stock, data.minimumStock, expiryDate);

  const medicine = await prisma.medicine.update({
    where: { id: data.id },
    data: {
      name: data.name,
      category: data.category,
      unit: data.unit,
      stock: data.stock,
      minimumStock: data.minimumStock,
      price: data.price,
      expiryDate,
      status,
    },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Inventory",
    description: `Updated medicine ${medicine.name}`,
  });

  revalidateMedicinePaths();
  return { success: true };
}

export async function toggleMedicineActive(id: string, isActive: boolean): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "PHARMACIST");

  const existing = await prisma.medicine.findUniqueOrThrow({ where: { id } });
  const status = isActive
    ? computeMedicineStatus(existing.stock, existing.minimumStock, existing.expiryDate)
    : "INACTIVE";

  const medicine = await prisma.medicine.update({ where: { id }, data: { status } });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Inventory",
    description: `${isActive ? "Reactivated" : "Deactivated"} medicine ${medicine.name}`,
  });

  revalidateMedicinePaths();
  return { success: true };
}

export async function adjustMedicineStock(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "PHARMACIST");
  const parsed = adjustStockSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const existing = await prisma.medicine.findUniqueOrThrow({ where: { id: parsed.data.id } });
  const nextStock = existing.stock + parsed.data.delta;
  if (nextStock < 0) return { success: false, error: "Stock cannot go below zero" };

  const status = computeMedicineStatus(nextStock, existing.minimumStock, existing.expiryDate, existing.status);
  const medicine = await prisma.medicine.update({ where: { id: parsed.data.id }, data: { stock: nextStock, status } });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Inventory",
    description: `Adjusted stock for ${medicine.name} by ${parsed.data.delta > 0 ? "+" : ""}${parsed.data.delta}`,
  });

  revalidateMedicinePaths();
  return { success: true };
}
