"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n/use-i18n";
import { locales, localeLabels, localeShortLabels } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ variant = "ghost" }: { variant?: "ghost" | "outline" }) {
  const { locale, setLocale } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant={variant} size="sm" className="gap-1.5 px-2.5">
            <Globe className="size-4" />
            <span className="text-xs font-medium">{localeShortLabels[locale]}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-40">
        {locales.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLocale(code)}
            className={cn("justify-between", locale === code && "font-medium")}
          >
            {localeLabels[code]}
            {locale === code ? <span className="text-primary">•</span> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
