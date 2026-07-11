import { prisma } from "@/lib/prisma";

export interface RecordActivityInput {
  userId?: string | null;
  action: string;
  module: string;
  description: string;
  ipAddress?: string | null;
}

export function recordActivity(input: RecordActivityInput) {
  return prisma.activityLog.create({
    data: {
      userId: input.userId ?? null,
      action: input.action,
      module: input.module,
      description: input.description,
      ipAddress: input.ipAddress ?? null,
    },
  });
}
