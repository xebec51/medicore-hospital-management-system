import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { resolvePatientIdByUserId, listOwnMedicalHistory } from "@/lib/queries/patient-portal";
import { EmptyState } from "@/components/empty-state";

export default async function PatientMedicalHistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const patientId = await resolvePatientIdByUserId(session.user.id);
  if (!patientId) redirect("/unauthorized");

  const records = await listOwnMedicalHistory(patientId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Medical history</h1>
        <p className="text-sm text-muted-foreground">A summary of your finalized consultation records.</p>
      </div>

      {records.length ? (
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{record.chiefComplaint}</p>
                <p className="text-xs text-muted-foreground">{new Date(record.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {record.doctor.user.name} · {record.doctor.specialization}
              </p>
              {record.diagnosis ? (
                <p className="mt-2 text-sm">
                  <span className="font-medium text-muted-foreground">Diagnosis: </span>
                  {record.diagnosis}
                </p>
              ) : null}
              {record.treatmentPlan ? (
                <p className="mt-1 text-sm">
                  <span className="font-medium text-muted-foreground">Treatment plan: </span>
                  {record.treatmentPlan}
                </p>
              ) : null}
              {record.followUpDate ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Follow-up: {new Date(record.followUpDate).toLocaleDateString()}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No medical history yet" description="Finalized records from your visits will appear here." />
      )}
    </div>
  );
}
