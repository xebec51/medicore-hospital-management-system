"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/domain/activity-log";
import { generatePrescriptionCode } from "@/lib/domain/codes";
import { resolveDoctorIdByUserId } from "@/lib/queries/doctors";
import { createPrescriptionSchema } from "@/lib/validations/prescription";

type ActionResult = { success: true } | { success: false; error: string };

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
  revalidatePath("/dashboard/doctor/prescriptions");
  revalidatePath("/dashboard/pharmacist/prescriptions");
  return { success: true };
}
