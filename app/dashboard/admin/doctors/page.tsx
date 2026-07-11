import { listDoctors } from "@/lib/queries/doctors";
import { listActiveDepartments } from "@/lib/queries/departments";
import { DoctorsTable } from "@/components/admin/doctors/doctors-table";
import { DoctorFormDialog } from "@/components/admin/doctors/doctor-form-dialog";

export default async function AdminDoctorsPage() {
  const [doctors, departments] = await Promise.all([listDoctors(), listActiveDepartments()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Doctors</h1>
          <p className="text-sm text-muted-foreground">Manage doctor profiles, departments, and schedules.</p>
        </div>
        <DoctorFormDialog departments={departments} />
      </div>

      <DoctorsTable doctors={doctors} departments={departments} />
    </div>
  );
}
