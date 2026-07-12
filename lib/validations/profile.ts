import { z } from "zod";

export const updateAccountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  phone: z.string().max(30).optional().or(z.literal("")),
  avatarUrl: z.string().url("Enter a valid image URL").max(2048).optional().or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updatePatientSelfSchema = z.object({
  phone: z.string().max(30).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  address: z.string().max(300).optional().or(z.literal("")),
  allergies: z.string().max(500).optional().or(z.literal("")),
  emergencyContactName: z.string().max(120).optional().or(z.literal("")),
  emergencyContactPhone: z.string().max(30).optional().or(z.literal("")),
});

export const updateDoctorBioSchema = z.object({
  bio: z.string().max(1000).optional().or(z.literal("")),
});

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdatePatientSelfInput = z.infer<typeof updatePatientSelfSchema>;
export type UpdateDoctorBioInput = z.infer<typeof updateDoctorBioSchema>;
