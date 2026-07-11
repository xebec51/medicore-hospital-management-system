import { listDraftRecordsForNotes } from "@/lib/queries/nurse";
import { EmptyState } from "@/components/empty-state";
import { NurseNotesCard } from "@/components/nurse/nurse-notes-card";

export default async function NursePatientNotesPage() {
  const records = await listDraftRecordsForNotes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Patient notes</h1>
        <p className="text-sm text-muted-foreground">Add supporting observations to records still in progress.</p>
      </div>

      {records.length ? (
        <div className="space-y-3">
          {records.map((record) => (
            <NurseNotesCard
              key={record.id}
              appointmentId={record.appointmentId}
              patientName={record.patient.name}
              medicalRecordNumber={record.patient.medicalRecordNumber}
              doctorName={record.doctor.user.name}
              chiefComplaint={record.chiefComplaint}
              initialNotes={record.nurseNotes ?? ""}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No records in progress" description="Draft medical records will appear here." />
      )}
    </div>
  );
}
