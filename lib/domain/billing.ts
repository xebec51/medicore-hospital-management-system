import { Prisma } from "@/app/generated/prisma/client";

type Decimalish = Prisma.Decimal | number | string;

export interface InvoiceLineInput {
  quantity: number;
  unitPrice: Decimalish;
}

/** Sums invoice line items using Decimal arithmetic to avoid floating-point drift. */
export function calculateInvoiceTotal(items: InvoiceLineInput[]): Prisma.Decimal {
  return items.reduce(
    (total, item) => total.plus(new Prisma.Decimal(item.unitPrice).times(item.quantity)),
    new Prisma.Decimal(0),
  );
}

export function calculateLineSubtotal(quantity: number, unitPrice: Decimalish): Prisma.Decimal {
  return new Prisma.Decimal(unitPrice).times(quantity);
}

/**
 * Derives InvoiceStatus from totalAmount/paidAmount per the billing workflow:
 * fully paid -> PAID, partially paid -> PARTIALLY_PAID, otherwise UNPAID.
 * Callers are responsible for the CANCELLED transition, which is manual.
 */
export function calculateInvoiceStatus(
  totalAmount: Decimalish,
  paidAmount: Decimalish,
): "UNPAID" | "PARTIALLY_PAID" | "PAID" {
  const total = new Prisma.Decimal(totalAmount);
  const paid = new Prisma.Decimal(paidAmount);

  if (paid.greaterThanOrEqualTo(total) && total.greaterThan(0)) return "PAID";
  if (paid.greaterThan(0)) return "PARTIALLY_PAID";
  return "UNPAID";
}

export function toMoneyNumber(value: Decimalish): number {
  return new Prisma.Decimal(value).toNumber();
}
