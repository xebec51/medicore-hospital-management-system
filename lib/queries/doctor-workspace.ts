import { prisma } from "@/lib/prisma";
import { startOfDayUTC, endOfDayUTC } from "@/lib/domain/dates";

const doctorAppointmentSelect = {
  id: true,
  appointmentCode: true,
  appointmentDate: true,
  queueNumber: true,
  status: true,
  reason: true,
  patient: { select: { id: true, name: true, medicalRecordNumber: true } },
} as const;

export function listDoctorAppointmentsToday(doctorId: string) {
  const now = new Date();
  return prisma.appointment.findMany({
    where: { doctorId, appointmentDate: { gte: startOfDayUTC(now), lte: endOfDayUTC(now) } },
    select: doctorAppointmentSelect,
    orderBy: { queueNumber: "asc" },
  });
}

export function listDoctorAppointments(doctorId: string, limit = 200) {
  return prisma.appointment.findMany({
    where: { doctorId },
    select: doctorAppointmentSelect,
    orderBy: { appointmentDate: "desc" },
    take: limit,
  });
}

export type DoctorAppointmentItem = Awaited<ReturnType<typeof listDoctorAppointments>>[number];

export async function listDoctorPatients(doctorId: string) {
  const appointments = await prisma.appointment.findMany({
    where: { doctorId },
    select: {
      appointmentDate: true,
      patient: { select: { id: true, name: true, medicalRecordNumber: true, phone: true, bloodType: true } },
    },
    orderBy: { appointmentDate: "desc" },
  });

  const byPatient = new Map<string, { patient: (typeof appointments)[number]["patient"]; lastVisit: Date; visitCount: number }>();
  for (const appt of appointments) {
    const existing = byPatient.get(appt.patient.id);
    if (existing) {
      existing.visitCount += 1;
    } else {
      byPatient.set(appt.patient.id, { patient: appt.patient, lastVisit: appt.appointmentDate, visitCount: 1 });
    }
  }

  return Array.from(byPatient.values());
}

export type DoctorPatientItem = Awaited<ReturnType<typeof listDoctorPatients>>[number];

export function listDoctorMedicalRecords(doctorId: string) {
  return prisma.medicalRecord.findMany({
    where: { doctorId },
    select: {
      id: true,
      appointmentId: true,
      chiefComplaint: true,
      diagnosis: true,
      status: true,
      createdAt: true,
      patient: { select: { name: true, medicalRecordNumber: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export type DoctorMedicalRecordItem = Awaited<ReturnType<typeof listDoctorMedicalRecords>>[number];

export function listDoctorPrescriptions(doctorId: string) {
  return prisma.prescription.findMany({
    where: { doctorId },
    select: {
      id: true,
      prescriptionCode: true,
      status: true,
      createdAt: true,
      patient: { select: { name: true, medicalRecordNumber: true } },
      items: { select: { id: true, quantity: true, medicine: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export type DoctorPrescriptionItem = Awaited<ReturnType<typeof listDoctorPrescriptions>>[number];

export async function getDoctorDashboardStats(doctorId: string) {
  const [todayAppointments, recentPatients] = await Promise.all([
    listDoctorAppointmentsToday(doctorId),
    // Only .length is used by the dashboard (a capped "recent patients" count),
    // so the select is trimmed to the one field that's actually read.
    prisma.appointment.findMany({
      where: { doctorId, status: "COMPLETED" },
      select: { id: true },
      orderBy: { completedAt: "desc" },
      take: 5,
    }),
  ]);

  const completed = todayAppointments.filter((a) => a.status === "COMPLETED").length;
  const pending = todayAppointments.filter((a) => a.status === "CHECKED_IN" || a.status === "IN_CONSULTATION").length;

  return {
    todayAppointments,
    completedToday: completed,
    pendingToday: pending,
    recentPatients,
  };
}
