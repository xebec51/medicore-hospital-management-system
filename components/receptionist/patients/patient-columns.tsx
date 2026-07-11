"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { PatientFormDialog } from "./patient-form-dialog";
import { calculateAge } from "@/lib/domain/dates";
import { bloodTypeLabels } from "@/lib/constants/patient-options";
import type { PatientListItem } from "@/lib/queries/patients";

export const receptionistPatientColumns: ColumnDef<PatientListItem>[] = [
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
    cell: ({ row }) => <span className="text-sm">{bloodTypeLabels[row.original.bloodType]}</span>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.phone ?? "—"}</span>,
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
        <PatientFormDialog
          patient={row.original}
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Edit patient">
              <Pencil className="size-4" />
            </Button>
          }
        />
      </div>
    ),
  },
];
