"use client";

import Link from "next/link";
import { Code2, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function SettingsPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("settingsPage.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("settingsPage.subtitle")}</p>
      </div>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Languages className="size-5" />
            </span>
            <div>
              <CardTitle>{t("settingsPage.languageTitle")}</CardTitle>
              <CardDescription>{t("settingsPage.languageDescription")}</CardDescription>
            </div>
          </div>
          <LanguageSwitcher variant="outline" />
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{t("settingsPage.languageNotice")}</CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Code2 className="size-5" />
            </span>
            <div>
              <CardTitle>{t("settingsPage.aboutTitle")}</CardTitle>
              <CardDescription>{t("settingsPage.aboutDescription")}</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/dashboard/developer" />}>
            {t("settingsPage.viewDeveloperDetails")}
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
