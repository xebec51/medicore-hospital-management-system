"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { RoleAwareNav } from "./role-aware-nav";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { AppRole } from "@/lib/constants/roles";

interface DashboardSidebarProps {
  role: AppRole;
  onNavigate?: () => void;
  className?: string;
}

export function DashboardSidebar({ role, onNavigate }: DashboardSidebarProps) {
  const { t } = useI18n();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <span className="flex size-9 items-center justify-center rounded-xl surface-gradient-primary text-white shadow-sm">
          <Activity className="size-5" />
        </span>
        <div className="min-w-0">
          <Link href="/" className="block truncate text-base font-semibold tracking-tight">
            MediCore
          </Link>
          <p className="truncate text-xs text-sidebar-foreground/60">{t(`roles.${role}`)}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <RoleAwareNav role={role} onNavigate={onNavigate} />
      </div>
      <div className="border-t border-sidebar-border px-5 py-4">
        <p className="text-[11px] leading-snug text-sidebar-foreground/50">
          MediCore Hospital Management System — operational platform, not a diagnostic tool.
        </p>
        <Link
          href="/dashboard/developer"
          onClick={onNavigate}
          className="mt-2 inline-block text-[11px] font-medium text-sidebar-foreground/60 underline-offset-2 hover:text-sidebar-foreground hover:underline"
        >
          {t("developer.sidebarLink")}
        </Link>
      </div>
    </div>
  );
}
