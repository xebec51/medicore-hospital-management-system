"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface DepartmentWorkloadChartProps {
  data: { department: string; appointments: number }[];
}

const config: ChartConfig = { appointments: { label: "Appointments", color: "var(--chart-1)" } };

export function DepartmentWorkloadChart({ data }: DepartmentWorkloadChartProps) {
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="department"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          width={110}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="appointments" fill="var(--color-appointments)" radius={[0, 4, 4, 0]} maxBarSize={22} />
      </BarChart>
    </ChartContainer>
  );
}
