import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { resolvePatientIdByUserId, listOwnAppointments } from "@/lib/queries/patient-portal";
import { AppointmentTimeline } from "@/components/appointment-timeline";

export default async function PatientAppointmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const patientId = await resolvePatientIdByUserId(session.user.id);
  if (!patientId) redirect("/unauthorized");

  const appointments = await listOwnAppointments(patientId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My appointments</h1>
        <p className="text-sm text-muted-foreground">Every appointment you have booked, past and upcoming.</p>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <AppointmentTimeline
          appointments={appointments}
          emptyTitle="No appointments yet"
          emptyDescription="Your booked appointments will appear here."
        />
      </div>
    </div>
  );
}
