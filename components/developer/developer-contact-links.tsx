"use client";

import { Briefcase, FolderGit2, Link2, Mail, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";
import { developerProfile } from "@/lib/constants/developer";

export function DeveloperContactLinks() {
  const { t } = useI18n();

  const links = [
    {
      href: developerProfile.repositoryUrl,
      label: t("developer.repository"),
      ariaLabel: t("developer.openRepository"),
      icon: FolderGit2,
    },
    {
      href: developerProfile.liveDemoUrl,
      label: t("developer.liveDemo"),
      ariaLabel: t("developer.openLiveDemo"),
      icon: Rocket,
    },
    {
      href: developerProfile.githubUrl,
      label: t("developer.github"),
      ariaLabel: t("developer.openGitHub"),
      icon: Link2,
    },
    {
      href: developerProfile.linkedinUrl,
      label: t("developer.linkedin"),
      ariaLabel: t("developer.openLinkedIn"),
      icon: Briefcase,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("developer.contact")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Button
            key={link.href}
            variant="outline"
            size="sm"
            render={<a href={link.href} target="_blank" rel="noreferrer" aria-label={link.ariaLabel} />}
          >
            <link.icon className="size-4" />
            {link.label}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          render={<a href={`mailto:${developerProfile.email}`} aria-label={t("developer.sendEmail")} />}
        >
          <Mail className="size-4" />
          {t("developer.email")}
        </Button>
      </CardContent>
    </Card>
  );
}
