"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function UnauthorizedPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 surface-gradient-hero px-4 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <ShieldAlert className="size-7" />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">{t("auth.unauthorizedTitle")}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{t("auth.unauthorizedMessage")}</p>
      <div className="flex gap-3">
        <Button variant="outline" render={<Link href="/" />}>
          {t("common.goHome")}
        </Button>
        <Button render={<Link href="/dashboard" />}>{t("auth.backToDashboard")}</Button>
      </div>
    </div>
  );
}
