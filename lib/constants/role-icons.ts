import { ClipboardList, HeartPulse, Pill, ShieldCheck, Stethoscope, UserRound, Wallet, type LucideIcon } from "lucide-react";
import type { AppRole } from "./roles";

export const roleIcons: Record<AppRole, LucideIcon> = {
  ADMIN: ShieldCheck,
  DOCTOR: Stethoscope,
  NURSE: HeartPulse,
  RECEPTIONIST: ClipboardList,
  PHARMACIST: Pill,
  CASHIER: Wallet,
  PATIENT: UserRound,
};

export const demoAccountEmails: Record<AppRole, string> = {
  ADMIN: "admin@medicore.demo",
  DOCTOR: "doctor@medicore.demo",
  NURSE: "nurse@medicore.demo",
  RECEPTIONIST: "receptionist@medicore.demo",
  PHARMACIST: "pharmacist@medicore.demo",
  CASHIER: "cashier@medicore.demo",
  PATIENT: "patient@medicore.demo",
};

export const DEMO_PASSWORD = "Password123!";
