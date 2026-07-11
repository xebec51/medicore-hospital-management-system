import { listAppointments, listDoctorsForSelect, listPatientsForSelect } from "@/lib/queries/appointments";
import { DataTable } from "@/components/data-table";
import { appointmentColumns } from "@/components/receptionist/appointments/appointment-columns";
import { AppointmentFormDialog } from "@/components/receptionist/appointments/appointment-form-dialog";

export default async function ReceptionistAppointmentsPage() {
  const [appointments, patients, doctors] = await Promise.all([
    listAppointments(),
    listPatientsForSelect(),
    listDoctorsForSelect(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">Book, reschedule, and manage patient appointments.</p>
        </div>
        <AppointmentFormDialog patients={patients} doctors={doctors} />
      </div>

      <DataTable
        columns={appointmentColumns}
        data={appointments}
        searchKey="patientName"
        searchPlaceholder="Search by patient…"
        emptyTitle="No appointments yet"
        emptyDescription="Create the first appointment to start the queue."
      />
    </div>
  );
}
