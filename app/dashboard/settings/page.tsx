"use client";

import { Languages } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function SettingsPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("nav.settings")}</h1>
        <p className="text-sm text-muted-foreground">Configure your MediCore workspace preferences.</p>
      </div>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Languages className="size-5" />
            </span>
            <div>
              <CardTitle>Language</CardTitle>
              <CardDescription>Choose your preferred display language.</CardDescription>
            </div>
          </div>
          <LanguageSwitcher variant="outline" />
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Your selection is saved to this device and applied across the entire MediCore workspace.
        </CardContent>
      </Card>
    </div>
  );
}
