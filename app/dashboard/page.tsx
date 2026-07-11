import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { roleDashboardPath } from "@/lib/constants/roles";

export default async function DashboardIndexPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  redirect(roleDashboardPath[session.user.role]);
}
