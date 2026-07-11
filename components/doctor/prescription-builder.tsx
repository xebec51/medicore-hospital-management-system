"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Pill, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { createPrescription } from "@/lib/actions/prescriptions";
import { createPrescriptionSchema } from "@/lib/validations/prescription";

interface MedicineOption {
  id: string;
  name: string;
  unit: string;
  stock: number;
}

interface ExistingPrescription {
  id: string;
  prescriptionCode: string;
  status: string;
  items: { id: string; quantity: number; dosage: string; medicine: { name: string; unit: string } }[];
}

interface PrescriptionFormValues {
  medicalRecordId: string;
  notes?: string;
  items: { medicineId: string; quantity: number; dosage: string; frequency: string; duration: string; instructions?: string }[];
}

const EMPTY_ITEM = { medicineId: "", quantity: 1, dosage: "", frequency: "", duration: "", instructions: "" };

export function PrescriptionBuilder({
  medicalRecordId,
  medicines,
  existingPrescriptions,
}: {
  medicalRecordId: string | null;
  medicines: MedicineOption[];
  existingPrescriptions: ExistingPrescription[];
}) {
  const router = useRouter();

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(createPrescriptionSchema) as never,
    defaultValues: { medicalRecordId: medicalRecordId ?? "", notes: "", items: [EMPTY_ITEM] },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  async function onSubmit(values: PrescriptionFormValues) {
    const result = await createPrescription(values);
    if (result.success) {
      toast.success("Prescription created");
      form.reset({ medicalRecordId: medicalRecordId ?? "", notes: "", items: [EMPTY_ITEM] });
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Pill className="size-4.5 text-clinical" />
        <h3 className="font-semibold">Prescriptions</h3>
      </div>

      {existingPrescriptions.length ? (
        <div className="space-y-2">
          {existingPrescriptions.map((rx) => (
            <div key={rx.id} className="rounded-xl border border-border/70 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{rx.prescriptionCode}</p>
                <StatusBadge status={rx.status} domain="PrescriptionStatus" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {rx.items.map((i) => `${i.medicine.name} (${i.dosage})`).join(", ")}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {medicalRecordId ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 border-t border-border/60 pt-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2 rounded-xl border border-border/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Item {index + 1}</p>
                  {fields.length > 1 ? (
                    <Button type="button" variant="ghost" size="icon-sm" aria-label="Remove medicine" onClick={() => remove(index)}>
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  ) : null}
                </div>
                <FormField
                  control={form.control}
                  name={`items.${index}.medicineId`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Medicine</FormLabel>
                      <Select value={f.value} onValueChange={f.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select medicine" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {medicines.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name} ({m.stock} {m.unit} in stock)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Quantity</FormLabel>
                        <FormControl>
                          <Input {...f} type="number" min={1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.dosage`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Dosage</FormLabel>
                        <FormControl>
                          <Input {...f} placeholder="500mg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.frequency`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Frequency</FormLabel>
                        <FormControl>
                          <Input {...f} placeholder="3x daily" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.duration`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Duration</FormLabel>
                        <FormControl>
                          <Input {...f} placeholder="5 days" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" size="sm" onClick={() => append(EMPTY_ITEM)}>
              <Plus className="size-3.5" />
              Add medicine
            </Button>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Notes <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} placeholder="Instructions for the pharmacist" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Pill className="size-4" />}
              Create prescription
            </Button>
          </form>
        </Form>
      ) : (
        <EmptyState
          className="py-8"
          title="Save the record first"
          description="Save a consultation draft before creating a prescription."
        />
      )}
    </div>
  );
}
