"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

export function PrintButton() {
  const { t } = useI18n();

  return (
    <Button variant="outline" size="sm" className="print:hidden" onClick={() => window.print()}>
      <Printer className="size-4" />
      {t("common.print")}
    </Button>
  );
}
