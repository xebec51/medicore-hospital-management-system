export const ROLES = [
  "ADMIN",
  "DOCTOR",
  "NURSE",
  "RECEPTIONIST",
  "PHARMACIST",
  "CASHIER",
  "PATIENT",
] as const;

export type AppRole = (typeof ROLES)[number];

export const roleDashboardPath: Record<AppRole, string> = {
  ADMIN: "/dashboard/admin",
  DOCTOR: "/dashboard/doctor",
  NURSE: "/dashboard/nurse",
  RECEPTIONIST: "/dashboard/receptionist",
  PHARMACIST: "/dashboard/pharmacist",
  CASHIER: "/dashboard/cashier",
  PATIENT: "/dashboard/patient",
};
