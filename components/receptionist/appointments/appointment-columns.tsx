"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/status-badge";
import { AppointmentRowActions } from "./appointment-row-actions";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatDateTime } from "@/lib/i18n/formatters";
import type { AppointmentListItem } from "@/lib/queries/appointments";

function DateCell({ date }: { date: Date | string }) {
  const { locale } = useI18n();
  return <span className="text-sm">{formatDateTime(date, locale)}</span>;
}

export const appointmentColumns: ColumnDef<AppointmentListItem>[] = [
  {
    id: "patientName",
    accessorFn: (row) => row.patient.name,
    header: "Patient",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.patient.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.patient.medicalRecordNumber}</p>
      </div>
    ),
  },
  {
    id: "doctorName",
    accessorFn: (row) => row.doctor.user.name,
    header: "Doctor",
    cell: ({ row }) => (
      <div>
        <p className="text-sm">{row.original.doctor.user.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.department.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "appointmentDate",
    header: "Date & time",
    cell: ({ row }) => <DateCell date={row.original.appointmentDate} />,
  },
  {
    accessorKey: "queueNumber",
    header: "Queue #",
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.queueNumber}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} domain="AppointmentStatus" />,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <AppointmentRowActions appointment={row.original} />
      </div>
    ),
  },
];
