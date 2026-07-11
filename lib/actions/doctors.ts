"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/domain/activity-log";
import {
  createDoctorSchema,
  doctorScheduleSchema,
  updateDoctorSchema,
} from "@/lib/validations/doctor";

type ActionResult = { success: true } | { success: false; error: string };

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function createDoctor(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const parsed = createDoctorSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  let createdUserId: string | null = null;
  try {
    const password = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password, role: "DOCTOR" },
    });
    createdUserId = user.id;

    await prisma.doctor.create({
      data: {
        userId: user.id,
        departmentId: data.departmentId,
        specialization: data.specialization,
        licenseNumber: data.licenseNumber || null,
        consultationFee: data.consultationFee,
        bio: data.bio || null,
        roomNumber: data.roomNumber || null,
      },
    });

    await recordActivity({
      userId: session.user.id,
      action: "CREATE",
      module: "Doctors",
      description: `Added doctor ${user.name} (${data.specialization})`,
    });

    revalidatePath("/dashboard/admin/doctors");
    return { success: true };
  } catch (error) {
    // Compensate for the orphaned User row if the Doctor profile failed to create.
    if (createdUserId) {
      await prisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    }
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "A user with this email or license number already exists" };
    }
    throw error;
  }
}

export async function updateDoctor(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const parsed = updateDoctorSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  try {
    const doctor = await prisma.doctor.findUniqueOrThrow({ where: { id: data.id }, select: { userId: true } });

    await prisma.user.update({
      where: { id: doctor.userId },
      data: { name: data.name, email: data.email },
    });

    await prisma.doctor.update({
      where: { id: data.id },
      data: {
        departmentId: data.departmentId,
        specialization: data.specialization,
        licenseNumber: data.licenseNumber || null,
        consultationFee: data.consultationFee,
        bio: data.bio || null,
        roomNumber: data.roomNumber || null,
      },
    });

    await recordActivity({
      userId: session.user.id,
      action: "UPDATE",
      module: "Doctors",
      description: `Updated doctor ${data.name}`,
    });

    revalidatePath("/dashboard/admin/doctors");
    return { success: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "A user with this email or license number already exists" };
    }
    throw error;
  }
}

export async function toggleDoctorActive(id: string, isActive: boolean): Promise<ActionResult> {
  const session = await requireRole("ADMIN");

  const doctor = await prisma.doctor.update({
    where: { id },
    data: { isActive },
    include: { user: { select: { name: true } } },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Doctors",
    description: `${isActive ? "Activated" : "Deactivated"} doctor ${doctor.user.name}`,
  });

  revalidatePath("/dashboard/admin/doctors");
  return { success: true };
}

export async function addDoctorSchedule(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const parsed = doctorScheduleSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  if (data.startTime >= data.endTime) {
    return { success: false, error: "Start time must be before end time" };
  }

  await prisma.doctorSchedule.create({ data });

  await recordActivity({
    userId: session.user.id,
    action: "CREATE",
    module: "Doctors",
    description: `Added a schedule slot for doctor ${data.doctorId}`,
  });

  revalidatePath("/dashboard/admin/doctors");
  return { success: true };
}

export async function removeDoctorSchedule(id: string): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  await prisma.doctorSchedule.delete({ where: { id } });

  await recordActivity({
    userId: session.user.id,
    action: "DELETE",
    module: "Doctors",
    description: "Removed a doctor schedule slot",
  });

  revalidatePath("/dashboard/admin/doctors");
  return { success: true };
}
