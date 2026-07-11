"use client";

import { CalendarClock, CheckCircle2, Clock, UserRound } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { ConsultationActionButton } from "@/components/doctor/consultation-action-button";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { DoctorAppointmentItem } from "@/lib/queries/doctor-workspace";

interface DoctorDashboardViewProps {
  todayAppointments: DoctorAppointmentItem[];
  completedToday: number;
  pendingToday: number;
  recentPatientsCount: number;
}

export function DoctorDashboardView({
  todayAppointments,
  completedToday,
  pendingToday,
  recentPatientsCount,
}: DoctorDashboardViewProps) {
  const { t } = useI18n();
  const c = "dashboardPages.doctor";

  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow={t(`${c}.eyebrow`)} title={t(`${c}.title`)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t(`${c}.stats.todayAppointments`)} value={todayAppointments.length} icon={CalendarClock} tone="info" />
        <StatCard label={t(`${c}.stats.completed`)} value={completedToday} icon={CheckCircle2} tone="success" />
        <StatCard label={t(`${c}.stats.pending`)} value={pendingToday} icon={Clock} tone="warning" />
        <StatCard label={t(`${c}.stats.recentPatients`)} value={recentPatientsCount} icon={UserRound} tone="primary" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">{t(`${c}.queueTitle`)}</h3>
        {todayAppointments.length ? (
          <div className="mt-4 space-y-2">
            {todayAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {appt.queueNumber}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{appt.patient.name}</p>
                    <p className="text-xs text-muted-foreground">{appt.patient.medicalRecordNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={appt.status} domain="AppointmentStatus" />
                  <ConsultationActionButton appointmentId={appt.id} status={appt.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState className="mt-4 py-12" title={t(`${c}.queueEmptyTitle`)} description={t(`${c}.queueEmptyDesc`)} />
        )}
      </div>
    </div>
  );
}
