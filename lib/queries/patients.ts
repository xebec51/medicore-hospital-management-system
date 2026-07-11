import { prisma } from "@/lib/prisma";

export function listPatients(limit = 500) {
  return prisma.patient.findMany({
    take: limit,
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
