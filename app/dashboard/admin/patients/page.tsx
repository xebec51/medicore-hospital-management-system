import { listPatients } from "@/lib/queries/patients";
import { DataTable } from "@/components/data-table";
import { patientColumns } from "@/components/admin/patients/patient-columns";

export default async function AdminPatientsPage() {
  const patients = await listPatients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
        <p className="text-sm text-muted-foreground">
          Hospital-wide patient directory. Registration is handled by reception.
        </p>
      </div>

      <DataTable
        columns={patientColumns}
        data={patients}
        searchKey="name"
        searchPlaceholder="Search patients…"
        emptyTitle="No patients registered yet"
        emptyDescription="Patients will appear here once reception registers them."
      />
    </div>
  );
}
