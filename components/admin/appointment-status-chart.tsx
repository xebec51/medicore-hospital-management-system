"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useI18n } from "@/lib/i18n/use-i18n";

const STATUS_COLOR_VAR: Record<string, string> = {
  SCHEDULED: "var(--info)",
  CHECKED_IN: "var(--info)",
  IN_CONSULTATION: "var(--clinical)",
  COMPLETED: "var(--success)",
  CANCELLED: "var(--destructive)",
  NO_SHOW: "var(--destructive)",
};

interface AppointmentStatusChartProps {
  data: { status: string; count: number }[];
}

export function AppointmentStatusChart({ data }: AppointmentStatusChartProps) {
  const { t } = useI18n();

  const chartData = data.map((d) => ({
    status: t(`status.AppointmentStatus.${d.status}`),
    count: d.count,
    fill: STATUS_COLOR_VAR[d.status] ?? "var(--muted-foreground)",
  }));

  const config: ChartConfig = { count: { label: "Appointments" } };

  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="status" tickLine={false} axisLine={false} fontSize={11} interval={0} angle={-15} textAnchor="end" height={50} />
        <YAxis tickLine={false} axisLine={false} fontSize={11} width={28} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {chartData.map((entry) => (
            <Cell key={entry.status} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
