"use client";

import { Mail, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { AppRole } from "@/lib/constants/roles";

interface ProfileViewProps {
  name: string;
  email: string;
  role: AppRole;
}

export function ProfileView({ name, email, role }: ProfileViewProps) {
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
          <div>
            <CardTitle>{name}</CardTitle>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="size-3.5" />
              {email}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between border-t border-border/60 pt-4 text-sm">
          <span className="text-muted-foreground">{t("profile.role")}</span>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {t(`roles.${role}`)}
          </span>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">{t("profile.editingNotice")}</p>
    </div>
  );
}
