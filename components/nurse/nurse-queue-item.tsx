"use client";

import * as React from "react";
import { HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QueueTicketCard } from "@/components/queue-ticket-card";
import { VitalSignDialog } from "./vital-sign-dialog";
import type { NurseQueueItem as NurseQueueItemType } from "@/lib/queries/nurse";

export function NurseQueueItem({ appointment }: { appointment: NurseQueueItemType }) {
  const [open, setOpen] = React.useState(false);
  const hasVitals = appointment.vitalSigns.length > 0;

  return (
    <>
      <QueueTicketCard
        queueNumber={appointment.queueNumber}
        patientName={appointment.patient.name}
        mrn={appointment.patient.medicalRecordNumber}
        meta={appointment.doctor.user.name}
        status={appointment.status}
        reason={appointment.reason}
        actions={
          <Button size="sm" variant={hasVitals ? "outline" : "default"} onClick={() => setOpen(true)}>
            <HeartPulse className="size-4" />
            {hasVitals ? "Update vitals" : "Record vitals"}
          </Button>
        }
      />
      <VitalSignDialog
        appointmentId={appointment.id}
        patientName={appointment.patient.name}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
