"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { HeartPulse, Loader2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateOwnPatientDetails } from "@/lib/actions/profile";
import { updatePatientSelfSchema } from "@/lib/validations/profile";
import { bloodTypeLabels } from "@/lib/constants/patient-options";
import { formatDate } from "@/lib/i18n/formatters";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { PatientProfile } from "@/lib/queries/patient-portal";

interface PatientFormValues {
  phone: string;
  email: string;
  address: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export function PatientDetailsCard({ patient }: { patient: PatientProfile }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(updatePatientSelfSchema) as never,
    defaultValues: {
      phone: patient.phone ?? "",
      email: patient.email ?? "",
      address: patient.address ?? "",
      allergies: patient.allergies ?? "",
      emergencyContactName: patient.emergencyContactName ?? "",
      emergencyContactPhone: patient.emergencyContactPhone ?? "",
    },
  });

  async function onSubmit(values: PatientFormValues) {
    const result = await updateOwnPatientDetails(values);
    if (result.success) {
      toast.success(t("profile.patientDetailsUpdated"));
      setIsEditing(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const header = (
    <CardHeader className="flex-row items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HeartPulse className="size-5" />
        </span>
        <div>
          <CardTitle>{t("profile.medicalInfo")}</CardTitle>
          <CardDescription>{patient.medicalRecordNumber}</CardDescription>
        </div>
      </div>
      {!isEditing ? (
        <Button variant="outline" size="icon-sm" aria-label={t("common.edit")} onClick={() => setIsEditing(true)}>
          <Pencil className="size-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("common.cancel")}
          onClick={() => {
            form.reset();
            setIsEditing(false);
          }}
        >
          <X className="size-4" />
        </Button>
      )}
    </CardHeader>
  );

  if (isEditing) {
    return (
      <Card>
        {header}
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("common.phone")} <span className="text-muted-foreground">({t("common.optional")})</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+62 812 3456 7890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("common.email")} <span className="text-muted-foreground">({t("common.optional")})</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>
                      {t("common.address")} <span className="text-muted-foreground">({t("common.optional")})</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>
                      {t("common.allergies")} <span className="text-muted-foreground">({t("common.optional")})</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} placeholder="Penicillin, shellfish, …" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("profile.emergencyContactName")}{" "}
                      <span className="text-muted-foreground">({t("common.optional")})</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("profile.emergencyContactPhone")}{" "}
                      <span className="text-muted-foreground">({t("common.optional")})</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+62 812 3456 7890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 sm:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setIsEditing(false);
                  }}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  {t("common.save")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {header}
      <CardContent className="space-y-3 border-t border-border/60 pt-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{t("common.gender")}</p>
            <p>{t(`common.${patient.gender.toLowerCase()}`)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.birthDate")}</p>
            <p>{formatDate(patient.birthDate, locale)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("common.bloodType")}</p>
            <p>{bloodTypeLabels[patient.bloodType]}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("common.phone")}</p>
            <p>{patient.phone || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("common.email")}</p>
            <p>{patient.email || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("common.address")}</p>
            <p>{patient.address || "—"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">{t("common.allergies")}</p>
            <p>{patient.allergies || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.emergencyContactName")}</p>
            <p>{patient.emergencyContactName || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.emergencyContactPhone")}</p>
            <p>{patient.emergencyContactPhone || "—"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
