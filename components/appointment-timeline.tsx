"use client";

import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatDate } from "@/lib/i18n/formatters";
import { cn } from "@/lib/utils";

interface TimelineAppointment {
  id: string;
  appointmentCode: string;
  appointmentDate: Date | string;
  status: string;
  reason?: string | null;
  doctor: { specialization: string; user: { name: string } };
  department: { name: string };
}

export function AppointmentTimeline({
  appointments,
  emptyTitle,
  emptyDescription,
  className,
}: {
  appointments: TimelineAppointment[];
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}) {
  const { locale, t } = useI18n();

  if (!appointments.length) {
    return <EmptyState className={className} title={emptyTitle ?? t("common.noData")} description={emptyDescription} />;
  }

  return (
    <ol className={cn("relative space-y-5 border-l border-border/70 pl-5", className)}>
      {appointments.map((appt) => (
        <li key={appt.id} className="relative">
          <span className="absolute top-1 -left-[26px] size-2.5 rounded-full border-2 border-background bg-primary" />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">{formatDate(appt.appointmentDate, locale, "d MMM yyyy, HH:mm")}</p>
            <StatusBadge status={appt.status} domain="AppointmentStatus" />
          </div>
          <p className="text-sm text-muted-foreground">
            {appt.doctor.user.name} · {appt.doctor.specialization} · {appt.department.name}
          </p>
          {appt.reason ? <p className="mt-1 text-xs text-muted-foreground">{appt.reason}</p> : null}
        </li>
      ))}
    </ol>
  );
}
