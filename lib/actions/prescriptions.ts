"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/domain/activity-log";
import { generatePrescriptionCode } from "@/lib/domain/codes";
import { computeMedicineStatus } from "@/lib/domain/medicine";
import { resolveDoctorIdByUserId } from "@/lib/queries/doctors";
import { createPrescriptionSchema } from "@/lib/validations/prescription";

type ActionResult = { success: true } | { success: false; error: string };

const PHARMACY_PATHS = [
  "/dashboard/pharmacist/prescriptions",
  "/dashboard/pharmacist/medicines",
  "/dashboard/pharmacist/inventory",
  "/dashboard/pharmacist",
  "/dashboard/doctor/prescriptions",
];

function revalidatePharmacyPaths() {
  for (const path of PHARMACY_PATHS) revalidatePath(path);
}

export async function createPrescription(input: unknown): Promise<ActionResult> {
  const session = await requireRole("DOCTOR");
  const parsed = createPrescriptionSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const doctorId = await resolveDoctorIdByUserId(session.user.id);
  if (!doctorId) return { success: false, error: "Doctor profile not found" };

  const record = await prisma.medicalRecord.findUnique({
    where: { id: data.medicalRecordId },
    select: { doctorId: true, patientId: true, appointmentId: true },
  });
  if (!record) return { success: false, error: "Medical record not found" };
  if (record.doctorId !== doctorId) return { success: false, error: "This record is not assigned to you" };

  const prescription = await prisma.prescription.create({
    data: {
      prescriptionCode: generatePrescriptionCode(),
      medicalRecordId: data.medicalRecordId,
      appointmentId: record.appointmentId,
      patientId: record.patientId,
      doctorId,
      notes: data.notes || null,
      items: {
        create: data.items.map((item) => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          instructions: item.instructions || null,
        })),
      },
    },
  });

  await recordActivity({
    userId: session.user.id,
    action: "CREATE",
    module: "Prescriptions",
    description: `Created prescription ${prescription.prescriptionCode}`,
  });

  revalidatePath(`/dashboard/doctor/consultation/${record.appointmentId}`);
  revalidatePharmacyPaths();
  return { success: true };
}

export async function preparePrescription(id: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "PHARMACIST");

  const existing = await prisma.prescription.findUnique({ where: { id }, select: { status: true, prescriptionCode: true } });
  if (!existing) return { success: false, error: "Prescription not found" };
  if (existing.status !== "PENDING") return { success: false, error: "Only pending prescriptions can be prepared" };

  await prisma.prescription.update({
    where: { id },
    data: { status: "PREPARED", preparedAt: new Date(), preparedBy: session.user.id },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Pharmacy",
    description: `Prepared prescription ${existing.prescriptionCode}`,
  });

  revalidatePharmacyPaths();
  return { success: true };
}

export async function dispensePrescription(id: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "PHARMACIST");

  const prescription = await prisma.prescription.findUnique({
    where: { id },
    select: {
      status: true,
      prescriptionCode: true,
      items: { select: { quantity: true, medicine: { select: { id: true, name: true, stock: true, minimumStock: true, expiryDate: true } } } },
    },
  });
  if (!prescription) return { success: false, error: "Prescription not found" };
  if (prescription.status !== "PREPARED") return { success: false, error: "Only prepared prescriptions can be dispensed" };

  for (const item of prescription.items) {
    if (item.medicine.stock < item.quantity) {
      return { success: false, error: `Insufficient stock for ${item.medicine.name}` };
    }
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        for (const item of prescription.items) {
          const nextStock = item.medicine.stock - item.quantity;
          await tx.medicine.update({
            where: { id: item.medicine.id },
            data: {
              stock: nextStock,
              status: computeMedicineStatus(nextStock, item.medicine.minimumStock, item.medicine.expiryDate),
            },
          });
        }
        await tx.prescription.update({
          where: { id },
          data: { status: "DISPENSED", dispensedAt: new Date(), dispensedBy: session.user.id },
        });
      },
      { timeout: 15000, maxWait: 10000 },
    );
  } catch {
    return { success: false, error: "Could not dispense prescription. Please try again." };
  }

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Pharmacy",
    description: `Dispensed prescription ${prescription.prescriptionCode}`,
  });

  revalidatePharmacyPaths();
  return { success: true };
}

export async function cancelPrescription(id: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "PHARMACIST", "DOCTOR");

  const existing = await prisma.prescription.findUnique({ where: { id }, select: { status: true, prescriptionCode: true } });
  if (!existing) return { success: false, error: "Prescription not found" };
  if (existing.status === "DISPENSED" || existing.status === "CANCELLED") {
    return { success: false, error: "This prescription can no longer be cancelled" };
  }

  await prisma.prescription.update({ where: { id }, data: { status: "CANCELLED" } });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Pharmacy",
    description: `Cancelled prescription ${existing.prescriptionCode}`,
  });

  revalidatePharmacyPaths();
  return { success: true };
}
