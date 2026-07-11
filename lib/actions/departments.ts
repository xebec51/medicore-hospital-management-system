"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/domain/activity-log";
import { createDepartmentSchema, slugify, updateDepartmentSchema } from "@/lib/validations/department";

type ActionResult = { success: true } | { success: false; error: string };

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function createDepartment(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const parsed = createDepartmentSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const department = await prisma.department.create({
      data: {
        name: parsed.data.name,
        slug: slugify(parsed.data.name),
        description: parsed.data.description || null,
        location: parsed.data.location || null,
      },
    });

    await recordActivity({
      userId: session.user.id,
      action: "CREATE",
      module: "Departments",
      description: `Created department ${department.name}`,
    });

    revalidatePath("/dashboard/admin/departments");
    return { success: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) return { success: false, error: "A department with this name already exists" };
    throw error;
  }
}

export async function updateDepartment(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const parsed = updateDepartmentSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const department = await prisma.department.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        slug: slugify(parsed.data.name),
        description: parsed.data.description || null,
        location: parsed.data.location || null,
      },
    });

    await recordActivity({
      userId: session.user.id,
      action: "UPDATE",
      module: "Departments",
      description: `Updated department ${department.name}`,
    });

    revalidatePath("/dashboard/admin/departments");
    return { success: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) return { success: false, error: "A department with this name already exists" };
    throw error;
  }
}

export async function toggleDepartmentActive(id: string, isActive: boolean): Promise<ActionResult> {
  const session = await requireRole("ADMIN");

  const department = await prisma.department.update({ where: { id }, data: { isActive } });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Departments",
    description: `${isActive ? "Activated" : "Deactivated"} department ${department.name}`,
  });

  revalidatePath("/dashboard/admin/departments");
  return { success: true };
}
