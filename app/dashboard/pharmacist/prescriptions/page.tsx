import { listPrescriptionsForPharmacy } from "@/lib/queries/pharmacy";
import { PrescriptionQueueCard } from "@/components/pharmacist/prescription-queue-card";
import { EmptyState } from "@/components/empty-state";

export default async function PharmacistPrescriptionsPage() {
  const prescriptions = await listPrescriptionsForPharmacy();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Prescription queue</h1>
        <p className="text-sm text-muted-foreground">Prepare and dispense prescriptions submitted by doctors.</p>
      </div>

      {prescriptions.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {prescriptions.map((rx) => (
            <PrescriptionQueueCard key={rx.id} prescription={rx} />
          ))}
        </div>
      ) : (
        <EmptyState title="No pending prescriptions" description="New prescriptions from doctors will appear here." />
      )}
    </div>
  );
}
