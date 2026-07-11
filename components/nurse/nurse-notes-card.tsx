"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveNurseNotes } from "@/lib/actions/medical-records";

interface NurseNotesCardProps {
  appointmentId: string;
  patientName: string;
  medicalRecordNumber: string;
  doctorName: string;
  chiefComplaint: string;
  initialNotes: string;
}

export function NurseNotesCard({
  appointmentId,
  patientName,
  medicalRecordNumber,
  doctorName,
  chiefComplaint,
  initialNotes,
}: NurseNotesCardProps) {
  const router = useRouter();
  const [notes, setNotes] = React.useState(initialNotes);
  const [isPending, startTransition] = React.useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await saveNurseNotes({ appointmentId, nurseNotes: notes });
      if (result.success) {
        toast.success("Nurse notes saved");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-medium">{patientName}</p>
          <p className="text-xs text-muted-foreground">
            {medicalRecordNumber} · {doctorName}
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{chiefComplaint}</p>
      <Textarea
        className="mt-3"
        rows={3}
        placeholder="Add nurse observations…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="mt-2 flex justify-end">
        <Button size="sm" onClick={handleSave} disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save notes
        </Button>
      </div>
    </div>
  );
}
