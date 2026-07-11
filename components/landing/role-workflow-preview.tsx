"use client";

import { useI18n } from "@/lib/i18n/use-i18n";
import { roleIcons } from "@/lib/constants/role-icons";
import type { AppRole } from "@/lib/constants/roles";

const roleOrder: AppRole[] = ["ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACIST", "CASHIER", "PATIENT"];

export function RoleWorkflowPreview() {
  const { t } = useI18n();

  return (
    <section id="workflow" className="scroll-mt-16 bg-card/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">{t("landing.workflowTitle")}</h2>
          <p className="mt-3 text-muted-foreground">{t("landing.workflowSubtitle")}</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roleOrder.map((role) => {
            const Icon = roleIcons[role];
            return (
              <div
                key={role}
                className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{t(`roles.${role}`)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`landing.roleDescriptions.${role}`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
