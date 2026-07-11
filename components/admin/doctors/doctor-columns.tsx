"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DoctorFormDialog } from "./doctor-form-dialog";
import { DoctorScheduleSheet } from "./doctor-schedule-sheet";
import { toggleDoctorActive } from "@/lib/actions/doctors";
import { formatCurrency } from "@/lib/i18n/formatters";
import type { DoctorListItem } from "@/lib/queries/doctors";

function ActiveToggleCell({ doctor }: { doctor: DoctorListItem }) {
  const router = useRouter();

  return (
    <Switch
      checked={doctor.isActive}
      onCheckedChange={async (checked) => {
        const result = await toggleDoctorActive(doctor.id, checked);
        if (result.success) {
          toast.success(`${doctor.user.name} is now ${checked ? "active" : "inactive"}`);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      }}
    />
  );
}

export function buildDoctorColumns(departments: { id: string; name: string }[]): ColumnDef<DoctorListItem>[] {
  return [
    {
      id: "doctorName",
      accessorFn: (row) => row.user.name,
      header: "Doctor",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.user.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.specialization}</p>
        </div>
      ),
    },
    {
      accessorKey: "department.name",
      header: "Department",
      cell: ({ row }) => <span className="text-sm">{row.original.department.name}</span>,
    },
    {
      accessorKey: "roomNumber",
      header: "Room",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.roomNumber ?? "—"}</span>,
    },
    {
      accessorKey: "consultationFee",
      header: "Fee",
      cell: ({ row }) => <span className="text-sm">{formatCurrency(row.original.consultationFee.toString(), "en")}</span>,
    },
    {
      accessorKey: "_count.appointments",
      header: "Appointments",
      cell: ({ row }) => <span className="text-sm">{row.original._count.appointments}</span>,
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => <ActiveToggleCell doctor={row.original} />,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <DoctorScheduleSheet
            doctor={row.original}
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label="Manage schedule">
                <CalendarDays className="size-4" />
              </Button>
            }
          />
          <DoctorFormDialog
            doctor={row.original}
            departments={departments}
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label="Edit doctor">
                <Pencil className="size-4" />
              </Button>
            }
          />
        </div>
      ),
    },
  ];
}
