"use client";

import { Activity } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg surface-gradient-primary text-white">
            <Activity className="size-4" />
          </span>
          <span className="text-sm font-semibold">{t("common.appName")}</span>
        </div>
        <p className="max-w-md text-center text-xs text-muted-foreground sm:text-right">
          {t("landing.footerTagline")}
        </p>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {year} MediCore. {t("landing.footerRights")}
      </div>
    </footer>
  );
}
