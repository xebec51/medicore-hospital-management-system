"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateInvoiceFromAppointment } from "@/lib/actions/invoices";

export function GenerateInvoiceButton({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateInvoiceFromAppointment({ appointmentId });
      if (result.success) {
        toast.success("Invoice generated");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button size="sm" onClick={handleGenerate} disabled={isPending}>
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <Receipt className="size-4" />}
      Generate invoice
    </Button>
  );
}
