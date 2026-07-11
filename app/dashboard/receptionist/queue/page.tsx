import { listTodayAppointments } from "@/lib/queries/appointments";
import { QueueBoard } from "@/components/queue-board";
import { QueueTicketCard } from "@/components/queue-ticket-card";
import { AppointmentRowActions } from "@/components/receptionist/appointments/appointment-row-actions";
import { formatTime } from "@/lib/i18n/formatters";

export default async function ReceptionistQueuePage() {
  const appointments = await listTodayAppointments();

  const groupsMap = new Map<string, { key: string; title: string; subtitle: string; tickets: React.ReactNode[] }>();
  for (const appt of appointments) {
    const key = appt.doctor.id;
    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        key,
        title: appt.doctor.user.name,
        subtitle: appt.doctor.specialization,
        tickets: [],
      });
    }
    groupsMap.get(key)!.tickets.push(
      <QueueTicketCard
        key={appt.id}
        queueNumber={appt.queueNumber}
        patientName={appt.patient.name}
        mrn={appt.patient.medicalRecordNumber}
        meta={formatTime(appt.appointmentDate, "en")}
        status={appt.status}
        reason={appt.reason}
        actions={<AppointmentRowActions appointment={appt} />}
      />,
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Today&apos;s queue</h1>
        <p className="text-sm text-muted-foreground">Live view of every doctor&apos;s queue for today.</p>
      </div>

      <QueueBoard
        groups={Array.from(groupsMap.values())}
        emptyTitle="No appointments today"
        emptyDescription="Scheduled appointments for today will appear here grouped by doctor."
      />
    </div>
  );
}
