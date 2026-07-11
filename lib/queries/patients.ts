import { prisma } from "@/lib/prisma";

export function listPatients() {
  return prisma.patient.findMany({
    select: {
      id: true,
      medicalRecordNumber: true,
      name: true,
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
      createdAt: true,
      _count: { select: { appointments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export type PatientListItem = Awaited<ReturnType<typeof listPatients>>[number];
