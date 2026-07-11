"use client";

import Link from "next/link";
import { Activity, CalendarClock, Pill, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";

export function LoginSidePanel() {
  const { t } = useI18n();

  return (
    <div className="relative hidden flex-col justify-between overflow-hidden surface-gradient-primary p-10 text-white lg:flex">
      <div className="pointer-events-none absolute -top-32 -right-20 size-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-white/10 blur-3xl" />

      <Link href="/" className="relative flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
          <Activity className="size-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight">{t("common.appName")}</span>
      </Link>

      <div className="relative space-y-6">
        <h2 className="max-w-md text-3xl font-semibold tracking-tight text-balance">{t("auth.sideTitle")}</h2>
        <p className="max-w-sm text-white/85">{t("auth.sideSubtitle")}</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
            <CalendarClock className="size-4.5 shrink-0" />
            <span className="text-sm">{t("auth.sideFeatures.queue")}</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
            <Pill className="size-4.5 shrink-0" />
            <span className="text-sm">{t("auth.sideFeatures.pharmacy")}</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
            <ShieldCheck className="size-4.5 shrink-0" />
            <span className="text-sm">{t("auth.sideFeatures.rbac")}</span>
          </div>
        </div>
      </div>

      <p className="relative text-xs text-white/70">{t("landing.footerTagline")}</p>
    </div>
  );
}
