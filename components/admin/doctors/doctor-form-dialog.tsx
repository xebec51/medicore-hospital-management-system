"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
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
import { createDoctor, updateDoctor } from "@/lib/actions/doctors";
import { createDoctorSchema, updateDoctorSchema } from "@/lib/validations/doctor";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { DoctorListItem } from "@/lib/queries/doctors";

interface DoctorFormDialogProps {
  doctor?: DoctorListItem;
  departments: { id: string; name: string }[];
  trigger?: React.ReactElement;
}

export function DoctorFormDialog({ doctor, departments, trigger }: DoctorFormDialogProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const isEdit = !!doctor;

  interface DoctorFormValues {
    id?: string;
    name: string;
    email: string;
    password?: string;
    departmentId: string;
    specialization: string;
    licenseNumber?: string;
    consultationFee: number;
    bio?: string;
    roomNumber?: string;
  }

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(isEdit ? updateDoctorSchema : createDoctorSchema) as never,
    defaultValues: isEdit
      ? {
          id: doctor.id,
          name: doctor.user.name,
          email: doctor.user.email,
          departmentId: doctor.department.id,
          specialization: doctor.specialization,
          licenseNumber: doctor.licenseNumber ?? "",
          consultationFee: Number(doctor.consultationFee),
          bio: "",
          roomNumber: doctor.roomNumber ?? "",
        }
      : {
          name: "",
          email: "",
          password: "",
          departmentId: departments[0]?.id ?? "",
          specialization: "",
          licenseNumber: "",
          consultationFee: 100000,
          bio: "",
          roomNumber: "",
        },
  });

  async function onSubmit(values: DoctorFormValues) {
    const result = isEdit ? await updateDoctor(values) : await createDoctor(values);
    if (result.success) {
      toast.success(isEdit ? "Doctor updated" : "Doctor added");
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
              <Plus className="size-4" />
              {t("common.add")}
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit doctor" : "Add doctor"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this doctor's profile." : "Create a doctor account and clinical profile."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="dr. Jane Doe" />
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
                  <FormLabel>{t("common.email")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="jane@medicore.demo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEdit && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>{t("auth.password")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="At least 8 characters" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nav.department")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
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
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Cardiologist" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    License number <span className="text-muted-foreground">({t("common.optional")})</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="STR-0001-2020" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consultationFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation fee (IDR)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} step={1000} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Room number <span className="text-muted-foreground">({t("common.optional")})</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="101" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>
                    Bio <span className="text-muted-foreground">({t("common.optional")})</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} placeholder="Short professional background" />
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
