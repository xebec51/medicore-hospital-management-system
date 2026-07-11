import { prisma } from "@/lib/prisma";
import { startOfDayUTC, endOfDayUTC } from "@/lib/domain/dates";

const appointmentSelect = {
  id: true,
  appointmentCode: true,
  appointmentDate: true,
  queueNumber: true,
  status: true,
  reason: true,
  cancelledReason: true,
  checkedInAt: true,
  consultationStartedAt: true,
  completedAt: true,
  patient: { select: { id: true, name: true, medicalRecordNumber: true, phone: true } },
  doctor: { select: { id: true, specialization: true, user: { select: { name: true } } } },
  department: { select: { id: true, name: true } },
} as const;

export function listAppointments(limit = 300) {
  return prisma.appointment.findMany({
    select: appointmentSelect,
    orderBy: { appointmentDate: "desc" },
    take: limit,
  });
}

export type AppointmentListItem = Awaited<ReturnType<typeof listAppointments>>[number];

export function listTodayAppointments() {
  const now = new Date();
  return prisma.appointment.findMany({
    where: { appointmentDate: { gte: startOfDayUTC(now), lte: endOfDayUTC(now) } },
    select: appointmentSelect,
    orderBy: [{ doctorId: "asc" }, { queueNumber: "asc" }],
  });
}

export function listPatientsForSelect() {
  return prisma.patient.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true, medicalRecordNumber: true },
    orderBy: { name: "asc" },
  });
}

export function listDoctorsForSelect() {
  return prisma.doctor.findMany({
    where: { isActive: true },
    select: {
      id: true,
      specialization: true,
      user: { select: { name: true } },
      department: { select: { name: true } },
    },
    orderBy: { user: { name: "asc" } },
  });
}

export async function listDoctorAvailabilityToday() {
  const now = new Date();
  const todayDow = now.getUTCDay();

  const [doctors, counts] = await Promise.all([
    prisma.doctor.findMany({
      where: { isActive: true },
      select: {
        id: true,
        specialization: true,
        roomNumber: true,
        user: { select: { name: true } },
        department: { select: { name: true } },
        schedules: {
          where: { dayOfWeek: todayDow, isActive: true },
          select: { startTime: true, endTime: true, quota: true },
        },
      },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.appointment.groupBy({
      by: ["doctorId"],
      where: { appointmentDate: { gte: startOfDayUTC(now), lte: endOfDayUTC(now) }, status: { not: "CANCELLED" } },
      _count: { _all: true },
    }),
  ]);

  const countByDoctor = new Map(counts.map((c) => [c.doctorId, c._count._all]));

  return doctors.map((doctor) => ({
    ...doctor,
    todaySchedule: doctor.schedules[0] ?? null,
    bookedToday: countByDoctor.get(doctor.id) ?? 0,
  }));
}

export type DoctorAvailabilityItem = Awaited<ReturnType<typeof listDoctorAvailabilityToday>>[number];
