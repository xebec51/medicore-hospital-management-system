import { prisma } from "@/lib/prisma";

export async function resolvePatientIdByUserId(userId: string): Promise<string | null> {
  const patient = await prisma.patient.findUnique({ where: { userId }, select: { id: true } });
  return patient?.id ?? null;
}

export function getPatientProfile(patientId: string) {
  return prisma.patient.findUnique({
    where: { id: patientId },
    select: {
      id: true,
      name: true,
      medicalRecordNumber: true,
      gender: true,
      birthDate: true,
      phone: true,
      email: true,
      address: true,
      bloodType: true,
      allergies: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      status: true,
    },
  });
}

export type PatientProfile = NonNullable<Awaited<ReturnType<typeof getPatientProfile>>>;

export function listOwnAppointments(patientId: string) {
  return prisma.appointment.findMany({
    where: { patientId },
    select: {
      id: true,
      appointmentCode: true,
      appointmentDate: true,
      status: true,
      reason: true,
      queueNumber: true,
      doctor: { select: { specialization: true, user: { select: { name: true } } } },
      department: { select: { name: true } },
    },
    orderBy: { appointmentDate: "desc" },
  });
}

export type OwnAppointmentItem = Awaited<ReturnType<typeof listOwnAppointments>>[number];

export function getNextUpcomingAppointment(patientId: string) {
  return prisma.appointment.findFirst({
    where: { patientId, status: "SCHEDULED", appointmentDate: { gte: new Date() } },
    select: {
      id: true,
      appointmentCode: true,
      appointmentDate: true,
      status: true,
      reason: true,
      queueNumber: true,
      doctor: { select: { specialization: true, user: { select: { name: true } } } },
      department: { select: { name: true } },
    },
    orderBy: { appointmentDate: "asc" },
  });
}

export function listOwnMedicalHistory(patientId: string) {
  return prisma.medicalRecord.findMany({
    where: { patientId, status: "FINALIZED" },
    select: {
      id: true,
      chiefComplaint: true,
      diagnosis: true,
      treatmentPlan: true,
      followUpDate: true,
      createdAt: true,
      doctor: { select: { specialization: true, user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function listOwnPrescriptions(patientId: string) {
  return prisma.prescription.findMany({
    where: { patientId },
    select: {
      id: true,
      prescriptionCode: true,
      status: true,
      createdAt: true,
      doctor: { select: { user: { select: { name: true } } } },
      items: { select: { id: true, quantity: true, dosage: true, frequency: true, duration: true, medicine: { select: { name: true, unit: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export type OwnPrescriptionItem = Awaited<ReturnType<typeof listOwnPrescriptions>>[number];

export async function getPatientDashboardStats(patientId: string) {
  const [medicalRecordsCount, activePrescriptionsCount, unpaidInvoicesCount, upcomingAppointment] = await Promise.all([
    prisma.medicalRecord.count({ where: { patientId, status: "FINALIZED" } }),
    prisma.prescription.count({ where: { patientId, status: { in: ["PENDING", "PREPARED"] } } }),
    prisma.invoice.count({ where: { patientId, status: { in: ["UNPAID", "PARTIALLY_PAID"] } } }),
    getNextUpcomingAppointment(patientId),
  ]);

  return { medicalRecordsCount, activePrescriptionsCount, unpaidInvoicesCount, upcomingAppointment };
}
