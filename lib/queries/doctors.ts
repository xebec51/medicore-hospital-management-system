import { prisma } from "@/lib/prisma";

export async function resolveDoctorIdByUserId(userId: string): Promise<string | null> {
  const doctor = await prisma.doctor.findUnique({ where: { userId }, select: { id: true } });
  return doctor?.id ?? null;
}

export async function getDoctorProfile(doctorId: string) {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: {
      id: true,
      specialization: true,
      licenseNumber: true,
      consultationFee: true,
      roomNumber: true,
      bio: true,
      isActive: true,
      department: { select: { name: true } },
      schedules: {
        where: { isActive: true },
        select: { dayOfWeek: true, startTime: true, endTime: true, quota: true },
        orderBy: { dayOfWeek: "asc" },
      },
    },
  });
  if (!doctor) return null;
  // Prisma's Decimal is a class instance, not a plain object, so it can't cross
  // the Server -> Client Component boundary as a prop without a dev warning.
  return { ...doctor, consultationFee: doctor.consultationFee.toString() };
}

export type DoctorProfile = NonNullable<Awaited<ReturnType<typeof getDoctorProfile>>>;

export function listDoctors(limit = 500) {
  return prisma.doctor.findMany({
    select: {
      id: true,
      specialization: true,
      licenseNumber: true,
      consultationFee: true,
      roomNumber: true,
      isActive: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
      department: { select: { id: true, name: true } },
      schedules: {
        select: { id: true, dayOfWeek: true, startTime: true, endTime: true, quota: true, isActive: true },
        orderBy: { dayOfWeek: "asc" },
      },
      _count: { select: { appointments: true } },
    },
    orderBy: { user: { name: "asc" } },
    take: limit,
  });
}

export type DoctorListItem = Awaited<ReturnType<typeof listDoctors>>[number];
