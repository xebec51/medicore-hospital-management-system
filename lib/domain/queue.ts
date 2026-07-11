import { prisma } from "@/lib/prisma";
import { startOfDayUTC, endOfDayUTC } from "@/lib/domain/dates";

/**
 * Returns the next queue number for a doctor on a given calendar day.
 * Pass an active transaction client when calling this alongside the
 * appointment insert so the read-then-write stays race-free.
 */
export async function getNextQueueNumber(
  doctorId: string,
  appointmentDate: Date,
  client: Pick<typeof prisma, "appointment"> = prisma,
): Promise<number> {
  const result = await client.appointment.aggregate({
    where: {
      doctorId,
      appointmentDate: {
        gte: startOfDayUTC(appointmentDate),
        lte: endOfDayUTC(appointmentDate),
      },
    },
    _max: { queueNumber: true },
  });

  return (result._max.queueNumber ?? 0) + 1;
}
