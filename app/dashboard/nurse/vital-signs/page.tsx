import { listRecentVitalSigns } from "@/lib/queries/nurse";
import { VitalSignPanel } from "@/components/vital-sign-panel";

export default async function NurseVitalSignsPage() {
  const vitalSigns = await listRecentVitalSigns();

  const entries = vitalSigns.map((v) => ({
    ...v,
    patientLabel: `${v.patient.name} (${v.patient.medicalRecordNumber})`,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Vital signs history</h1>
        <p className="text-sm text-muted-foreground">Recently recorded vitals across all patients.</p>
      </div>

      <VitalSignPanel entries={entries} className="max-h-[70vh] overflow-y-auto pr-1" />
    </div>
  );
}
