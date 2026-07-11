"use client";

import { useI18n } from "@/lib/i18n/use-i18n";

export function TrustMetrics() {
  const { t } = useI18n();

  const metrics = [
    { value: "99.9%", label: t("landing.metrics.uptime") },
    { value: "7", label: t("landing.metrics.roles") },
    { value: "14+", label: t("landing.metrics.modules") },
    { value: "2", label: t("landing.metrics.languages") },
  ];

  return (
    <section className="border-y border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <p className="text-3xl font-semibold tracking-tight text-primary">{metric.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
