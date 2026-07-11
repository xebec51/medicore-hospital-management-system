"use client";

import { BarChart3, CalendarClock, Pill, Receipt, Stethoscope, UserPlus } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";

const modules = [
  { key: "registration", icon: UserPlus, tone: "bg-info/15 text-info" },
  { key: "queue", icon: CalendarClock, tone: "bg-primary/10 text-primary" },
  { key: "consultation", icon: Stethoscope, tone: "bg-clinical/15 text-clinical" },
  { key: "pharmacy", icon: Pill, tone: "bg-success/15 text-success" },
  { key: "billing", icon: Receipt, tone: "bg-warning/20 text-warning-foreground" },
  { key: "analytics", icon: BarChart3, tone: "bg-primary/10 text-primary" },
] as const;

export function ModulesGrid() {
  const { t } = useI18n();

  return (
    <section id="modules" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight">{t("landing.modulesTitle")}</h2>
        <p className="mt-3 text-muted-foreground">{t("landing.modulesSubtitle")}</p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(({ key, icon: Icon, tone }) => (
          <div
            key={key}
            className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 font-semibold">{t(`landing.modules.${key}.title`)}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{t(`landing.modules.${key}.description`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
