"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { createMedicine, updateMedicine } from "@/lib/actions/medicines";
import { createMedicineSchema, updateMedicineSchema } from "@/lib/validations/medicine";
import type { MedicineListItem } from "@/lib/queries/pharmacy";

interface MedicineFormValues {
  id?: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  minimumStock: number;
  price: number;
  expiryDate?: string;
}

interface MedicineFormDialogProps {
  medicine?: MedicineListItem;
  trigger?: React.ReactElement;
}

export function MedicineFormDialog({ medicine, trigger }: MedicineFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const isEdit = !!medicine;

  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(isEdit ? updateMedicineSchema : createMedicineSchema) as never,
    defaultValues: isEdit
      ? {
          id: medicine.id,
          name: medicine.name,
          category: medicine.category,
          unit: medicine.unit,
          stock: medicine.stock,
          minimumStock: medicine.minimumStock,
          price: Number(medicine.price),
          expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().slice(0, 10) : "",
        }
      : { name: "", category: "", unit: "", stock: 0, minimumStock: 10, price: 0, expiryDate: "" },
  });

  async function onSubmit(values: MedicineFormValues) {
    const result = isEdit ? await updateMedicine(values) : await createMedicine(values);
    if (result.success) {
      toast.success(isEdit ? "Medicine updated" : "Medicine added");
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
              Add medicine
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit medicine" : "Add medicine"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this medicine's catalog details." : "Add a new medicine to the pharmacy catalog."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Paracetamol 500mg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Analgesic" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="tablet" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minimumStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum stock</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (IDR)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} step={100} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Expiry date <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
