"use client";

import * as React from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PatientIdentityCard } from "@/components/patient-identity-card";
import { StatusBadge } from "@/components/status-badge";
import type { PatientListItem } from "@/lib/queries/patients";

export function PatientDetailSheet({ patient }: { patient: PatientListItem }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)}>
        <Eye className="size-4" />
      </Button>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Patient profile</SheetTitle>
          <SheetDescription>Read-only summary. Registration is managed by reception.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 overflow-y-auto px-4 pb-4">
          <PatientIdentityCard patient={patient} />
          <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3">
            <span className="text-sm text-muted-foreground">Account status</span>
            <StatusBadge status={patient.status} domain="UserStatus" />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3">
            <span className="text-sm text-muted-foreground">Total appointments</span>
            <span className="text-sm font-medium">{patient._count.appointments}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
