import { prisma } from "@/lib/prisma";

export function listUsers(limit = 500) {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export type UserListItem = Awaited<ReturnType<typeof listUsers>>[number];
