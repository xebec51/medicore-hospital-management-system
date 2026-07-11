"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/domain/activity-log";
import { resolveDoctorIdByUserId } from "@/lib/queries/doctors";
import { medicalRecordFormSchema, nurseNotesSchema } from "@/lib/validations/medical-record";

type ActionResult = { success: true } | { success: false; error: string };

function revalidateRecordPaths(appointmentId: string) {
  revalidatePath(`/dashboard/doctor/consultation/${appointmentId}`);
  revalidatePath("/dashboard/doctor/medical-records");
  revalidatePath("/dashboard/nurse/patient-notes");
}

async function upsertMedicalRecord(input: unknown, status: "DRAFT" | "FINALIZED"): Promise<ActionResult> {
  const session = await requireRole("DOCTOR");
  const parsed = medicalRecordFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const doctorId = await resolveDoctorIdByUserId(session.user.id);
  if (!doctorId) return { success: false, error: "Doctor profile not found" };

  const appointment = await prisma.appointment.findUnique({
    where: { id: data.appointmentId },
    select: { doctorId: true, patientId: true, status: true },
  });
  if (!appointment) return { success: false, error: "Appointment not found" };
  if (appointment.doctorId !== doctorId) return { success: false, error: "This appointment is not assigned to you" };
  if (!["CHECKED_IN", "IN_CONSULTATION", "COMPLETED"].includes(appointment.status)) {
    return { success: false, error: "The patient must be checked in before starting a record" };
  }

  const existing = await prisma.medicalRecord.findUnique({
    where: { appointmentId: data.appointmentId },
    select: { status: true },
  });
  if (existing?.status === "FINALIZED") {
    return { success: false, error: "This medical record has already been finalized" };
  }

  const followUpDate = data.followUpDate ? new Date(data.followUpDate) : null;
  const fields = {
    chiefComplaint: data.chiefComplaint,
    diagnosis: data.diagnosis || null,
    doctorNotes: data.doctorNotes || null,
    treatmentPlan: data.treatmentPlan || null,
    followUpDate,
    status,
  };

  await prisma.medicalRecord.upsert({
    where: { appointmentId: data.appointmentId },
    create: { appointmentId: data.appointmentId, patientId: appointment.patientId, doctorId, ...fields },
    update: fields,
  });

  await recordActivity({
    userId: session.user.id,
    action: status === "FINALIZED" ? "UPDATE" : "CREATE",
    module: "Medical Records",
    description: status === "FINALIZED" ? "Finalized a medical record" : "Saved a medical record draft",
  });

  revalidateRecordPaths(data.appointmentId);
  return { success: true };
}

export async function saveMedicalRecordDraft(input: unknown) {
  return upsertMedicalRecord(input, "DRAFT");
}

export async function finalizeMedicalRecord(input: unknown) {
  return upsertMedicalRecord(input, "FINALIZED");
}

export async function saveNurseNotes(input: unknown): Promise<ActionResult> {
  const session = await requireRole("NURSE", "ADMIN");
  const parsed = nurseNotesSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const record = await prisma.medicalRecord.findUnique({
    where: { appointmentId: parsed.data.appointmentId },
    select: { status: true },
  });
  if (!record) return { success: false, error: "No medical record exists for this appointment yet" };
  if (record.status === "FINALIZED") return { success: false, error: "This medical record has already been finalized" };

  await prisma.medicalRecord.update({
    where: { appointmentId: parsed.data.appointmentId },
    data: { nurseNotes: parsed.data.nurseNotes },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Medical Records",
    description: "Added nurse notes to a medical record",
  });

  revalidateRecordPaths(parsed.data.appointmentId);
  return { success: true };
}
