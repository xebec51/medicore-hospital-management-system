"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

export function CtaSection() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="surface-gradient-primary relative overflow-hidden rounded-3xl px-8 py-14 text-center text-white shadow-lg sm:px-16">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{t("landing.heroTitle")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/85">{t("landing.heroSubtitle")}</p>
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="h-11 bg-white px-6 text-primary hover:bg-white/90"
            render={<Link href="/login" />}
          >
            {t("landing.ctaPrimary")}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
