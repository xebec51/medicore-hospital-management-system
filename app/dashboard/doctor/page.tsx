import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { resolveDoctorIdByUserId } from "@/lib/queries/doctors";
import { getDoctorDashboardStats } from "@/lib/queries/doctor-workspace";
import { DoctorDashboardView } from "@/components/dashboard/doctor-dashboard-view";

export default async function DoctorDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const doctorId = await resolveDoctorIdByUserId(session.user.id);
  if (!doctorId) redirect("/unauthorized");

  const stats = await getDoctorDashboardStats(doctorId);

  return (
    <DoctorDashboardView
      todayAppointments={stats.todayAppointments}
      completedToday={stats.completedToday}
      pendingToday={stats.pendingToday}
      recentPatientsCount={stats.recentPatients.length}
    />
  );
}
