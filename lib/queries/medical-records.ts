import { prisma } from "@/lib/prisma";

export function listPatientAppointmentHistory(patientId: string, excludeAppointmentId?: string) {
  return prisma.appointment.findMany({
    where: { patientId, ...(excludeAppointmentId ? { id: { not: excludeAppointmentId } } : {}) },
    select: {
      id: true,
      appointmentCode: true,
      appointmentDate: true,
      status: true,
      reason: true,
      doctor: { select: { specialization: true, user: { select: { name: true } } } },
      department: { select: { name: true } },
    },
    orderBy: { appointmentDate: "desc" },
    take: 20,
  });
}

export function getPatientForConsultation(patientId: string) {
  return prisma.patient.findUnique({
    where: { id: patientId },
    select: {
      id: true,
      name: true,
      medicalRecordNumber: true,
      gender: true,
      birthDate: true,
      bloodType: true,
      phone: true,
      allergies: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
    },
  });
}

export function getMedicalRecordByAppointment(appointmentId: string) {
  return prisma.medicalRecord.findUnique({
    where: { appointmentId },
    select: {
      id: true,
      chiefComplaint: true,
      diagnosis: true,
      doctorNotes: true,
      nurseNotes: true,
      treatmentPlan: true,
      followUpDate: true,
      status: true,
    },
  });
}

export function getVitalSignsForAppointment(appointmentId: string) {
  return prisma.vitalSign.findMany({
    where: { appointmentId },
    select: {
      id: true,
      bloodPressure: true,
      heartRate: true,
      temperature: true,
      weight: true,
      height: true,
      oxygenSaturation: true,
      notes: true,
      createdAt: true,
      recordedByUser: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getPrescriptionsForAppointment(appointmentId: string) {
  return prisma.prescription.findMany({
    where: { appointmentId },
    select: {
      id: true,
      prescriptionCode: true,
      status: true,
      notes: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          quantity: true,
          dosage: true,
          frequency: true,
          duration: true,
          instructions: true,
          medicine: { select: { name: true, unit: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getConsultationWorkspaceData(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: {
      id: true,
      appointmentCode: true,
      appointmentDate: true,
      status: true,
      reason: true,
      patientId: true,
      doctorId: true,
      patient: {
        select: {
          id: true,
          name: true,
          medicalRecordNumber: true,
          gender: true,
          birthDate: true,
          bloodType: true,
          phone: true,
          allergies: true,
          emergencyContactName: true,
          emergencyContactPhone: true,
        },
      },
      doctor: { select: { id: true, specialization: true, user: { select: { name: true, id: true } } } },
      department: { select: { name: true } },
    },
  });

  if (!appointment) return null;

  const [medicalRecord, vitalSigns, prescriptions, history] = await Promise.all([
    getMedicalRecordByAppointment(appointmentId),
    getVitalSignsForAppointment(appointmentId),
    getPrescriptionsForAppointment(appointmentId),
    listPatientAppointmentHistory(appointment.patientId, appointmentId),
  ]);

  return { appointment, medicalRecord, vitalSigns, prescriptions, history };
}

export type ConsultationWorkspaceData = NonNullable<Awaited<ReturnType<typeof getConsultationWorkspaceData>>>;
