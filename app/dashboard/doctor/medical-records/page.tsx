import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { resolveDoctorIdByUserId } from "@/lib/queries/doctors";
import { listDoctorMedicalRecords } from "@/lib/queries/doctor-workspace";
import { DataTable } from "@/components/data-table";
import { doctorMedicalRecordColumns } from "@/components/doctor/medical-record-columns";

export default async function DoctorMedicalRecordsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const doctorId = await resolveDoctorIdByUserId(session.user.id);
  if (!doctorId) redirect("/unauthorized");

  const records = await listDoctorMedicalRecords(doctorId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Medical records</h1>
        <p className="text-sm text-muted-foreground">Every record you have created, draft or finalized.</p>
      </div>

      <DataTable
        columns={doctorMedicalRecordColumns}
        data={records}
        searchKey="patientName"
        searchPlaceholder="Search by patient…"
        emptyTitle="No medical records yet"
        emptyDescription="Records you create during consultations will appear here."
      />
    </div>
  );
}
