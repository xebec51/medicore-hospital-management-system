"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatDate } from "@/lib/i18n/formatters";
import type { DoctorMedicalRecordItem } from "@/lib/queries/doctor-workspace";

function DateCell({ date }: { date: Date | string }) {
  const { locale } = useI18n();
  return <span className="text-sm">{formatDate(date, locale)}</span>;
}

export const doctorMedicalRecordColumns: ColumnDef<DoctorMedicalRecordItem>[] = [
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
    accessorKey: "chiefComplaint",
    header: "Chief complaint",
    cell: ({ row }) => <span className="text-sm">{row.original.chiefComplaint}</span>,
  },
  {
    accessorKey: "diagnosis",
    header: "Diagnosis",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.diagnosis ?? "—"}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} domain="MedicalRecordStatus" />,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon-sm"
          render={<Link href={`/dashboard/doctor/consultation/${row.original.appointmentId}`} />}
        >
          <Eye className="size-4" />
        </Button>
      </div>
    ),
  },
];
