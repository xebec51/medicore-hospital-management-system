import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { getOwnAccount } from "@/lib/queries/users";
import { resolveDoctorIdByUserId, getDoctorProfile } from "@/lib/queries/doctors";
import { resolvePatientIdByUserId, getPatientProfile } from "@/lib/queries/patient-portal";
import { ProfileView } from "@/components/dashboard/profile-view";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const account = await getOwnAccount(session.user.id);
  if (!account) redirect("/login");

  const patient =
    account.role === "PATIENT"
      ? await resolvePatientIdByUserId(session.user.id).then((id) => (id ? getPatientProfile(id) : null))
      : null;

  const doctor =
    account.role === "DOCTOR"
      ? await resolveDoctorIdByUserId(session.user.id).then((id) => (id ? getDoctorProfile(id) : null))
      : null;

  return <ProfileView account={account} patient={patient} doctor={doctor} />;
}
