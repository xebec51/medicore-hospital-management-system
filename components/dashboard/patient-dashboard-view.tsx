"use client";

import Link from "next/link";
import { CalendarClock, ClipboardList, Pill, Receipt } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatDateTime } from "@/lib/i18n/formatters";
import type { OwnAppointmentItem } from "@/lib/queries/patient-portal";

interface PatientDashboardViewProps {
  medicalRecordsCount: number;
  activePrescriptionsCount: number;
  unpaidInvoicesCount: number;
  upcomingAppointment: OwnAppointmentItem | null;
}

export function PatientDashboardView({
  medicalRecordsCount,
  activePrescriptionsCount,
  unpaidInvoicesCount,
  upcomingAppointment,
}: PatientDashboardViewProps) {
  const { locale, t } = useI18n();
  const c = "dashboardPages.patient";

  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow={t(`${c}.eyebrow`)} title={t(`${c}.title`)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t(`${c}.stats.upcomingAppointments`)}
          value={upcomingAppointment ? 1 : 0}
          icon={CalendarClock}
          tone="info"
        />
        <StatCard label={t(`${c}.stats.medicalRecords`)} value={medicalRecordsCount} icon={ClipboardList} tone="primary" />
        <StatCard label={t(`${c}.stats.activePrescriptions`)} value={activePrescriptionsCount} icon={Pill} tone="clinical" />
        <StatCard label={t(`${c}.stats.unpaidInvoices`)} value={unpaidInvoicesCount} icon={Receipt} tone="warning" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">{t(`${c}.upcomingTitle`)}</h3>
        {upcomingAppointment ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3">
            <div>
              <p className="font-medium">
                {upcomingAppointment.doctor.user.name} · {upcomingAppointment.doctor.specialization}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(upcomingAppointment.appointmentDate, locale)} · {upcomingAppointment.department.name}
              </p>
            </div>
            <StatusBadge status={upcomingAppointment.status} domain="AppointmentStatus" />
          </div>
        ) : (
          <EmptyState
            className="mt-4 py-12"
            title={t(`${c}.upcomingEmptyTitle`)}
            description={t(`${c}.upcomingEmptyDesc`)}
            action={
              <Button size="sm" variant="outline" render={<Link href="/dashboard/patient/appointments" />}>
                {t("nav.appointments")}
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
