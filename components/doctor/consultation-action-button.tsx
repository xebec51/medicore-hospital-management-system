"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startConsultation } from "@/lib/actions/appointments";

interface ConsultationActionButtonProps {
  appointmentId: string;
  status: string;
}

export function ConsultationActionButton({ appointmentId, status }: ConsultationActionButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  if (status === "SCHEDULED" || status === "CANCELLED" || status === "NO_SHOW") {
    return null;
  }

  if (status === "CHECKED_IN") {
    function handleStart() {
      startTransition(async () => {
        const result = await startConsultation({ id: appointmentId });
        if (result.success) {
          router.push(`/dashboard/doctor/consultation/${appointmentId}`);
        } else {
          toast.error(result.error);
        }
      });
    }

    return (
      <Button size="sm" onClick={handleStart} disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
        Start consultation
      </Button>
    );
  }

  return (
    <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/doctor/consultation/${appointmentId}`)}>
      {status === "IN_CONSULTATION" ? <Play className="size-4" /> : <Eye className="size-4" />}
      {status === "IN_CONSULTATION" ? "Continue" : "View"}
    </Button>
  );
}
