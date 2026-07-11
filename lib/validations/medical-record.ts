import { z } from "zod";

export const medicalRecordFormSchema = z.object({
  appointmentId: z.string().min(1),
  chiefComplaint: z.string().min(3, "Chief complaint is required").max(500),
  diagnosis: z.string().max(500).optional().or(z.literal("")),
  doctorNotes: z.string().max(2000).optional().or(z.literal("")),
  treatmentPlan: z.string().max(1000).optional().or(z.literal("")),
  followUpDate: z.string().optional().or(z.literal("")),
});

export const nurseNotesSchema = z.object({
  appointmentId: z.string().min(1),
  nurseNotes: z.string().max(2000),
});

export type MedicalRecordFormInput = z.infer<typeof medicalRecordFormSchema>;
