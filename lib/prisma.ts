import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

declare global {
  var __medicorePrisma: PrismaClient | undefined;
}

function createPrismaClient() {
  // Vercel can run many concurrent serverless instances, each with its own pool.
  // A small max keeps the total connections opened against Neon bounded instead
  // of every instance defaulting to pg's own max of 10.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 5 });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.__medicorePrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__medicorePrisma = prisma;
}
