import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Boxes,
  Building2,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  LayoutDashboard,
  ListOrdered,
  NotebookPen,
  Pill,
  Receipt,
  ScrollText,
  Stethoscope,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import type { AppRole } from "./roles";

export interface NavItem {
  labelKey: string;
  href: string;
  icon: LucideIcon;
}

export const roleNavConfig: Record<AppRole, NavItem[]> = {
  ADMIN: [
    { labelKey: "nav.dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { labelKey: "nav.users", href: "/dashboard/admin/users", icon: Users },
    { labelKey: "nav.departments", href: "/dashboard/admin/departments", icon: Building2 },
    { labelKey: "nav.doctors", href: "/dashboard/admin/doctors", icon: Stethoscope },
    { labelKey: "nav.patients", href: "/dashboard/admin/patients", icon: UserRound },
    { labelKey: "nav.appointments", href: "/dashboard/admin/appointments", icon: CalendarClock },
    { labelKey: "nav.reports", href: "/dashboard/admin/reports", icon: BarChart3 },
    { labelKey: "nav.activityLogs", href: "/dashboard/admin/activity-logs", icon: ScrollText },
  ],
  RECEPTIONIST: [
    { labelKey: "nav.dashboard", href: "/dashboard/receptionist", icon: LayoutDashboard },
    { labelKey: "nav.patients", href: "/dashboard/receptionist/patients", icon: UserRound },
    { labelKey: "nav.appointments", href: "/dashboard/receptionist/appointments", icon: CalendarClock },
    { labelKey: "nav.queue", href: "/dashboard/receptionist/queue", icon: ListOrdered },
    { labelKey: "nav.schedules", href: "/dashboard/receptionist/schedules", icon: CalendarDays },
  ],
  DOCTOR: [
    { labelKey: "nav.dashboard", href: "/dashboard/doctor", icon: LayoutDashboard },
    { labelKey: "nav.appointments", href: "/dashboard/doctor/appointments", icon: CalendarClock },
    { labelKey: "nav.patients", href: "/dashboard/doctor/patients", icon: UserRound },
    { labelKey: "nav.medicalRecords", href: "/dashboard/doctor/medical-records", icon: ClipboardList },
    { labelKey: "nav.prescriptions", href: "/dashboard/doctor/prescriptions", icon: Pill },
  ],
  NURSE: [
    { labelKey: "nav.dashboard", href: "/dashboard/nurse", icon: LayoutDashboard },
    { labelKey: "nav.queue", href: "/dashboard/nurse/queue", icon: ListOrdered },
    { labelKey: "nav.vitalSigns", href: "/dashboard/nurse/vital-signs", icon: HeartPulse },
    { labelKey: "nav.patientNotes", href: "/dashboard/nurse/patient-notes", icon: NotebookPen },
  ],
  PHARMACIST: [
    { labelKey: "nav.dashboard", href: "/dashboard/pharmacist", icon: LayoutDashboard },
    { labelKey: "nav.prescriptions", href: "/dashboard/pharmacist/prescriptions", icon: Pill },
    { labelKey: "nav.medicines", href: "/dashboard/pharmacist/medicines", icon: Activity },
    { labelKey: "nav.inventory", href: "/dashboard/pharmacist/inventory", icon: Boxes },
  ],
  CASHIER: [
    { labelKey: "nav.dashboard", href: "/dashboard/cashier", icon: LayoutDashboard },
    { labelKey: "nav.invoices", href: "/dashboard/cashier/invoices", icon: Receipt },
    { labelKey: "nav.payments", href: "/dashboard/cashier/payments", icon: Wallet },
    { labelKey: "nav.reports", href: "/dashboard/cashier/reports", icon: BarChart3 },
  ],
  PATIENT: [
    { labelKey: "nav.dashboard", href: "/dashboard/patient", icon: LayoutDashboard },
    { labelKey: "nav.appointments", href: "/dashboard/patient/appointments", icon: CalendarClock },
    { labelKey: "nav.medicalRecords", href: "/dashboard/patient/medical-history", icon: ClipboardList },
    { labelKey: "nav.prescriptions", href: "/dashboard/patient/prescriptions", icon: Pill },
    { labelKey: "nav.invoices", href: "/dashboard/patient/invoices", icon: Receipt },
  ],
};
