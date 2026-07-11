"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Activity, CalendarClock, Pill, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden surface-gradient-hero">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
        <div className="space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-success" />
            {t("landing.badge")}
          </span>
          <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
            {t("landing.heroTitle")}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground text-pretty">{t("landing.heroSubtitle")}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" className="h-11 px-5" render={<Link href="/login" />}>
              {t("landing.ctaPrimary")}
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-5" render={<Link href="#modules" />}>
              {t("landing.ctaSecondary")}
            </Button>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-card/60 p-3.5 text-sm text-muted-foreground backdrop-blur">
            <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-clinical" />
            <p>{t("landing.trustBadge")}</p>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="surface-glass relative mx-auto w-full max-w-md rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg surface-gradient-primary text-white">
                  <Activity className="size-4" />
                </span>
                <span className="text-sm font-semibold">Command Center</span>
              </div>
              <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">Live</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/60 bg-card p-3">
                <CalendarClock className="size-4 text-info" />
                <p className="mt-2 text-xl font-semibold">128</p>
                <p className="text-xs text-muted-foreground">Appointments today</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-3">
                <Pill className="size-4 text-clinical" />
                <p className="mt-2 text-xl font-semibold">42</p>
                <p className="text-xs text-muted-foreground">Prescriptions pending</p>
              </div>
              <div className="col-span-2 rounded-xl border border-border/60 bg-card p-3">
                <div className="flex items-center justify-between">
                  <Receipt className="size-4 text-success" />
                  <span className="text-xs font-medium text-success">+12.4%</span>
                </div>
                <p className="mt-2 text-xl font-semibold">Rp 84.2M</p>
                <p className="text-xs text-muted-foreground">Revenue this month</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-8 -right-6 -z-10 size-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 -z-10 size-64 rounded-full bg-clinical/15 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
