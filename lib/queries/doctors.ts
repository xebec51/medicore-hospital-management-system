import { prisma } from "@/lib/prisma";

export function listDoctors() {
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
  });
}

export type DoctorListItem = Awaited<ReturnType<typeof listDoctors>>[number];
