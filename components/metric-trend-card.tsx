import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricTrendCardProps {
  label: string;
  value: string;
  changeLabel?: string;
  direction?: "up" | "down" | "flat";
  positiveIsGood?: boolean;
  className?: string;
}

export function MetricTrendCard({
  label,
  value,
  changeLabel,
  direction = "flat",
  positiveIsGood = true,
  className,
}: MetricTrendCardProps) {
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  const isGood = direction === "flat" ? null : direction === "up" ? positiveIsGood : !positiveIsGood;

  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card p-5 shadow-sm", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        {changeLabel ? (
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isGood === null && "bg-muted text-muted-foreground",
              isGood === true && "bg-success/15 text-success",
              isGood === false && "bg-destructive/10 text-destructive",
            )}
          >
            <Icon className="size-3" />
            {changeLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
