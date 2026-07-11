"use client";

import { Code2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";
import { developerProfile } from "@/lib/constants/developer";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function DeveloperProfileCard() {
  const { t } = useI18n();

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-6 text-center sm:flex-row sm:items-center sm:text-left">
        <Avatar size="lg" className="shrink-0">
          <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
            {initials(developerProfile.name)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold tracking-tight">{developerProfile.name}</h2>
          <Badge variant="secondary" className="gap-1">
            <Code2 className="size-3" />
            {t("developer.fullStackDeveloper")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
