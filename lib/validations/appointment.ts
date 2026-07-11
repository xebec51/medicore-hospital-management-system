import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  doctorId: z.string().min(1, "Select a doctor"),
  date: z.string().min(1, "Select a date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Select a time"),
  reason: z.string().max(300).optional().or(z.literal("")),
});

export const rescheduleAppointmentSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1, "Select a date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Select a time"),
});

export const cancelAppointmentSchema = z.object({
  id: z.string().min(1),
  cancelledReason: z.string().min(3, "Provide a brief reason").max(300),
});

export const appointmentIdSchema = z.object({ id: z.string().min(1) });

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>;
export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;
