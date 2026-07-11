"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPatient, updatePatient } from "@/lib/actions/patients";
import { createPatientSchema, updatePatientSchema } from "@/lib/validations/patient";
import { BLOOD_TYPES, GENDERS, bloodTypeLabels } from "@/lib/constants/patient-options";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { PatientListItem } from "@/lib/queries/patients";

interface PatientFormValues {
  id?: string;
  name: string;
  gender: (typeof GENDERS)[number];
  birthDate: string;
  phone?: string;
  email?: string;
  address?: string;
  bloodType: (typeof BLOOD_TYPES)[number];
  allergies?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

interface PatientFormDialogProps {
  patient?: PatientListItem;
  trigger?: React.ReactElement;
}

export function PatientFormDialog({ patient, trigger }: PatientFormDialogProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const isEdit = !!patient;

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(isEdit ? updatePatientSchema : createPatientSchema) as never,
    defaultValues: isEdit
      ? {
          id: patient.id,
          name: patient.name,
          gender: patient.gender,
          birthDate: new Date(patient.birthDate).toISOString().slice(0, 10),
          phone: patient.phone ?? "",
          email: patient.email ?? "",
          address: patient.address ?? "",
          bloodType: patient.bloodType,
          allergies: patient.allergies ?? "",
          emergencyContactName: patient.emergencyContactName ?? "",
          emergencyContactPhone: patient.emergencyContactPhone ?? "",
        }
      : {
          name: "",
          gender: "MALE",
          birthDate: "",
          phone: "",
          email: "",
          address: "",
          bloodType: "UNKNOWN",
          allergies: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
        },
  });

  async function onSubmit(values: PatientFormValues) {
    const result = isEdit ? await updatePatient(values) : await createPatient(values);
    if (result.success) {
      toast.success(isEdit ? "Patient updated" : "Patient registered");
      setOpen(false);
      form.reset();
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}
    >
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm">
              <UserPlus className="size-4" />
              Register patient
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit patient" : "Register patient"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this patient's profile." : "Create a new patient record with a medical record number."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>{t("common.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jane Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.gender")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDERS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {t(`common.${g.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="bloodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.bloodType")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BLOOD_TYPES.map((bt) => (
                        <SelectItem key={bt} value={bt}>
                          {bloodTypeLabels[bt]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Input {...field} type="email" placeholder="jane@example.com" />
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
                    <Input {...field} placeholder="Street, city" />
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
                    Emergency contact <span className="text-muted-foreground">({t("common.optional")})</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contact name" />
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
                    Contact phone <span className="text-muted-foreground">({t("common.optional")})</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+62 812 3456 7890" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                {t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
