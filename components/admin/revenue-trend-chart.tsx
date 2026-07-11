"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatCurrency, formatDate } from "@/lib/i18n/formatters";

interface RevenueTrendChartProps {
  data: { date: string; revenue: number }[];
}

const config: ChartConfig = { revenue: { label: "Revenue", color: "var(--chart-1)" } };

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  const { locale } = useI18n();

  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          tickFormatter={(value: string) => formatDate(value, locale, "d MMM")}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={11}
          width={56}
          tickFormatter={(value: number) => formatCurrency(value, locale)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatDate(String(value), locale, "d MMM yyyy")}
              formatter={(value) => [formatCurrency(Number(value), locale), "Revenue"]}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-revenue)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
