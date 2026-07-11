import { z } from "zod";

export const generateInvoiceSchema = z.object({
  appointmentId: z.string().min(1),
  dueInDays: z.coerce.number().int().min(0).max(90).optional(),
});

export const addInvoiceItemSchema = z.object({
  invoiceId: z.string().min(1),
  description: z.string().min(2, "Description is required").max(200),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.coerce.number().min(0, "Unit price must be zero or more"),
});

export const processPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  method: z.enum(["CASH", "BANK_TRANSFER", "E_WALLET", "INSURANCE"]),
  referenceNumber: z.string().max(100).optional().or(z.literal("")),
  notes: z.string().max(300).optional().or(z.literal("")),
});

export const cancelInvoiceSchema = z.object({
  id: z.string().min(1),
});

export type GenerateInvoiceInput = z.infer<typeof generateInvoiceSchema>;
export type AddInvoiceItemInput = z.infer<typeof addInvoiceItemSchema>;
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
