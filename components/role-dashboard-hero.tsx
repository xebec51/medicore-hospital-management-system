"use client";

import { useI18n } from "@/lib/i18n/use-i18n";
import { formatDate } from "@/lib/i18n/formatters";
import { cn } from "@/lib/utils";

interface RoleDashboardHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function RoleDashboardHero({ eyebrow, title, subtitle, actions, className }: RoleDashboardHeroProps) {
  const { locale, t } = useI18n();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 surface-gradient-hero p-6 sm:p-8",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-clinical/10 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium tracking-wide text-primary uppercase">
            {eyebrow}
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          {/* suppressHydrationWarning: this falls back to "today", which can legitimately
              differ by a few seconds (or across a midnight boundary) between the server
              render and client hydration -- an expected, benign mismatch, not a bug. */}
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            {subtitle ?? `${t("dashboard.todayIs")} ${formatDate(new Date(), locale, "long")}`}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
