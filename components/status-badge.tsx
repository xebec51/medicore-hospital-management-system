"use client";

import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "info" | "destructive" | "neutral" | "clinical";

const TONE_BY_STATUS: Record<string, StatusTone> = {
  ACTIVE: "success",
  COMPLETED: "success",
  PAID: "success",
  DISPENSED: "success",
  FINALIZED: "success",
  PENDING: "warning",
  LOW_STOCK: "warning",
  PARTIALLY_PAID: "warning",
  PREPARED: "warning",
  DRAFT: "warning",
  SCHEDULED: "info",
  CHECKED_IN: "info",
  IN_CONSULTATION: "clinical",
  CANCELLED: "destructive",
  EXPIRED: "destructive",
  NO_SHOW: "destructive",
  FAILED: "destructive",
  SUSPENDED: "destructive",
  UNPAID: "destructive",
  INACTIVE: "neutral",
  REFUNDED: "neutral",
  ARCHIVED: "neutral",
};

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-success/15 text-success border-success/25 dark:bg-success/20",
  warning: "bg-warning/20 text-warning-foreground border-warning/30 dark:bg-warning/25",
  info: "bg-info/15 text-info border-info/25 dark:bg-info/20",
  clinical: "bg-clinical/15 text-clinical border-clinical/30 dark:bg-clinical/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/25 dark:bg-destructive/20",
  neutral: "bg-muted text-muted-foreground border-border",
};

const DOT_CLASSES: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  clinical: "bg-clinical",
  destructive: "bg-destructive",
  neutral: "bg-muted-foreground",
};

interface StatusBadgeProps {
  status: string;
  domain?:
    | "UserStatus"
    | "AppointmentStatus"
    | "MedicalRecordStatus"
    | "PrescriptionStatus"
    | "MedicineStatus"
    | "InvoiceStatus"
    | "PaymentStatus"
    | "PaymentMethod";
  className?: string;
}

export function StatusBadge({ status, domain = "AppointmentStatus", className }: StatusBadgeProps) {
  const { t } = useI18n();
  const tone = TONE_BY_STATUS[status] ?? "neutral";
  const label = t(`status.${domain}.${status}`);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        TONE_CLASSES[tone],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", DOT_CLASSES[tone])} />
      {label}
    </span>
  );
}
