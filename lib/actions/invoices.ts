"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/domain/activity-log";
import { generateInvoiceCode } from "@/lib/domain/codes";
import { calculateInvoiceTotal, toMoneyNumber } from "@/lib/domain/billing";
import { addInvoiceItemSchema, cancelInvoiceSchema, generateInvoiceSchema } from "@/lib/validations/invoice";

type ActionResult = { success: true } | { success: false; error: string };

const BILLING_PATHS = [
  "/dashboard/cashier/invoices",
  "/dashboard/cashier/payments",
  "/dashboard/cashier/reports",
  "/dashboard/cashier",
  "/dashboard/patient/invoices",
];

function revalidateBillingPaths() {
  for (const path of BILLING_PATHS) revalidatePath(path);
}

export async function generateInvoiceFromAppointment(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "CASHIER");
  const parsed = generateInvoiceSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const existingInvoice = await prisma.invoice.findFirst({ where: { appointmentId: data.appointmentId } });
  if (existingInvoice) return { success: false, error: "An invoice already exists for this appointment" };

  const appointment = await prisma.appointment.findUnique({
    where: { id: data.appointmentId },
    select: {
      patientId: true,
      status: true,
      doctor: { select: { user: { select: { name: true } }, consultationFee: true } },
      prescriptions: {
        where: { status: "DISPENSED" },
        select: { items: { select: { quantity: true, medicine: { select: { name: true, price: true } } } } },
      },
    },
  });
  if (!appointment) return { success: false, error: "Appointment not found" };
  if (appointment.status !== "COMPLETED") return { success: false, error: "The appointment must be completed first" };

  const lineItems = [
    {
      description: `Consultation — ${appointment.doctor.user.name}`,
      quantity: 1,
      unitPrice: toMoneyNumber(appointment.doctor.consultationFee),
    },
    ...appointment.prescriptions.flatMap((rx) =>
      rx.items.map((item) => ({
        description: `Medicine — ${item.medicine.name}`,
        quantity: item.quantity,
        unitPrice: toMoneyNumber(item.medicine.price),
      })),
    ),
  ];

  const totalAmount = calculateInvoiceTotal(lineItems);
  const dueDate = data.dueInDays != null ? new Date(Date.now() + data.dueInDays * 24 * 60 * 60 * 1000) : null;

  const invoice = await prisma.invoice.create({
    data: {
      invoiceCode: generateInvoiceCode(),
      patientId: appointment.patientId,
      appointmentId: data.appointmentId,
      totalAmount,
      dueDate,
      items: {
        create: lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.unitPrice * item.quantity,
        })),
      },
    },
  });

  await recordActivity({
    userId: session.user.id,
    action: "CREATE",
    module: "Billing",
    description: `Generated invoice ${invoice.invoiceCode}`,
  });

  revalidateBillingPaths();
  return { success: true };
}

export async function addInvoiceItem(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "CASHIER");
  const parsed = addInvoiceItemSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const invoice = await prisma.invoice.findUnique({ where: { id: data.invoiceId }, select: { status: true } });
  if (!invoice) return { success: false, error: "Invoice not found" };
  if (invoice.status === "PAID" || invoice.status === "CANCELLED") {
    return { success: false, error: "This invoice can no longer be modified" };
  }

  const subtotal = data.unitPrice * data.quantity;
  await prisma.invoiceItem.create({
    data: { invoiceId: data.invoiceId, description: data.description, quantity: data.quantity, unitPrice: data.unitPrice, subtotal },
  });
  await prisma.invoice.update({
    where: { id: data.invoiceId },
    data: { totalAmount: { increment: subtotal } },
  });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Billing",
    description: `Added item "${data.description}" to an invoice`,
  });

  revalidateBillingPaths();
  return { success: true };
}

export async function cancelInvoice(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "CASHIER");
  const parsed = cancelInvoiceSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const invoice = await prisma.invoice.findUnique({ where: { id: parsed.data.id }, select: { status: true, invoiceCode: true } });
  if (!invoice) return { success: false, error: "Invoice not found" };
  if (invoice.status === "PAID") return { success: false, error: "A fully paid invoice cannot be cancelled" };

  await prisma.invoice.update({ where: { id: parsed.data.id }, data: { status: "CANCELLED" } });

  await recordActivity({
    userId: session.user.id,
    action: "UPDATE",
    module: "Billing",
    description: `Cancelled invoice ${invoice.invoiceCode}`,
  });

  revalidateBillingPaths();
  return { success: true };
}
