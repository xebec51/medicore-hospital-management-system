"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { StatusBadge } from "@/components/status-badge";
import { saveMedicalRecordDraft, finalizeMedicalRecord } from "@/lib/actions/medical-records";
import { completeAppointment } from "@/lib/actions/appointments";
import { medicalRecordFormSchema } from "@/lib/validations/medical-record";

interface MedicalRecordFormValues {
  appointmentId: string;
  chiefComplaint: string;
  diagnosis?: string;
  doctorNotes?: string;
  treatmentPlan?: string;
  followUpDate?: string;
}

interface MedicalRecordFormProps {
  appointmentId: string;
  appointmentStatus: string;
  initialValues: {
    chiefComplaint: string;
    diagnosis: string;
    doctorNotes: string;
    treatmentPlan: string;
    followUpDate: string;
    nurseNotes?: string | null;
  };
  recordStatus: "DRAFT" | "FINALIZED" | "ARCHIVED" | null;
}

export function MedicalRecordForm({ appointmentId, appointmentStatus, initialValues, recordStatus }: MedicalRecordFormProps) {
  const router = useRouter();
  const isFinalized = recordStatus === "FINALIZED" || recordStatus === "ARCHIVED";
  const isCompleted = appointmentStatus === "COMPLETED";

  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordFormSchema) as never,
    defaultValues: { appointmentId, ...initialValues },
  });

  async function handleSave(finalize: boolean) {
    const values = form.getValues();
    const action = finalize ? finalizeMedicalRecord : saveMedicalRecordDraft;
    const result = await action(values);
    if (result.success) {
      toast.success(finalize ? "Medical record finalized" : "Draft saved");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleComplete() {
    const result = await completeAppointment({ id: appointmentId });
    if (result.success) {
      toast.success("Consultation completed");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">Consultation record</h3>
        {recordStatus ? <StatusBadge status={recordStatus} domain="MedicalRecordStatus" /> : null}
      </div>

      {initialValues.nurseNotes ? (
        <div className="rounded-lg bg-clinical/10 px-3 py-2 text-xs text-clinical">
          <span className="font-medium">Nurse notes: </span>
          {initialValues.nurseNotes}
        </div>
      ) : null}

      <Form {...form}>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <FormField
            control={form.control}
            name="chiefComplaint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chief complaint</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} disabled={isFinalized} placeholder="What brought the patient in?" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diagnosis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Diagnosis <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled={isFinalized} placeholder="Working or confirmed diagnosis" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="doctorNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Doctor notes <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} disabled={isFinalized} placeholder="Clinical observations" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="treatmentPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Treatment plan <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} disabled={isFinalized} placeholder="Next steps for the patient" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="followUpDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Follow-up date <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="date" disabled={isFinalized} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isFinalized || form.formState.isSubmitting}
              onClick={form.handleSubmit(() => handleSave(false))}
            >
              {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save draft
            </Button>
            <Button
              type="button"
              disabled={isFinalized || form.formState.isSubmitting}
              onClick={form.handleSubmit(() => handleSave(true))}
            >
              {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              Finalize record
            </Button>
            {!isCompleted && (
              <Button type="button" variant="secondary" onClick={handleComplete} className="ml-auto">
                Complete appointment
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
