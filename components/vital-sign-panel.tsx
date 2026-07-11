"use client";

import { Droplet, HeartPulse, Ruler, Thermometer, Weight, Wind } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatDateTime } from "@/lib/i18n/formatters";
import { cn } from "@/lib/utils";

type NumericDisplay = number | string | { toString(): string };

interface VitalSignEntry {
  id: string;
  patientLabel?: string | null;
  bloodPressure?: string | null;
  heartRate?: number | null;
  temperature?: NumericDisplay | null;
  weight?: NumericDisplay | null;
  height?: NumericDisplay | null;
  oxygenSaturation?: number | null;
  notes?: string | null;
  createdAt: Date | string;
  recordedByUser?: { name: string } | null;
}

export function VitalSignPanel({ entries, className }: { entries: VitalSignEntry[]; className?: string }) {
  const { locale, t } = useI18n();

  if (!entries.length) {
    return <EmptyState className={className} title={t("common.noData")} description="No vitals recorded yet." />;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-xl border border-border/70 bg-card p-3">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              {entry.patientLabel ? <span className="font-medium text-foreground">{entry.patientLabel}</span> : null}
              {formatDateTime(entry.createdAt, locale)}
            </span>
            {entry.recordedByUser ? <span>{entry.recordedByUser.name}</span> : null}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm sm:grid-cols-6">
            {entry.bloodPressure ? (
              <div className="flex items-center gap-1.5">
                <HeartPulse className="size-3.5 text-destructive" />
                {entry.bloodPressure}
              </div>
            ) : null}
            {entry.heartRate != null ? (
              <div className="flex items-center gap-1.5">
                <HeartPulse className="size-3.5 text-clinical" />
                {entry.heartRate} bpm
              </div>
            ) : null}
            {entry.temperature != null ? (
              <div className="flex items-center gap-1.5">
                <Thermometer className="size-3.5 text-warning" />
                {String(entry.temperature)}°C
              </div>
            ) : null}
            {entry.weight != null ? (
              <div className="flex items-center gap-1.5">
                <Weight className="size-3.5 text-info" />
                {String(entry.weight)} kg
              </div>
            ) : null}
            {entry.height != null ? (
              <div className="flex items-center gap-1.5">
                <Ruler className="size-3.5 text-info" />
                {String(entry.height)} cm
              </div>
            ) : null}
            {entry.oxygenSaturation != null ? (
              <div className="flex items-center gap-1.5">
                <Wind className="size-3.5 text-success" />
                {entry.oxygenSaturation}% SpO₂
              </div>
            ) : null}
          </div>
          {entry.notes ? (
            <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
              <Droplet className="mt-0.5 size-3 shrink-0" />
              {entry.notes}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
