import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { resolvePatientIdByUserId, getPatientDashboardStats } from "@/lib/queries/patient-portal";
import { PatientDashboardView } from "@/components/dashboard/patient-dashboard-view";

export default async function PatientDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const patientId = await resolvePatientIdByUserId(session.user.id);
  if (!patientId) redirect("/unauthorized");

  const stats = await getPatientDashboardStats(patientId);

  return (
    <PatientDashboardView
      medicalRecordsCount={stats.medicalRecordsCount}
      activePrescriptionsCount={stats.activePrescriptionsCount}
      unpaidInvoicesCount={stats.unpaidInvoicesCount}
      upcomingAppointment={stats.upcomingAppointment}
    />
  );
}
