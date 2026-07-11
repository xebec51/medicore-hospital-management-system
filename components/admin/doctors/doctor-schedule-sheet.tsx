"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarDays, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { addDoctorSchedule, removeDoctorSchedule } from "@/lib/actions/doctors";
import { doctorScheduleSchema } from "@/lib/validations/doctor";
import type { DoctorListItem } from "@/lib/queries/doctors";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function DoctorScheduleSheet({ doctor, trigger }: { doctor: DoctorListItem; trigger: React.ReactElement }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  interface ScheduleFormValues {
    doctorId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    quota: number;
  }

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(doctorScheduleSchema) as never,
    defaultValues: { doctorId: doctor.id, dayOfWeek: 1, startTime: "08:00", endTime: "16:00", quota: 20 },
  });

  async function onSubmit(values: ScheduleFormValues) {
    const result = await addDoctorSchedule(values);
    if (result.success) {
      toast.success("Schedule slot added");
      form.reset({ doctorId: doctor.id, dayOfWeek: 1, startTime: "08:00", endTime: "16:00", quota: 20 });
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleRemove(id: string) {
    setRemovingId(id);
    const result = await removeDoctorSchedule(id);
    setRemovingId(null);
    if (result.success) {
      toast.success("Schedule slot removed");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {React.cloneElement(trigger, { onClick: () => setOpen(true) } as React.HTMLAttributes<HTMLElement>)}
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{doctor.user.name}&apos;s schedule</SheetTitle>
          <SheetDescription>Weekly availability used for appointment queueing.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-3 overflow-y-auto px-4">
          {doctor.schedules.length ? (
            doctor.schedules.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">{DAY_LABELS[slot.dayOfWeek]}</p>
                    <p className="text-xs text-muted-foreground">
                      {slot.startTime}–{slot.endTime} · quota {slot.quota}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={removingId === slot.id}
                  onClick={() => handleRemove(slot.id)}
                >
                  {removingId === slot.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4 text-destructive" />
                  )}
                </Button>
              </div>
            ))
          ) : (
            <EmptyState title="No schedule slots yet" description="Add a weekly slot below." />
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 border-t border-border/60 p-4">
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DAY_LABELS.map((label, index) => (
                        <SelectItem key={label} value={String(index)}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="quota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quota</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Add slot
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
