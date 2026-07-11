import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { resolveDoctorIdByUserId } from "@/lib/queries/doctors";
import { listDoctorPrescriptions } from "@/lib/queries/doctor-workspace";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { ExportButton } from "@/components/export-button";
import { getStatusLabel } from "@/lib/domain/status-labels";

export default async function DoctorPrescriptionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const doctorId = await resolveDoctorIdByUserId(session.user.id);
  if (!doctorId) redirect("/unauthorized");

  const prescriptions = await listDoctorPrescriptions(doctorId);

  const exportRows = prescriptions.map((rx) => ({
    "Prescription Code": rx.prescriptionCode,
    Patient: rx.patient.name,
    MRN: rx.patient.medicalRecordNumber,
    Medicines: rx.items.map((i) => `${i.medicine.name} x${i.quantity}`).join("; "),
    Status: getStatusLabel("PrescriptionStatus", rx.status),
    Date: new Date(rx.createdAt).toISOString().slice(0, 10),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Prescriptions</h1>
          <p className="text-sm text-muted-foreground">Every prescription you have written.</p>
        </div>
        <ExportButton data={exportRows} filename="medicore-my-prescriptions" sheetName="Prescriptions" />
      </div>

      {prescriptions.length ? (
        <div className="space-y-2">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{rx.prescriptionCode}</p>
                  <p className="text-xs text-muted-foreground">
                    {rx.patient.name} · {rx.patient.medicalRecordNumber}
                  </p>
                </div>
                <StatusBadge status={rx.status} domain="PrescriptionStatus" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {rx.items.map((i) => `${i.medicine.name} x${i.quantity}`).join(", ")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No prescriptions yet" description="Prescriptions you create will appear here." />
      )}
    </div>
  );
}
