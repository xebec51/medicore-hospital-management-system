"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/domain/activity-log";
import { generateAppointmentCode } from "@/lib/domain/codes";
import { getNextQueueNumber } from "@/lib/domain/queue";
import { combineDateAndTime } from "@/lib/domain/dates";
import {
  appointmentIdSchema,
  cancelAppointmentSchema,
  createAppointmentSchema,
  rescheduleAppointmentSchema,
} from "@/lib/validations/appointment";

type ActionResult = { success: true } | { success: false; error: string };

const APPOINTMENT_PATHS = [
  "/dashboard/receptionist/appointments",
  "/dashboard/receptionist/queue",
  "/dashboard/receptionist",
  "/dashboard/admin/appointments",
  "/dashboard/doctor/appointments",
  "/dashboard/doctor",
  "/dashboard/nurse/queue",
  "/dashboard/nurse",
];

function revalidateAppointmentPaths() {
  for (const path of APPOINTMENT_PATHS) revalidatePath(path);
}

async function resolveDoctorId(userId: string): Promise<string | null> {
  const doctor = await prisma.doctor.findUnique({ where: { userId }, select: { id: true } });
  return doctor?.id ?? null;
}

export async function createAppointment(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "RECEPTIONIST");
  const parsed = createAppointmentSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const doctor = await prisma.doctor.findUnique({ where: { id: data.doctorId }, select: { departmentId: true, isActive: true } });
  if (!doctor) return { success: false, error: "Doctor not found" };
  if (!doctor.isActive) return { success: false, error: "This doctor is not currently active" };

  const appointmentDate = combineDateAndTime(new Date(data.date), data.time);
  const queueNumber = await getNextQueueNumber(data.doctorId, appointmentDate);

  const appointment = await prisma.appointment.create({
    data: {
      appointmentCode: generateAppointmentCode(),
      patientId: data.patientId,
      doctorId: data.doctorId,
      departmentId: doctor.departmentId,
      appointmentDate,
      queueNumber,
      reason: data.reason || null,
      createdBy: session.user.id,
    },
  });

  await recordActivity({
    userId: session.user.id,
    action: "CREATE",
    module: "Appointments",
    description: `Created appointment ${appointment.appointmentCode} (queue #${queueNumber})`,
  });

  revalidateAppointmentPaths();
  return { success: true };
}

export async function rescheduleAppointment(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "RECEPTIONIST");
  const parsed = rescheduleAppointmentSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const existing = await prisma.appointment.findUnique({ where: { id: data.id }, select: { status: true, doctorId: true } });
  if (!existing) return { success: false, error: "Appointment not found" };
  if (existing.status !== "SCHEDULED") return { success: false, error: "Only scheduled appointments can be rescheduled" };

  const appointmentDate = combineDateAndTime(new Date(data.date), data.time);
  const queueNumber = await getNextQueueNumber(existing.doctorId, appointmentDate);

  const appointment = await prisma.appointment.update({
    where: { id: data.id },
    data: { appointmentDate, queueNumber },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Appointments",
    description: `Rescheduled appointment ${appointment.appointmentCode} to queue #${queueNumber}`,
  });

  revalidateAppointmentPaths();
  return { success: true };
}

export async function cancelAppointment(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "RECEPTIONIST");
  const parsed = cancelAppointmentSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const existing = await prisma.appointment.findUnique({ where: { id: data.id }, select: { status: true } });
  if (!existing) return { success: false, error: "Appointment not found" };
  if (existing.status === "COMPLETED" || existing.status === "CANCELLED") {
    return { success: false, error: "This appointment can no longer be cancelled" };
  }

  const appointment = await prisma.appointment.update({
    where: { id: data.id },
    data: { status: "CANCELLED", cancelledReason: data.cancelledReason },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Appointments",
    description: `Cancelled appointment ${appointment.appointmentCode}`,
  });

  revalidateAppointmentPaths();
  return { success: true };
}

export async function checkInAppointment(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "RECEPTIONIST");
  const parsed = appointmentIdSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const existing = await prisma.appointment.findUnique({ where: { id: parsed.data.id }, select: { status: true } });
  if (!existing) return { success: false, error: "Appointment not found" };
  if (existing.status !== "SCHEDULED") return { success: false, error: "Only scheduled appointments can be checked in" };

  const appointment = await prisma.appointment.update({
    where: { id: parsed.data.id },
    data: { status: "CHECKED_IN", checkedInAt: new Date() },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Appointments",
    description: `Checked in appointment ${appointment.appointmentCode}`,
  });

  revalidateAppointmentPaths();
  return { success: true };
}

export async function markAppointmentNoShow(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "RECEPTIONIST");
  const parsed = appointmentIdSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const existing = await prisma.appointment.findUnique({ where: { id: parsed.data.id }, select: { status: true } });
  if (!existing) return { success: false, error: "Appointment not found" };
  if (existing.status !== "SCHEDULED") return { success: false, error: "Only scheduled appointments can be marked as no-show" };

  const appointment = await prisma.appointment.update({
    where: { id: parsed.data.id },
    data: { status: "NO_SHOW" },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Appointments",
    description: `Marked appointment ${appointment.appointmentCode} as no-show`,
  });

  revalidateAppointmentPaths();
  return { success: true };
}

export async function startConsultation(input: unknown): Promise<ActionResult> {
  const session = await requireRole("DOCTOR");
  const parsed = appointmentIdSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const doctorId = await resolveDoctorId(session.user.id);
  if (!doctorId) return { success: false, error: "Doctor profile not found" };

  const existing = await prisma.appointment.findUnique({
    where: { id: parsed.data.id },
    select: { status: true, doctorId: true },
  });
  if (!existing) return { success: false, error: "Appointment not found" };
  if (existing.doctorId !== doctorId) return { success: false, error: "This appointment is not assigned to you" };
  if (existing.status !== "CHECKED_IN") return { success: false, error: "Patient must be checked in first" };

  const appointment = await prisma.appointment.update({
    where: { id: parsed.data.id },
    data: { status: "IN_CONSULTATION", consultationStartedAt: new Date() },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Consultation",
    description: `Started consultation for appointment ${appointment.appointmentCode}`,
  });

  revalidateAppointmentPaths();
  return { success: true };
}

export async function completeAppointment(input: unknown): Promise<ActionResult> {
  const session = await requireRole("DOCTOR");
  const parsed = appointmentIdSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const doctorId = await resolveDoctorId(session.user.id);
  if (!doctorId) return { success: false, error: "Doctor profile not found" };

  const existing = await prisma.appointment.findUnique({
    where: { id: parsed.data.id },
    select: { status: true, doctorId: true },
  });
  if (!existing) return { success: false, error: "Appointment not found" };
  if (existing.doctorId !== doctorId) return { success: false, error: "This appointment is not assigned to you" };
  if (existing.status !== "IN_CONSULTATION") {
    return { success: false, error: "The consultation must be started before it can be completed" };
  }

  const appointment = await prisma.appointment.update({
    where: { id: parsed.data.id },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Consultation",
    description: `Completed consultation for appointment ${appointment.appointmentCode}`,
  });

  revalidateAppointmentPaths();
  return { success: true };
}
