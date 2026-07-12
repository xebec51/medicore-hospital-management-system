import { prisma } from "@/lib/prisma";

export function getOwnAccount(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatarUrl: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
}

export type OwnAccount = NonNullable<Awaited<ReturnType<typeof getOwnAccount>>>;

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
