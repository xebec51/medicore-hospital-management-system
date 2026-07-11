"use client";

import { CalendarClock, ListOrdered, Stethoscope, UserRound } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { AppointmentTimeline } from "@/components/appointment-timeline";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { AppointmentListItem } from "@/lib/queries/appointments";

interface ReceptionistDashboardViewProps {
  todayAppointments: AppointmentListItem[];
  checkedInCount: number;
  inQueueCount: number;
  doctorsAvailableToday: number;
  totalActiveDoctors: number;
}

export function ReceptionistDashboardView({
  todayAppointments,
  checkedInCount,
  inQueueCount,
  doctorsAvailableToday,
  totalActiveDoctors,
}: ReceptionistDashboardViewProps) {
  const { t } = useI18n();
  const c = "dashboardPages.receptionist";

  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow={t(`${c}.eyebrow`)} title={t(`${c}.title`)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t(`${c}.stats.checkedInPatients`)} value={checkedInCount} icon={UserRound} tone="info" />
        <StatCard
          label={t(`${c}.stats.scheduledToday`)}
          value={todayAppointments.length}
          icon={CalendarClock}
          tone="primary"
        />
        <StatCard label={t(`${c}.stats.inQueue`)} value={inQueueCount} icon={ListOrdered} tone="warning" />
        <StatCard
          label={t(`${c}.stats.doctorsAvailable`)}
          value={`${doctorsAvailableToday} / ${totalActiveDoctors}`}
          icon={Stethoscope}
          tone="clinical"
        />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">{t(`${c}.timelineTitle`)}</h3>
        <AppointmentTimeline
          className="mt-4 max-h-112 overflow-y-auto"
          appointments={todayAppointments}
          emptyTitle={t(`${c}.timelineEmptyTitle`)}
          emptyDescription={t(`${c}.timelineEmptyDesc`)}
        />
      </div>
    </div>
  );
}
