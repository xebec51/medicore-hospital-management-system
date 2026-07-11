import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { resolveDoctorIdByUserId } from "@/lib/queries/doctors";
import { listDoctorAppointments } from "@/lib/queries/doctor-workspace";
import { DataTable } from "@/components/data-table";
import { doctorAppointmentColumns } from "@/components/doctor/doctor-appointment-columns";

export default async function DoctorAppointmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const doctorId = await resolveDoctorIdByUserId(session.user.id);
  if (!doctorId) redirect("/unauthorized");

  const appointments = await listDoctorAppointments(doctorId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My appointments</h1>
        <p className="text-sm text-muted-foreground">Every appointment assigned to you, past and upcoming.</p>
      </div>

      <DataTable
        columns={doctorAppointmentColumns}
        data={appointments}
        searchKey="patientName"
        searchPlaceholder="Search by patient…"
        emptyTitle="No appointments yet"
        emptyDescription="Appointments assigned to you will appear here."
      />
    </div>
  );
}
