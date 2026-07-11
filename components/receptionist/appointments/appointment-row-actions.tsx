"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppointmentRescheduleDialog } from "./appointment-reschedule-dialog";
import { AppointmentCancelDialog } from "./appointment-cancel-dialog";
import { checkInAppointment, markAppointmentNoShow } from "@/lib/actions/appointments";
import type { AppointmentListItem } from "@/lib/queries/appointments";

export function AppointmentRowActions({ appointment }: { appointment: AppointmentListItem }) {
  const router = useRouter();
  const [dialogMode, setDialogMode] = React.useState<"reschedule" | "cancel" | null>(null);
  const [isPending, startTransition] = React.useTransition();

  if (appointment.status !== "SCHEDULED") return null;

  function handleCheckIn() {
    startTransition(async () => {
      const result = await checkInAppointment({ id: appointment.id });
      if (result.success) {
        toast.success("Patient checked in");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleNoShow() {
    startTransition(async () => {
      const result = await markAppointmentNoShow({ id: appointment.id });
      if (result.success) {
        toast.success("Marked as no-show");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" disabled={isPending} />}>
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCheckIn}>Check in</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialogMode("reschedule")}>Reschedule</DropdownMenuItem>
          <DropdownMenuItem onClick={handleNoShow}>Mark no-show</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDialogMode("cancel")}>
            Cancel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AppointmentRescheduleDialog
        appointmentId={appointment.id}
        open={dialogMode === "reschedule"}
        onOpenChange={(open) => setDialogMode(open ? "reschedule" : null)}
      />
      <AppointmentCancelDialog
        appointmentId={appointment.id}
        open={dialogMode === "cancel"}
        onOpenChange={(open) => setDialogMode(open ? "cancel" : null)}
      />
    </>
  );
}
