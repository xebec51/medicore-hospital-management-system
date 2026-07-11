import { prisma } from "@/lib/prisma";
import { startOfDayUTC, endOfDayUTC } from "@/lib/domain/dates";
import { toMoneyNumber } from "@/lib/domain/billing";

export function listPayments(limit = 300) {
  return prisma.payment.findMany({
    select: {
      id: true,
      paymentCode: true,
      amount: true,
      method: true,
      status: true,
      paidAt: true,
      createdAt: true,
      invoice: { select: { invoiceCode: true, patient: { select: { name: true, medicalRecordNumber: true } } } },
      processedByUser: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export type PaymentListItem = Awaited<ReturnType<typeof listPayments>>[number];

export async function getCashierDashboardStats() {
  const now = new Date();
  const [unpaidCount, paidToday, todayPaymentTotals] = await Promise.all([
    prisma.invoice.count({ where: { status: { in: ["UNPAID", "PARTIALLY_PAID"] } } }),
    prisma.invoice.count({
      where: { status: "PAID", updatedAt: { gte: startOfDayUTC(now), lte: endOfDayUTC(now) } },
    }),
    prisma.payment.groupBy({
      by: ["method"],
      where: { status: "COMPLETED", createdAt: { gte: startOfDayUTC(now), lte: endOfDayUTC(now) } },
      _sum: { amount: true },
    }),
  ]);

  const methodTotals: Record<string, number> = { CASH: 0, BANK_TRANSFER: 0, E_WALLET: 0, INSURANCE: 0 };
  let dailyRevenue = 0;
  for (const group of todayPaymentTotals) {
    const amount = toMoneyNumber(group._sum.amount ?? 0);
    methodTotals[group.method] = amount;
    dailyRevenue += amount;
  }

  return { unpaidCount, paidToday, dailyRevenue, methodTotals };
}
