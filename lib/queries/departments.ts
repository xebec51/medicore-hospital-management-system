import { prisma } from "@/lib/prisma";

export function listDepartments() {
  return prisma.department.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      location: true,
      isActive: true,
      _count: { select: { doctors: true, appointments: true } },
    },
    orderBy: { name: "asc" },
  });
}

export type DepartmentListItem = Awaited<ReturnType<typeof listDepartments>>[number];

export function listActiveDepartments() {
  return prisma.department.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
