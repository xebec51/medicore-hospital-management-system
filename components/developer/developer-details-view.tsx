"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeveloperProfileCard } from "@/components/developer/developer-profile-card";
import { ProjectContextCard } from "@/components/developer/project-context-card";
import { DeveloperContactLinks } from "@/components/developer/developer-contact-links";
import { useI18n } from "@/lib/i18n/use-i18n";

export function DeveloperDetailsView() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("developer.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("developer.subtitle")}</p>
      </div>

      <DeveloperProfileCard />
      <ProjectContextCard />
      <DeveloperContactLinks />

      <Button variant="ghost" size="sm" render={<Link href="/dashboard" />}>
        <ArrowLeft className="size-4" />
        {t("developer.backToDashboard")}
      </Button>
    </div>
  );
}
