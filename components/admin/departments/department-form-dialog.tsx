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
import { createDepartment, updateDepartment } from "@/lib/actions/departments";
import { createDepartmentSchema, updateDepartmentSchema } from "@/lib/validations/department";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { DepartmentListItem } from "@/lib/queries/departments";

interface DepartmentFormDialogProps {
  department?: DepartmentListItem;
  trigger?: React.ReactElement;
}

export function DepartmentFormDialog({ department, trigger }: DepartmentFormDialogProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const isEdit = !!department;

  const form = useForm<{ id?: string; name: string; description?: string; location?: string }>({
    resolver: zodResolver(isEdit ? updateDepartmentSchema : createDepartmentSchema) as never,
    defaultValues: isEdit
      ? {
          id: department.id,
          name: department.name,
          description: department.description ?? "",
          location: department.location ?? "",
        }
      : { name: "", description: "", location: "" },
  });

  async function onSubmit(values: Record<string, unknown>) {
    const result = isEdit ? await updateDepartment(values) : await createDepartment(values);
    if (result.success) {
      toast.success(isEdit ? "Department updated" : "Department created");
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit department" : "Add department"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this department's details." : "Create a new hospital department."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Cardiology" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("common.address")} <span className="text-muted-foreground">({t("common.optional")})</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Building A, 1st Floor" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("common.description")} <span className="text-muted-foreground">({t("common.optional")})</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="What this department handles" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
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
