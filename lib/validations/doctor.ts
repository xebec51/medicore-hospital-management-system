import { z } from "zod";

export const createDoctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  departmentId: z.string().min(1, "Select a department"),
  specialization: z.string().min(2, "Specialization is required").max(150),
  licenseNumber: z.string().max(50).optional().or(z.literal("")),
  consultationFee: z.coerce.number().min(0, "Consultation fee must be zero or more"),
  bio: z.string().max(1000).optional().or(z.literal("")),
  roomNumber: z.string().max(30).optional().or(z.literal("")),
});

export const updateDoctorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Enter a valid email address"),
  departmentId: z.string().min(1, "Select a department"),
  specialization: z.string().min(2, "Specialization is required").max(150),
  licenseNumber: z.string().max(50).optional().or(z.literal("")),
  consultationFee: z.coerce.number().min(0, "Consultation fee must be zero or more"),
  bio: z.string().max(1000).optional().or(z.literal("")),
  roomNumber: z.string().max(30).optional().or(z.literal("")),
});

export const doctorScheduleSchema = z.object({
  doctorId: z.string().min(1),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:mm format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:mm format"),
  quota: z.coerce.number().int().min(1, "Quota must be at least 1"),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
export type DoctorScheduleInput = z.infer<typeof doctorScheduleSchema>;
