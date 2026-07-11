"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DepartmentFormDialog } from "./department-form-dialog";
import { toggleDepartmentActive } from "@/lib/actions/departments";
import type { DepartmentListItem } from "@/lib/queries/departments";

function ActiveToggleCell({ department }: { department: DepartmentListItem }) {
  const router = useRouter();

  return (
    <Switch
      checked={department.isActive}
      onCheckedChange={async (checked) => {
        const result = await toggleDepartmentActive(department.id, checked);
        if (result.success) {
          toast.success(`${department.name} is now ${checked ? "active" : "inactive"}`);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      }}
    />
  );
}

export const departmentColumns: ColumnDef<DepartmentListItem>[] = [
  {
    accessorKey: "name",
    header: "Department",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        {row.original.location ? <p className="text-xs text-muted-foreground">{row.original.location}</p> : null}
      </div>
    ),
  },
  {
    accessorKey: "_count.doctors",
    header: "Doctors",
    cell: ({ row }) => <span className="text-sm">{row.original._count.doctors}</span>,
  },
  {
    accessorKey: "_count.appointments",
    header: "Appointments",
    cell: ({ row }) => <span className="text-sm">{row.original._count.appointments}</span>,
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <ActiveToggleCell department={row.original} />,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DepartmentFormDialog
          department={row.original}
          trigger={
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          }
        />
      </div>
    ),
  },
];
