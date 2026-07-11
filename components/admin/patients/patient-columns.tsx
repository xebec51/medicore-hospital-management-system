"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/status-badge";
import { PatientDetailSheet } from "./patient-detail-sheet";
import { calculateAge } from "@/lib/domain/dates";
import type { PatientListItem } from "@/lib/queries/patients";

export const patientColumns: ColumnDef<PatientListItem>[] = [
  {
    accessorKey: "name",
    header: "Patient",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.medicalRecordNumber}</p>
      </div>
    ),
  },
  {
    id: "age",
    accessorFn: (row) => calculateAge(new Date(row.birthDate)),
    header: "Age",
    cell: ({ row }) => <span className="text-sm">{calculateAge(new Date(row.original.birthDate))}</span>,
  },
  {
    accessorKey: "bloodType",
    header: "Blood type",
    cell: ({ row }) => <span className="text-sm">{row.original.bloodType.replace("_", " ")}</span>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.phone ?? "—"}</span>,
  },
  {
    accessorKey: "_count.appointments",
    header: "Visits",
    cell: ({ row }) => <span className="text-sm">{row.original._count.appointments}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} domain="UserStatus" />,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <PatientDetailSheet patient={row.original} />
      </div>
    ),
  },
];
