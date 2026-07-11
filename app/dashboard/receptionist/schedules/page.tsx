import { listDoctorAvailabilityToday } from "@/lib/queries/appointments";
import { DoctorAvailabilityCard } from "@/components/doctor-availability-card";
import { EmptyState } from "@/components/empty-state";

export default async function ReceptionistSchedulesPage() {
  const doctors = await listDoctorAvailabilityToday();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Doctor schedules</h1>
        <p className="text-sm text-muted-foreground">Today&apos;s availability across every active doctor.</p>
      </div>

      {doctors.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorAvailabilityCard
              key={doctor.id}
              name={doctor.user.name}
              specialization={doctor.specialization}
              department={doctor.department.name}
              roomNumber={doctor.roomNumber}
              schedule={doctor.todaySchedule}
              bookedToday={doctor.bookedToday}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No active doctors" description="Add doctors from the admin panel to see availability here." />
      )}
    </div>
  );
}
