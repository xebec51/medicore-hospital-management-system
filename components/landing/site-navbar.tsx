"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n/use-i18n";

export function SiteNavbar() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-sidebar-border bg-sidebar/95 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg surface-gradient-primary text-white">
            <Activity className="size-4.5" />
          </span>
          <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
            {t("common.appName")}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-sidebar-foreground/65 md:flex">
          <Link href="#modules" className="transition-colors hover:text-sidebar-foreground">
            {t("landing.navModules")}
          </Link>
          <Link href="#workflow" className="transition-colors hover:text-sidebar-foreground">
            {t("landing.navWorkflow")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher
            variant="ghost"
            className="text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground"
          />
          <Button size="sm" render={<Link href="/login" />}>
            {t("landing.navSignIn")}
          </Button>
        </div>
      </div>
    </header>
  );
}
