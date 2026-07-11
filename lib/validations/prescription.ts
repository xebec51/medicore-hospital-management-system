import { z } from "zod";

export const prescriptionItemSchema = z.object({
  medicineId: z.string().min(1, "Select a medicine"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  dosage: z.string().min(1, "Dosage is required").max(100),
  frequency: z.string().min(1, "Frequency is required").max(100),
  duration: z.string().min(1, "Duration is required").max(100),
  instructions: z.string().max(300).optional().or(z.literal("")),
});

export const createPrescriptionSchema = z.object({
  medicalRecordId: z.string().min(1),
  notes: z.string().max(500).optional().or(z.literal("")),
  items: z.array(prescriptionItemSchema).min(1, "Add at least one medicine"),
});

export type PrescriptionItemInput = z.infer<typeof prescriptionItemSchema>;
export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>;
