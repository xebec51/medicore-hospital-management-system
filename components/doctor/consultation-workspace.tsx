"use client";

import { PatientIdentityCard } from "@/components/patient-identity-card";
import { AppointmentTimeline } from "@/components/appointment-timeline";
import { VitalSignPanel } from "@/components/vital-sign-panel";
import { StatusBadge } from "@/components/status-badge";
import { MedicalRecordForm } from "./medical-record-form";
import { PrescriptionBuilder } from "./prescription-builder";
import type { ConsultationWorkspaceData } from "@/lib/queries/medical-records";

interface ConsultationWorkspaceProps {
  data: ConsultationWorkspaceData;
  medicines: { id: string; name: string; unit: string; stock: number }[];
}

export function ConsultationWorkspace({ data, medicines }: ConsultationWorkspaceProps) {
  const { appointment, medicalRecord, vitalSigns, prescriptions, history } = data;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <div>
          <p className="text-sm text-muted-foreground">{appointment.appointmentCode}</p>
          <h1 className="text-xl font-semibold tracking-tight">
            {appointment.doctor.user.name} · {appointment.doctor.specialization}
          </h1>
        </div>
        <StatusBadge status={appointment.status} domain="AppointmentStatus" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <PatientIdentityCard patient={appointment.patient} />
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
            <h3 className="mb-3 font-semibold">Visit history</h3>
            <AppointmentTimeline appointments={history} className="max-h-96 overflow-y-auto" />
          </div>
        </div>

        <MedicalRecordForm
          appointmentId={appointment.id}
          appointmentStatus={appointment.status}
          recordStatus={medicalRecord?.status ?? null}
          initialValues={{
            chiefComplaint: medicalRecord?.chiefComplaint ?? "",
            diagnosis: medicalRecord?.diagnosis ?? "",
            doctorNotes: medicalRecord?.doctorNotes ?? "",
            treatmentPlan: medicalRecord?.treatmentPlan ?? "",
            followUpDate: medicalRecord?.followUpDate ? new Date(medicalRecord.followUpDate).toISOString().slice(0, 10) : "",
            nurseNotes: medicalRecord?.nurseNotes,
          }}
        />

        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
            <h3 className="mb-3 font-semibold">Vital signs</h3>
            <VitalSignPanel entries={vitalSigns} />
          </div>
          <PrescriptionBuilder
            medicalRecordId={medicalRecord?.id ?? null}
            medicines={medicines}
            existingPrescriptions={prescriptions}
          />
        </div>
      </div>
    </div>
  );
}
