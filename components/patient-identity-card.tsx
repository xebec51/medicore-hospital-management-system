"use client";

import { Droplet, Phone, TriangleAlert, UserRound } from "lucide-react";
import { calculateAge } from "@/lib/domain/dates";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatDate } from "@/lib/i18n/formatters";
import { cn } from "@/lib/utils";

interface PatientIdentityCardProps {
  patient: {
    name: string;
    medicalRecordNumber: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    birthDate: Date | string;
    bloodType: string;
    phone?: string | null;
    allergies?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
  };
  className?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function PatientIdentityCard({ patient, className }: PatientIdentityCardProps) {
  const { locale, t } = useI18n();
  const birthDate = typeof patient.birthDate === "string" ? new Date(patient.birthDate) : patient.birthDate;
  const age = calculateAge(birthDate);
  const genderLabel = t(`common.${patient.gender.toLowerCase()}`);

  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card p-5 shadow-sm", className)}>
      <div className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
          {initials(patient.name) || <UserRound className="size-5" />}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{patient.name}</p>
          <p className="text-xs text-muted-foreground">{patient.medicalRecordNumber}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {genderLabel} · {age} yo · {formatDate(birthDate, locale)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          <Droplet className="size-3.5 text-destructive" />
          {patient.bloodType.replace("_", " ")}
        </span>
        {patient.phone ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
            <Phone className="size-3.5" />
            {patient.phone}
          </span>
        ) : null}
      </div>

      {patient.allergies ? (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
          <span>
            <span className="font-medium">{t("common.allergies")}: </span>
            {patient.allergies}
          </span>
        </div>
      ) : null}

      {patient.emergencyContactName ? (
        <div className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">{t("common.emergencyContact")}</p>
          <p>
            {patient.emergencyContactName}
            {patient.emergencyContactPhone ? ` · ${patient.emergencyContactPhone}` : ""}
          </p>
        </div>
      ) : null}
    </div>
  );
}
