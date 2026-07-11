import { prisma } from "@/lib/prisma";

export function listPrescriptionsForPharmacy() {
  return prisma.prescription.findMany({
    where: { status: { in: ["PENDING", "PREPARED"] } },
    select: {
      id: true,
      prescriptionCode: true,
      status: true,
      notes: true,
      createdAt: true,
      patient: { select: { name: true, medicalRecordNumber: true } },
      doctor: { select: { user: { select: { name: true } } } },
      items: {
        select: {
          id: true,
          quantity: true,
          dosage: true,
          frequency: true,
          duration: true,
          instructions: true,
          medicine: { select: { id: true, name: true, unit: true, stock: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export type PharmacyPrescriptionItem = Awaited<ReturnType<typeof listPrescriptionsForPharmacy>>[number];

export function listAllMedicines(limit = 500) {
  return prisma.medicine.findMany({
    select: {
      id: true,
      medicineCode: true,
      name: true,
      category: true,
      unit: true,
      stock: true,
      minimumStock: true,
      expiryDate: true,
      price: true,
      status: true,
    },
    orderBy: { name: "asc" },
    take: limit,
  });
}

export type MedicineListItem = Awaited<ReturnType<typeof listAllMedicines>>[number];

export async function getPharmacistDashboardStats() {
  const [pending, prepared, lowStock, expired] = await Promise.all([
    prisma.prescription.count({ where: { status: "PENDING" } }),
    prisma.prescription.count({ where: { status: "PREPARED" } }),
    prisma.medicine.count({ where: { status: "LOW_STOCK" } }),
    prisma.medicine.count({ where: { status: "EXPIRED" } }),
  ]);
  return { pending, prepared, lowStock, expired };
}
