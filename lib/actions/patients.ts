"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/domain/activity-log";
import { generateMedicalRecordNumber } from "@/lib/domain/codes";
import { createPatientSchema, updatePatientSchema } from "@/lib/validations/patient";

type ActionResult = { success: true } | { success: false; error: string };

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function createPatient(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "RECEPTIONIST");
  const parsed = createPatientSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  try {
    const patient = await prisma.patient.create({
      data: {
        medicalRecordNumber: generateMedicalRecordNumber(),
        name: data.name,
        gender: data.gender,
        birthDate: new Date(data.birthDate),
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        bloodType: data.bloodType,
        allergies: data.allergies || null,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
      },
    });

    await recordActivity({
      userId: session.user.id,
      action: "CREATE",
      module: "Patients",
      description: `Registered patient ${patient.name} (${patient.medicalRecordNumber})`,
    });

    revalidatePath("/dashboard/receptionist/patients");
    revalidatePath("/dashboard/admin/patients");
    return { success: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) return { success: false, error: "A matching patient record already exists" };
    throw error;
  }
}

export async function updatePatient(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "RECEPTIONIST");
  const parsed = updatePatientSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const patient = await prisma.patient.update({
    where: { id: data.id },
    data: {
      name: data.name,
      gender: data.gender,
      birthDate: new Date(data.birthDate),
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      bloodType: data.bloodType,
      allergies: data.allergies || null,
      emergencyContactName: data.emergencyContactName || null,
      emergencyContactPhone: data.emergencyContactPhone || null,
    },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Patients",
    description: `Updated patient ${patient.name} (${patient.medicalRecordNumber})`,
  });

  revalidatePath("/dashboard/receptionist/patients");
  revalidatePath("/dashboard/admin/patients");
  return { success: true };
}
