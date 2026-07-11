import { listAppointments, listDoctorsForSelect, listPatientsForSelect } from "@/lib/queries/appointments";
import { DataTable } from "@/components/data-table";
import { appointmentColumns } from "@/components/receptionist/appointments/appointment-columns";
import { AppointmentFormDialog } from "@/components/receptionist/appointments/appointment-form-dialog";
import { ExportButton } from "@/components/export-button";
import { getStatusLabel } from "@/lib/domain/status-labels";

export default async function AdminAppointmentsPage() {
  const [appointments, patients, doctors] = await Promise.all([
    listAppointments(),
    listPatientsForSelect(),
    listDoctorsForSelect(),
  ]);

  const exportRows = appointments.map((a) => ({
    "Appointment Code": a.appointmentCode,
    Patient: a.patient.name,
    MRN: a.patient.medicalRecordNumber,
    Doctor: a.doctor.user.name,
    Department: a.department.name,
    Date: new Date(a.appointmentDate).toISOString().slice(0, 16).replace("T", " "),
    Queue: a.queueNumber,
    Status: getStatusLabel("AppointmentStatus", a.status),
    Reason: a.reason ?? "",
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">Hospital-wide view of every appointment.</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton data={exportRows} filename="medicore-appointments" sheetName="Appointments" />
          <AppointmentFormDialog patients={patients} doctors={doctors} />
        </div>
      </div>

      <DataTable
        columns={appointmentColumns}
        data={appointments}
        searchKey="patientName"
        searchPlaceholder="Search by patient…"
        emptyTitle="No appointments yet"
      />
    </div>
  );
}
