import {
  getAdminOverviewStats,
  getAppointmentStatusDistribution,
  getDepartmentWorkload,
  getRevenueTrend,
} from "@/lib/queries/admin-analytics";
import { listActivityLogs } from "@/lib/queries/activity-logs";
import { StatCard } from "@/components/stat-card";
import { ActivityFeed } from "@/components/activity-feed";
import { ExportButton } from "@/components/export-button";
import { AppointmentStatusChart } from "@/components/admin/appointment-status-chart";
import { DepartmentWorkloadChart } from "@/components/admin/department-workload-chart";
import { RevenueTrendChart } from "@/components/admin/revenue-trend-chart";
import { DateRangeFilterForm } from "@/components/admin/date-range-filter-form";
import { getStatusLabel } from "@/lib/domain/status-labels";
import { Users2, CalendarClock, Stethoscope, Wallet, Pill, Activity } from "lucide-react";

function parseDateRange(searchParams: { from?: string; to?: string }) {
  const to = searchParams.to ? new Date(`${searchParams.to}T23:59:59.999Z`) : new Date();
  const from = searchParams.from
    ? new Date(`${searchParams.from}T00:00:00.000Z`)
    : new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000);
  return { from, to };
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const { from, to } = parseDateRange(params);

  const [overview, statusDistribution, departmentWorkload, revenueTrend, recentActivity] = await Promise.all([
    getAdminOverviewStats(),
    getAppointmentStatusDistribution(from, to),
    getDepartmentWorkload(from, to),
    getRevenueTrend(from, to),
    listActivityLogs(10),
  ]);

  const statusExportRows = statusDistribution.map((s) => ({
    Status: getStatusLabel("AppointmentStatus", s.status),
    Count: s.count,
  }));
  const workloadExportRows = departmentWorkload.map((d) => ({ Department: d.department, Appointments: d.appointments }));
  const revenueExportRows = revenueTrend.map((r) => ({ Date: r.date, Revenue: r.revenue }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports & analytics</h1>
          <p className="text-sm text-muted-foreground">Hospital-wide operational overview.</p>
        </div>
        <DateRangeFilterForm defaultFrom={from} defaultTo={to} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total patients" value={overview.totalPatients} icon={Users2} tone="primary" />
        <StatCard label="Appointments today" value={overview.appointmentsToday} icon={CalendarClock} tone="info" />
        <StatCard label="Active doctors" value={overview.activeDoctors} icon={Stethoscope} tone="clinical" />
        <StatCard label="Revenue this month" value={overview.revenueThisMonth.toLocaleString()} icon={Wallet} tone="success" />
        <StatCard label="Pending prescriptions" value={overview.pendingPrescriptions} icon={Pill} tone="warning" />
        <StatCard label="Low stock medicines" value={overview.lowStockMedicines} icon={Activity} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold">Appointment status distribution</h3>
            <ExportButton data={statusExportRows} filename="medicore-appointment-status" sheetName="Status" />
          </div>
          <AppointmentStatusChart data={statusDistribution} />
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold">Department workload</h3>
            <ExportButton data={workloadExportRows} filename="medicore-department-workload" sheetName="Workload" />
          </div>
          <DepartmentWorkloadChart data={departmentWorkload} />
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold">Revenue trend</h3>
          <ExportButton data={revenueExportRows} filename="medicore-revenue-trend" sheetName="Revenue" />
        </div>
        <RevenueTrendChart data={revenueTrend} />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 className="mb-2 font-semibold">Recent activity</h3>
        <ActivityFeed items={recentActivity} />
      </div>
    </div>
  );
}
