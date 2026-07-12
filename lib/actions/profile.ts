"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { ROLES } from "@/lib/constants/roles";
import { recordActivity } from "@/lib/domain/activity-log";
import { resolvePatientIdByUserId } from "@/lib/queries/patient-portal";
import { resolveDoctorIdByUserId } from "@/lib/queries/doctors";
import {
  changePasswordSchema,
  updateAccountSchema,
  updateDoctorBioSchema,
  updatePatientSelfSchema,
} from "@/lib/validations/profile";

type ActionResult = { success: true } | { success: false; error: string };

export async function updateOwnAccount(input: unknown): Promise<ActionResult> {
  const session = await requireRole(...ROLES);
  const parsed = updateAccountSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      avatarUrl: parsed.data.avatarUrl || null,
    },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Profile",
    description: "Updated account details",
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function changeOwnPassword(input: unknown): Promise<ActionResult> {
  const session = await requireRole(...ROLES);
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { password: true } });
  if (!user) return { success: false, error: "Account not found" };

  const currentMatches = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!currentMatches) return { success: false, error: "Current password is incorrect" };

  const nextPasswordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({ where: { id: session.user.id }, data: { password: nextPasswordHash } });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Profile",
    description: "Changed account password",
  });

  return { success: true };
}

export async function updateOwnPatientDetails(input: unknown): Promise<ActionResult> {
  const session = await requireRole("PATIENT");
  const parsed = updatePatientSelfSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const patientId = await resolvePatientIdByUserId(session.user.id);
  if (!patientId) return { success: false, error: "Patient record not found" };

  await prisma.patient.update({
    where: { id: patientId },
    data: {
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      allergies: parsed.data.allergies || null,
      emergencyContactName: parsed.data.emergencyContactName || null,
      emergencyContactPhone: parsed.data.emergencyContactPhone || null,
    },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Profile",
    description: "Updated patient contact details",
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function updateOwnDoctorBio(input: unknown): Promise<ActionResult> {
  const session = await requireRole("DOCTOR");
  const parsed = updateDoctorBioSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const doctorId = await resolveDoctorIdByUserId(session.user.id);
  if (!doctorId) return { success: false, error: "Doctor record not found" };

  await prisma.doctor.update({
    where: { id: doctorId },
    data: { bio: parsed.data.bio || null },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Profile",
    description: "Updated doctor bio",
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}
