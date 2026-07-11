import { prisma } from "@/lib/prisma";
import { startOfDayUTC, endOfDayUTC } from "@/lib/domain/dates";
import { toMoneyNumber } from "@/lib/domain/billing";

export async function getAdminOverviewStats() {
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const [totalPatients, appointmentsToday, activeDoctors, revenueAgg, pendingPrescriptions, lowStockMedicines] =
    await Promise.all([
      prisma.patient.count({ where: { status: "ACTIVE" } }),
      prisma.appointment.count({ where: { appointmentDate: { gte: startOfDayUTC(now), lte: endOfDayUTC(now) } } }),
      prisma.doctor.count({ where: { isActive: true } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
      prisma.prescription.count({ where: { status: "PENDING" } }),
      prisma.medicine.count({ where: { status: "LOW_STOCK" } }),
    ]);

  const revenueThisMonth = toMoneyNumber(revenueAgg._sum.amount ?? 0);

  return { totalPatients, appointmentsToday, activeDoctors, revenueThisMonth, pendingPrescriptions, lowStockMedicines };
}

export async function getAppointmentStatusDistribution(from: Date, to: Date) {
  const grouped = await prisma.appointment.groupBy({
    by: ["status"],
    where: { appointmentDate: { gte: from, lte: to } },
    _count: { _all: true },
  });
  return grouped.map((g) => ({ status: g.status, count: g._count._all }));
}

export async function getDepartmentWorkload(from: Date, to: Date) {
  const departments = await prisma.department.findMany({
    where: { isActive: true },
    select: {
      name: true,
      _count: { select: { appointments: { where: { appointmentDate: { gte: from, lte: to } } } } },
    },
  });
  return departments
    .map((d) => ({ department: d.name, appointments: d._count.appointments }))
    .sort((a, b) => b.appointments - a.appointments);
}

export async function getRevenueTrend(from: Date, to: Date) {
  const payments = await prisma.payment.findMany({
    where: { status: "COMPLETED", createdAt: { gte: from, lte: to } },
    select: { amount: true, createdAt: true },
  });

  const byDay = new Map<string, number>();
  for (const payment of payments) {
    const key = payment.createdAt.toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + toMoneyNumber(payment.amount));
  }

  return Array.from(byDay.entries())
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
