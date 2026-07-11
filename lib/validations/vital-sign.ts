import { z } from "zod";

export const createVitalSignSchema = z.object({
  appointmentId: z.string().min(1),
  bloodPressure: z.string().max(20).optional().or(z.literal("")),
  heartRate: z.coerce.number().int().min(0).max(300).optional(),
  temperature: z.coerce.number().min(30).max(45).optional(),
  weight: z.coerce.number().min(0).max(500).optional(),
  height: z.coerce.number().min(0).max(250).optional(),
  oxygenSaturation: z.coerce.number().int().min(0).max(100).optional(),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type CreateVitalSignInput = z.infer<typeof createVitalSignSchema>;
