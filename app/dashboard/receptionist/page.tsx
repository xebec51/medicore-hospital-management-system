import { listDoctorAvailabilityToday, listTodayAppointments } from "@/lib/queries/appointments";
import { ReceptionistDashboardView } from "@/components/dashboard/receptionist-dashboard-view";

export default async function ReceptionistDashboardPage() {
  const [todayAppointments, doctorAvailability] = await Promise.all([
    listTodayAppointments(),
    listDoctorAvailabilityToday(),
  ]);

  const checkedInCount = todayAppointments.filter((a) => a.status === "CHECKED_IN" || a.status === "IN_CONSULTATION").length;
  const inQueueCount = todayAppointments.filter((a) => a.status === "CHECKED_IN").length;
  const doctorsAvailableToday = doctorAvailability.filter((d) => d.todaySchedule).length;

  return (
    <ReceptionistDashboardView
      todayAppointments={todayAppointments}
      checkedInCount={checkedInCount}
      inQueueCount={inQueueCount}
      doctorsAvailableToday={doctorsAvailableToday}
      totalActiveDoctors={doctorAvailability.length}
    />
  );
}
