import { prisma } from "@/lib/prisma";

export function listInvoices(limit = 300) {
  return prisma.invoice.findMany({
    select: {
      id: true,
      invoiceCode: true,
      status: true,
      totalAmount: true,
      paidAmount: true,
      dueDate: true,
      createdAt: true,
      patient: { select: { name: true, medicalRecordNumber: true } },
      _count: { select: { payments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export type InvoiceListItem = Awaited<ReturnType<typeof listInvoices>>[number];

export function listUnpaidInvoices(limit = 8) {
  return prisma.invoice.findMany({
    where: { status: { in: ["UNPAID", "PARTIALLY_PAID"] } },
    select: {
      id: true,
      invoiceCode: true,
      status: true,
      totalAmount: true,
      paidAmount: true,
      dueDate: true,
      createdAt: true,
      patient: { select: { name: true, medicalRecordNumber: true } },
      _count: { select: { payments: true } },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });
}

export function listCompletedAppointmentsWithoutInvoice() {
  return prisma.appointment.findMany({
    where: { status: "COMPLETED", invoices: { none: {} } },
    select: {
      id: true,
      appointmentCode: true,
      appointmentDate: true,
      patient: { select: { name: true, medicalRecordNumber: true } },
      doctor: { select: { specialization: true, user: { select: { name: true } } } },
    },
    orderBy: { appointmentDate: "desc" },
    take: 100,
  });
}

export type UninvoicedAppointmentItem = Awaited<ReturnType<typeof listCompletedAppointmentsWithoutInvoice>>[number];

export function getInvoiceDetail(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    select: {
      id: true,
      invoiceCode: true,
      status: true,
      totalAmount: true,
      paidAmount: true,
      dueDate: true,
      notes: true,
      createdAt: true,
      patient: { select: { name: true, medicalRecordNumber: true, phone: true } },
      appointment: { select: { appointmentCode: true, appointmentDate: true } },
      items: { select: { id: true, description: true, quantity: true, unitPrice: true, subtotal: true } },
      payments: {
        select: {
          id: true,
          paymentCode: true,
          amount: true,
          method: true,
          status: true,
          paidAt: true,
          referenceNumber: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export type InvoiceDetail = NonNullable<Awaited<ReturnType<typeof getInvoiceDetail>>>;

export function listPatientInvoices(patientId: string) {
  return prisma.invoice.findMany({
    where: { patientId },
    select: {
      id: true,
      invoiceCode: true,
      status: true,
      totalAmount: true,
      paidAmount: true,
      dueDate: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
