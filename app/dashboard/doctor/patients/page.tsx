import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { resolveDoctorIdByUserId } from "@/lib/queries/doctors";
import { listDoctorPatients } from "@/lib/queries/doctor-workspace";
import { EmptyState } from "@/components/empty-state";

export default async function DoctorPatientsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const doctorId = await resolveDoctorIdByUserId(session.user.id);
  if (!doctorId) redirect("/unauthorized");

  const patients = await listDoctorPatients(doctorId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My patients</h1>
        <p className="text-sm text-muted-foreground">Everyone you have seen, with their visit history.</p>
      </div>

      {patients.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map(({ patient, lastVisit, visitCount }) => (
            <div key={patient.id} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
              <p className="font-medium">{patient.name}</p>
              <p className="text-xs text-muted-foreground">{patient.medicalRecordNumber}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{visitCount} visit(s)</span>
                <span>Last: {new Date(lastVisit).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No patients yet" description="Patients you consult will appear here." />
      )}
    </div>
  );
}
