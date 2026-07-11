import { prisma } from "@/lib/prisma";

export function listActiveMedicinesForSelect() {
  return prisma.medicine.findMany({
    where: { status: { in: ["ACTIVE", "LOW_STOCK"] } },
    select: { id: true, name: true, unit: true, stock: true, price: true },
    orderBy: { name: "asc" },
  });
}
