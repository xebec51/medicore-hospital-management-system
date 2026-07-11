"use client";

import { CalendarClock, ClipboardList, Pill, Receipt } from "lucide-react";
import { RoleDashboardHero } from "@/components/role-dashboard-hero";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { useI18n } from "@/lib/i18n/use-i18n";

// TODO(phase-12): connect to the patient's own appointments, records, prescriptions, and invoices.
export default function PatientDashboardPage() {
  const { t } = useI18n();
  const c = "dashboardPages.patient";

  return (
    <div className="space-y-6">
      <RoleDashboardHero eyebrow={t(`${c}.eyebrow`)} title={t(`${c}.title`)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t(`${c}.stats.upcomingAppointments`)} value="1" icon={CalendarClock} tone="info" />
        <StatCard label={t(`${c}.stats.medicalRecords`)} value="4" icon={ClipboardList} tone="primary" />
        <StatCard label={t(`${c}.stats.activePrescriptions`)} value="2" icon={Pill} tone="clinical" />
        <StatCard label={t(`${c}.stats.unpaidInvoices`)} value="1" icon={Receipt} tone="warning" />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="font-semibold">{t(`${c}.upcomingTitle`)}</h3>
        <EmptyState
          className="mt-4 py-12"
          title={t(`${c}.upcomingEmptyTitle`)}
          description={t(`${c}.upcomingEmptyDesc`)}
        />
      </div>
    </div>
  );
}
