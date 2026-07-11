"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/status-badge";
import { ConsultationActionButton } from "./consultation-action-button";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatDateTime } from "@/lib/i18n/formatters";
import type { DoctorAppointmentItem } from "@/lib/queries/doctor-workspace";

function DateCell({ date }: { date: Date | string }) {
  const { locale } = useI18n();
  return <span className="text-sm">{formatDateTime(date, locale)}</span>;
}

export const doctorAppointmentColumns: ColumnDef<DoctorAppointmentItem>[] = [
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
        <ConsultationActionButton appointmentId={row.original.id} status={row.original.status} />
      </div>
    ),
  },
];
