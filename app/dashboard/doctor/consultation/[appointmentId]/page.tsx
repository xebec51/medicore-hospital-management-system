import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { resolveDoctorIdByUserId } from "@/lib/queries/doctors";
import { getConsultationWorkspaceData } from "@/lib/queries/medical-records";
import { listActiveMedicinesForSelect } from "@/lib/queries/medicines";
import { ConsultationWorkspace } from "@/components/doctor/consultation-workspace";

export default async function ConsultationPage({ params }: { params: Promise<{ appointmentId: string }> }) {
  const { appointmentId } = await params;

  const session = await auth();
  if (!session?.user) redirect("/login");

  const doctorId = await resolveDoctorIdByUserId(session.user.id);
  if (!doctorId) redirect("/unauthorized");

  const data = await getConsultationWorkspaceData(appointmentId);
  if (!data) notFound();
  if (data.appointment.doctorId !== doctorId) redirect("/unauthorized");

  const medicines = await listActiveMedicinesForSelect();

  return <ConsultationWorkspace data={data} medicines={medicines} />;
}
