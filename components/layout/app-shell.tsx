import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import type { AppRole } from "@/lib/constants/roles";

interface AppShellProps {
  role: AppRole;
  userName: string;
  title?: string;
  children: React.ReactNode;
}

export function AppShell({ role, userName, title, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-screen">
          <DashboardSidebar role={role} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader role={role} userName={userName} title={title} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
