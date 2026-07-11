"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

interface ExportButtonProps {
  data: Record<string, string | number>[];
  filename: string;
  sheetName?: string;
  disabled?: boolean;
}

export function ExportButton({ data, filename, sheetName = "Sheet1", disabled }: ExportButtonProps) {
  const { t } = useI18n();

  // xlsx is a large library only needed once the user actually exports, so it's
  // loaded on demand instead of being bundled into every page that renders this button.
  async function handleExport() {
    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={disabled || data.length === 0}>
      <Download className="size-4" />
      {t("common.exportXlsx")}
    </Button>
  );
}
