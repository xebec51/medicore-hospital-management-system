import { prisma } from "@/lib/prisma";
import { startOfDayUTC, endOfDayUTC } from "@/lib/domain/dates";

export function listNurseQueueToday() {
  const now = new Date();
  return prisma.appointment.findMany({
    where: {
      appointmentDate: { gte: startOfDayUTC(now), lte: endOfDayUTC(now) },
      status: { in: ["CHECKED_IN", "IN_CONSULTATION"] },
    },
    select: {
      id: true,
      appointmentCode: true,
      queueNumber: true,
      status: true,
      reason: true,
      patient: { select: { id: true, name: true, medicalRecordNumber: true } },
      doctor: { select: { specialization: true, user: { select: { name: true } } } },
      vitalSigns: { select: { id: true }, take: 1 },
    },
    orderBy: { queueNumber: "asc" },
  });
}

export type NurseQueueItem = Awaited<ReturnType<typeof listNurseQueueToday>>[number];

export function listRecentVitalSigns(limit = 100) {
  return prisma.vitalSign.findMany({
    select: {
      id: true,
      bloodPressure: true,
      heartRate: true,
      temperature: true,
      weight: true,
      height: true,
      oxygenSaturation: true,
      createdAt: true,
      patient: { select: { name: true, medicalRecordNumber: true } },
      recordedByUser: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getNurseDashboardStats() {
  const now = new Date();
  const [checkedInCount, vitalsToday, notesToday] = await Promise.all([
    prisma.appointment.count({
      where: {
        appointmentDate: { gte: startOfDayUTC(now), lte: endOfDayUTC(now) },
        status: { in: ["CHECKED_IN", "IN_CONSULTATION"] },
      },
    }),
    prisma.vitalSign.count({ where: { createdAt: { gte: startOfDayUTC(now), lte: endOfDayUTC(now) } } }),
    prisma.medicalRecord.count({
      where: { nurseNotes: { not: null }, updatedAt: { gte: startOfDayUTC(now), lte: endOfDayUTC(now) } },
    }),
  ]);

  return { checkedInCount, vitalsToday, notesToday };
}

export function listDraftRecordsForNotes() {
  return prisma.medicalRecord.findMany({
    where: { status: "DRAFT" },
    select: {
      id: true,
      appointmentId: true,
      chiefComplaint: true,
      nurseNotes: true,
      patient: { select: { name: true, medicalRecordNumber: true } },
      doctor: { select: { user: { select: { name: true } } } },
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });
}
