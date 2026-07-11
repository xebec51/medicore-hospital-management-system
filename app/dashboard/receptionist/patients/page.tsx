import { listPatients } from "@/lib/queries/patients";
import { DataTable } from "@/components/data-table";
import { receptionistPatientColumns } from "@/components/receptionist/patients/patient-columns";
import { PatientFormDialog } from "@/components/receptionist/patients/patient-form-dialog";

export default async function ReceptionistPatientsPage() {
  const patients = await listPatients();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground">Register new patients and keep records up to date.</p>
        </div>
        <PatientFormDialog />
      </div>

      <DataTable
        columns={receptionistPatientColumns}
        data={patients}
        searchKey="name"
        searchPlaceholder="Search patients…"
        emptyTitle="No patients registered yet"
        emptyDescription="Register the first patient to begin scheduling appointments."
      />
    </div>
  );
}
