import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

declare global {
  var __medicorePrisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.__medicorePrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__medicorePrisma = prisma;
}
