"use client";

import {
  Activity as ActivityIcon,
  CalendarClock,
  ClipboardList,
  KeyRound,
  Pill,
  Receipt,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatDateTime } from "@/lib/i18n/formatters";
import { cn } from "@/lib/utils";
import type { ActivityLogItem } from "@/lib/queries/activity-logs";

const MODULE_ICONS: Record<string, typeof ActivityIcon> = {
  Auth: KeyRound,
  Users: Users2,
  Departments: ShieldCheck,
  Doctors: Users2,
  Patients: Users2,
  Appointments: CalendarClock,
  Consultation: ClipboardList,
  "Medical Records": ClipboardList,
  "Vital Signs": ClipboardList,
  Prescriptions: Pill,
  Pharmacy: Pill,
  Inventory: Pill,
  Billing: Receipt,
};

interface ActivityFeedProps {
  items: ActivityLogItem[];
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function ActivityFeed({ items, emptyTitle, emptyDescription, className }: ActivityFeedProps) {
  const { locale, t } = useI18n();

  if (!items.length) {
    return (
      <EmptyState
        className={className}
        title={emptyTitle ?? t("dashboard.noActivity")}
        description={emptyDescription}
      />
    );
  }

  return (
    <ol className={cn("space-y-1", className)}>
      {items.map((item) => {
        const Icon = MODULE_ICONS[item.module] ?? ActivityIcon;
        return (
          <li key={item.id} className="flex gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/50">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">{item.description}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.user?.name ?? "System"} · {item.module} · {formatDateTime(item.createdAt, locale)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
