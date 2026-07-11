"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/domain/activity-log";
import { createVitalSignSchema } from "@/lib/validations/vital-sign";

type ActionResult = { success: true } | { success: false; error: string };

export async function createVitalSign(input: unknown): Promise<ActionResult> {
  const session = await requireRole("NURSE", "DOCTOR", "ADMIN");
  const parsed = createVitalSignSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const appointment = await prisma.appointment.findUnique({
    where: { id: data.appointmentId },
    select: { patientId: true, status: true },
  });
  if (!appointment) return { success: false, error: "Appointment not found" };
  if (!["CHECKED_IN", "IN_CONSULTATION", "COMPLETED"].includes(appointment.status)) {
    return { success: false, error: "The patient must be checked in before recording vitals" };
  }

  await prisma.vitalSign.create({
    data: {
      appointmentId: data.appointmentId,
      patientId: appointment.patientId,
      recordedBy: session.user.id,
      bloodPressure: data.bloodPressure || null,
      heartRate: data.heartRate ?? null,
      temperature: data.temperature ?? null,
      weight: data.weight ?? null,
      height: data.height ?? null,
      oxygenSaturation: data.oxygenSaturation ?? null,
      notes: data.notes || null,
    },
  });

  await recordActivity({
    userId: session.user.id,
    action: "CREATE",
    module: "Vital Signs",
    description: "Recorded vital signs",
  });

  revalidatePath("/dashboard/nurse/queue");
  revalidatePath("/dashboard/nurse/vital-signs");
  revalidatePath("/dashboard/nurse");
  revalidatePath(`/dashboard/doctor/consultation/${data.appointmentId}`);
  return { success: true };
}
