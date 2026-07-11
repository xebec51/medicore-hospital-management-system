"use client";

import { UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

// TODO(phase-6): populate from the authenticated user's profile.
export default function ProfilePage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("profile.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("profile.subtitle")}</p>
      </div>
      <Card>
        <CardHeader className="flex-row items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound className="size-6" />
          </span>
          <CardTitle>Demo User</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{t("profile.editingNotice")}</CardContent>
      </Card>
    </div>
  );
}
