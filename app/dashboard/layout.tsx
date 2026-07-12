import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { getOwnAccount } from "@/lib/queries/users";
import { AppShell } from "@/components/layout/app-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Read fresh from the DB rather than the session's JWT-cached name/avatar,
  // so an edit on the profile page shows up immediately after router.refresh()
  // instead of waiting for the next login.
  const account = await getOwnAccount(session.user.id);

  return (
    <AppShell role={session.user.role} userName={account?.name ?? session.user.name} avatarUrl={account?.avatarUrl}>
      {children}
    </AppShell>
  );
}
