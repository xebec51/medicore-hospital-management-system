import { z } from "zod";

const BLOOD_TYPES = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
  "UNKNOWN",
] as const;

export const createPatientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  birthDate: z.string().min(1, "Birth date is required"),
  phone: z.string().max(30).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  address: z.string().max(300).optional().or(z.literal("")),
  bloodType: z.enum(BLOOD_TYPES),
  allergies: z.string().max(500).optional().or(z.literal("")),
  emergencyContactName: z.string().max(120).optional().or(z.literal("")),
  emergencyContactPhone: z.string().max(30).optional().or(z.literal("")),
});

export const updatePatientSchema = createPatientSchema.extend({
  id: z.string().min(1),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
