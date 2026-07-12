"use client";

import { AccountOverviewCard } from "@/components/profile/account-overview-card";
import { ChangePasswordCard } from "@/components/profile/change-password-card";
import { PatientDetailsCard } from "@/components/profile/patient-details-card";
import { DoctorDetailsCard } from "@/components/profile/doctor-details-card";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { OwnAccount } from "@/lib/queries/users";
import type { PatientProfile } from "@/lib/queries/patient-portal";
import type { DoctorProfile } from "@/lib/queries/doctors";

interface ProfileViewProps {
  account: OwnAccount;
  patient: PatientProfile | null;
  doctor: DoctorProfile | null;
}

export function ProfileView({ account, patient, doctor }: ProfileViewProps) {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("profile.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("profile.subtitle")}</p>
      </div>

      <AccountOverviewCard account={account} />
      {patient ? <PatientDetailsCard patient={patient} /> : null}
      {doctor ? <DoctorDetailsCard doctor={doctor} /> : null}
      <ChangePasswordCard />
    </div>
  );
}
