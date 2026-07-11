import { listPatients } from "@/lib/queries/patients";
import { DataTable } from "@/components/data-table";
import { patientColumns } from "@/components/admin/patients/patient-columns";
import { ExportButton } from "@/components/export-button";
import { calculateAge } from "@/lib/domain/dates";
import { bloodTypeLabels } from "@/lib/constants/patient-options";
import { getStatusLabel } from "@/lib/domain/status-labels";

export default async function AdminPatientsPage() {
  const patients = await listPatients();

  const exportRows = patients.map((p) => ({
    "Medical Record Number": p.medicalRecordNumber,
    Name: p.name,
    Gender: p.gender,
    Age: calculateAge(new Date(p.birthDate)),
    "Blood Type": bloodTypeLabels[p.bloodType],
    Phone: p.phone ?? "",
    Allergies: p.allergies ?? "",
    Status: getStatusLabel("UserStatus", p.status),
    Visits: p._count.appointments,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground">
            Hospital-wide patient directory. Registration is handled by reception.
          </p>
        </div>
        <ExportButton data={exportRows} filename="medicore-patients" sheetName="Patients" />
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
