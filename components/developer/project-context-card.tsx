"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/use-i18n";
import { developerTechStack } from "@/lib/constants/developer";

export function ProjectContextCard() {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("developer.projectSummary")}</CardTitle>
        <CardDescription>{t("developer.portfolioNote")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{t("developer.techStack")}</p>
        <div className="flex flex-wrap gap-1.5">
          {developerTechStack.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
