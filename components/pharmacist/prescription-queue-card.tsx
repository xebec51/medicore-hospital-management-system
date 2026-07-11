"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Ban, Loader2, PackageCheck, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { preparePrescription, dispensePrescription, cancelPrescription } from "@/lib/actions/prescriptions";
import type { PharmacyPrescriptionItem } from "@/lib/queries/pharmacy";

export function PrescriptionQueueCard({ prescription }: { prescription: PharmacyPrescriptionItem }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  function run(action: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  const insufficientStock = prescription.items.some((item) => item.medicine.stock < item.quantity);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-medium">{prescription.patient.name}</p>
          <p className="text-xs text-muted-foreground">
            {prescription.patient.medicalRecordNumber} · {prescription.prescriptionCode} · {prescription.doctor.user.name}
          </p>
        </div>
        <StatusBadge status={prescription.status} domain="PrescriptionStatus" />
      </div>

      <div className="mt-3 space-y-1.5">
        {prescription.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span>
              {item.medicine.name} · {item.dosage} · {item.frequency} · {item.duration}
            </span>
            <span className={item.medicine.stock < item.quantity ? "font-medium text-destructive" : "text-muted-foreground"}>
              {item.quantity} {item.medicine.unit} ({item.medicine.stock} in stock)
            </span>
          </div>
        ))}
      </div>
      {prescription.notes ? <p className="mt-2 text-xs text-muted-foreground">{prescription.notes}</p> : null}

      <div className="mt-3 flex flex-wrap gap-2 border-t border-border/60 pt-3">
        {prescription.status === "PENDING" ? (
          <Button size="sm" onClick={() => run(() => preparePrescription(prescription.id))} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <PackageOpen className="size-4" />}
            Prepare
          </Button>
        ) : null}
        {prescription.status === "PREPARED" ? (
          <Button
            size="sm"
            onClick={() => run(() => dispensePrescription(prescription.id))}
            disabled={isPending || insufficientStock}
            title={insufficientStock ? "Insufficient stock for one or more items" : undefined}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <PackageCheck className="size-4" />}
            Dispense
          </Button>
        ) : null}
        <Button
          size="sm"
          variant="outline"
          onClick={() => run(() => cancelPrescription(prescription.id))}
          disabled={isPending}
        >
          <Ban className="size-4" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
