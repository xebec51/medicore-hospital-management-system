"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/domain/activity-log";
import { generatePaymentCode } from "@/lib/domain/codes";
import { calculateInvoiceStatus, toMoneyNumber } from "@/lib/domain/billing";
import { processPaymentSchema } from "@/lib/validations/invoice";

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

export async function processPayment(input: unknown): Promise<ActionResult> {
  const session = await requireRole("ADMIN", "CASHIER");
  const parsed = processPaymentSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
    select: { status: true, totalAmount: true, paidAmount: true, invoiceCode: true },
  });
  if (!invoice) return { success: false, error: "Invoice not found" };
  if (invoice.status === "PAID") return { success: false, error: "This invoice is already fully paid" };
  if (invoice.status === "CANCELLED") return { success: false, error: "This invoice has been cancelled" };

  const totalAmount = toMoneyNumber(invoice.totalAmount);
  const currentPaid = toMoneyNumber(invoice.paidAmount);
  const newPaidAmount = currentPaid + data.amount;

  if (newPaidAmount - totalAmount > 0.01) {
    return { success: false, error: "Payment amount exceeds the remaining balance" };
  }

  const newStatus = calculateInvoiceStatus(totalAmount, newPaidAmount);

  try {
    await prisma.$transaction(
      async (tx) => {
        await tx.payment.create({
          data: {
            paymentCode: generatePaymentCode(),
            invoiceId: data.invoiceId,
            amount: data.amount,
            method: data.method,
            status: "COMPLETED",
            paidAt: new Date(),
            referenceNumber: data.referenceNumber || null,
            processedBy: session.user.id,
            notes: data.notes || null,
          },
        });
        await tx.invoice.update({
          where: { id: data.invoiceId },
          data: { paidAmount: newPaidAmount, status: newStatus },
        });
      },
      { timeout: 15000, maxWait: 10000 },
    );
  } catch {
    return { success: false, error: "Could not process payment. Please try again." };
  }

  await recordActivity({
    userId: session.user.id,
    action: "CREATE",
    module: "Billing",
    description: `Processed ${data.method.toLowerCase()} payment for invoice ${invoice.invoiceCode}`,
  });

  revalidateBillingPaths();
  return { success: true };
}
