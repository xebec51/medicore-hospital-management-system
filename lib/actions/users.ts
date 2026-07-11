"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/domain/activity-log";
import { createUserSchema, updateUserSchema, updateUserStatusSchema } from "@/lib/validations/user";

type ActionResult = { success: true } | { success: false; error: string };

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function createUser(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const password = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password,
        role: parsed.data.role,
        phone: parsed.data.phone || null,
      },
    });

    await recordActivity({
      userId: session.user.id,
      action: "CREATE",
      module: "Users",
      description: `Created user ${user.name} (${user.role})`,
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) return { success: false, error: "A user with this email already exists" };
    throw error;
  }
}

export async function updateUser(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const user = await prisma.user.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role,
        phone: parsed.data.phone || null,
      },
    });

    await recordActivity({
      userId: session.user.id,
      action: "UPDATE",
      module: "Users",
      description: `Updated user ${user.name}`,
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) return { success: false, error: "A user with this email already exists" };
    throw error;
  }
}

export async function updateUserStatus(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const parsed = updateUserStatusSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  if (parsed.data.id === session.user.id) {
    return { success: false, error: "You cannot change your own account status" };
  }

  const user = await prisma.user.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Users",
    description: `Set ${user.name}'s status to ${user.status}`,
  });

  revalidatePath("/dashboard/admin/users");
  return { success: true };
}
