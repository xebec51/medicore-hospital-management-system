"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Pencil, Stethoscope, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateOwnDoctorBio } from "@/lib/actions/profile";
import { updateDoctorBioSchema } from "@/lib/validations/profile";
import { formatCurrency } from "@/lib/i18n/formatters";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { DoctorProfile } from "@/lib/queries/doctors";

const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

interface DoctorBioFormValues {
  bio: string;
}

export function DoctorDetailsCard({ doctor }: { doctor: DoctorProfile }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<DoctorBioFormValues>({
    resolver: zodResolver(updateDoctorBioSchema) as never,
    defaultValues: { bio: doctor.bio ?? "" },
  });

  async function onSubmit(values: DoctorBioFormValues) {
    const result = await updateOwnDoctorBio(values);
    if (result.success) {
      toast.success(t("profile.doctorDetailsUpdated"));
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
          <Stethoscope className="size-5" />
        </span>
        <div>
          <CardTitle>{t("profile.professionalInfo")}</CardTitle>
          <CardDescription>{doctor.specialization}</CardDescription>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("profile.bio")} <span className="text-muted-foreground">({t("common.optional")})</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} placeholder={t("profile.bioPlaceholder")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
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
      <CardContent className="space-y-4 border-t border-border/60 pt-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{t("nav.departments")}</p>
            <p>{doctor.department.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.roomNumber")}</p>
            <p>{doctor.roomNumber || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.licenseNumber")}</p>
            <p>{doctor.licenseNumber || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.consultationFee")}</p>
            <p>{formatCurrency(String(doctor.consultationFee), locale)}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t("profile.bio")}</p>
          <p className="whitespace-pre-line">{doctor.bio || "—"}</p>
        </div>
        {doctor.schedules.length > 0 ? (
          <div>
            <p className="mb-1.5 text-xs text-muted-foreground">{t("nav.schedules")}</p>
            <ul className="space-y-1">
              {doctor.schedules.map((slot) => (
                <li key={slot.dayOfWeek} className="flex items-center justify-between rounded-lg bg-muted/50 px-2.5 py-1.5">
                  <span>{t(`common.${DAY_KEYS[slot.dayOfWeek]}`)}</span>
                  <span className="text-muted-foreground">
                    {slot.startTime}–{slot.endTime} · {t("profile.quota", { quota: slot.quota })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
