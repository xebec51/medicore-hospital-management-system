import { AppShell } from "@/components/layout/app-shell";
import type { AppRole } from "@/lib/constants/roles";

// TODO(phase-6): replace with the authenticated session's role/name from NextAuth.
const PLACEHOLDER_SESSION: { role: AppRole; name: string } = {
  role: "ADMIN",
  name: "Demo User",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell role={PLACEHOLDER_SESSION.role} userName={PLACEHOLDER_SESSION.name}>
      {children}
    </AppShell>
  );
}
