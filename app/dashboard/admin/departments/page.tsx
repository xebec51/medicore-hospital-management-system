import { listDepartments } from "@/lib/queries/departments";
import { DataTable } from "@/components/data-table";
import { departmentColumns } from "@/components/admin/departments/department-columns";
import { DepartmentFormDialog } from "@/components/admin/departments/department-form-dialog";

export default async function AdminDepartmentsPage() {
  const departments = await listDepartments();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Departments</h1>
          <p className="text-sm text-muted-foreground">Organize the hospital&apos;s clinical departments.</p>
        </div>
        <DepartmentFormDialog />
      </div>

      <DataTable
        columns={departmentColumns}
        data={departments}
        searchKey="name"
        searchPlaceholder="Search departments…"
        emptyTitle="No departments yet"
        emptyDescription="Add the first department to start assigning doctors."
      />
    </div>
  );
}
