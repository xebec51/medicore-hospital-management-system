"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cancelAppointment } from "@/lib/actions/appointments";
import { cancelAppointmentSchema } from "@/lib/validations/appointment";

interface CancelFormValues {
  id: string;
  cancelledReason: string;
}

export function AppointmentCancelDialog({
  appointmentId,
  open,
  onOpenChange,
}: {
  appointmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const form = useForm<CancelFormValues>({
    resolver: zodResolver(cancelAppointmentSchema) as never,
    defaultValues: { id: appointmentId, cancelledReason: "" },
  });

  async function onSubmit(values: CancelFormValues) {
    const result = await cancelAppointment(values);
    if (result.success) {
      toast.success("Appointment cancelled");
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Cancel appointment</DialogTitle>
          <DialogDescription>Provide a brief reason. This cannot be undone.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cancelledReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="e.g. Patient requested reschedule" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Keep appointment
              </Button>
              <Button type="submit" variant="destructive" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                Cancel appointment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
