import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { resolvePatientIdByUserId, listOwnPrescriptions } from "@/lib/queries/patient-portal";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";

export default async function PatientPrescriptionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const patientId = await resolvePatientIdByUserId(session.user.id);
  if (!patientId) redirect("/unauthorized");

  const prescriptions = await listOwnPrescriptions(patientId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My prescriptions</h1>
        <p className="text-sm text-muted-foreground">Every prescription written for you.</p>
      </div>

      {prescriptions.length ? (
        <div className="space-y-3">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{rx.prescriptionCode}</p>
                  <p className="text-xs text-muted-foreground">{rx.doctor.user.name}</p>
                </div>
                <StatusBadge status={rx.status} domain="PrescriptionStatus" />
              </div>
              <div className="mt-3 space-y-1">
                {rx.items.map((item) => (
                  <p key={item.id} className="text-sm text-muted-foreground">
                    {item.medicine.name} · {item.dosage} · {item.frequency} · {item.duration}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No prescriptions yet" description="Prescriptions written for you will appear here." />
      )}
    </div>
  );
}
