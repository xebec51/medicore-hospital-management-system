"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { processPayment } from "@/lib/actions/payments";
import { processPaymentSchema } from "@/lib/validations/invoice";
import { useI18n } from "@/lib/i18n/use-i18n";

const METHODS = ["CASH", "BANK_TRANSFER", "E_WALLET", "INSURANCE"] as const;

interface PaymentFormValues {
  invoiceId: string;
  amount: number;
  method: (typeof METHODS)[number];
  referenceNumber?: string;
  notes?: string;
}

export function PaymentPanel({ invoiceId, balance }: { invoiceId: string; balance: number }) {
  const { t } = useI18n();
  const router = useRouter();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(processPaymentSchema) as never,
    defaultValues: { invoiceId, amount: balance, method: "CASH", referenceNumber: "", notes: "" },
  });

  async function onSubmit(values: PaymentFormValues) {
    const result = await processPayment(values);
    if (result.success) {
      toast.success("Payment processed");
      form.reset({ invoiceId, amount: 0, method: "CASH", referenceNumber: "", notes: "" });
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  if (balance <= 0) {
    return (
      <div className="rounded-2xl border border-border/70 bg-success/10 p-5 text-center text-sm text-success shadow-sm">
        This invoice is fully paid.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Wallet className="size-4.5 text-primary" />
        <h3 className="font-semibold">Process payment</h3>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (IDR)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={0} step={1000} max={balance} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("nav.payment")} method</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {t(`status.PaymentMethod.${method}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referenceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Reference number <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Transaction / receipt reference" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Notes <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Wallet className="size-4" />}
            Record payment
          </Button>
        </form>
      </Form>
    </div>
  );
}
