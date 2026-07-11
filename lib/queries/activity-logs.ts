import { prisma } from "@/lib/prisma";

export function listActivityLogs(limit = 100) {
  return prisma.activityLog.findMany({
    select: {
      id: true,
      action: true,
      module: true,
      description: true,
      createdAt: true,
      user: { select: { name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export type ActivityLogItem = Awaited<ReturnType<typeof listActivityLogs>>[number];
