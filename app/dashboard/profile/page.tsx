import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { ProfileView } from "@/components/dashboard/profile-view";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <ProfileView name={session.user.name} email={session.user.email} role={session.user.role} />;
}
