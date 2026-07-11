/**
 * Canonical English status labels for contexts without React/i18n access
 * (XLSX exports, server logs, notifications). Dashboard UI uses the
 * bilingual `status.*` dictionary keys via the StatusBadge component instead.
 */
const STATUS_LABELS = {
  UserStatus: {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    SUSPENDED: "Suspended",
  },
  AppointmentStatus: {
    SCHEDULED: "Scheduled",
    CHECKED_IN: "Checked In",
    IN_CONSULTATION: "In Consultation",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    NO_SHOW: "No Show",
  },
  MedicalRecordStatus: {
    DRAFT: "Draft",
    FINALIZED: "Finalized",
    ARCHIVED: "Archived",
  },
  PrescriptionStatus: {
    PENDING: "Pending",
    PREPARED: "Prepared",
    DISPENSED: "Dispensed",
    CANCELLED: "Cancelled",
  },
  MedicineStatus: {
    ACTIVE: "In Stock",
    LOW_STOCK: "Low Stock",
    EXPIRED: "Expired",
    INACTIVE: "Inactive",
  },
  InvoiceStatus: {
    UNPAID: "Unpaid",
    PARTIALLY_PAID: "Partially Paid",
    PAID: "Paid",
    CANCELLED: "Cancelled",
  },
  PaymentStatus: {
    PENDING: "Pending",
    COMPLETED: "Completed",
    FAILED: "Failed",
    REFUNDED: "Refunded",
  },
  PaymentMethod: {
    CASH: "Cash",
    BANK_TRANSFER: "Bank Transfer",
    E_WALLET: "E-Wallet",
    INSURANCE: "Insurance",
  },
} as const;

type StatusDomain = keyof typeof STATUS_LABELS;

export function getStatusLabel(domain: StatusDomain, value: string): string {
  const domainLabels = STATUS_LABELS[domain] as Record<string, string>;
  return domainLabels[value] ?? value;
}
