"use client";

import { DataTable } from "@/components/data-table";
import { buildDoctorColumns } from "./doctor-columns";
import type { DoctorListItem } from "@/lib/queries/doctors";

interface DoctorsTableProps {
  doctors: DoctorListItem[];
  departments: { id: string; name: string }[];
}

export function DoctorsTable({ doctors, departments }: DoctorsTableProps) {
  return (
    <DataTable
      columns={buildDoctorColumns(departments)}
      data={doctors}
      searchKey="doctorName"
      searchPlaceholder="Search doctors…"
      emptyTitle="No doctors yet"
      emptyDescription="Add the first doctor to start scheduling appointments."
    />
  );
}
