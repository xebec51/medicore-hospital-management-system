import { z } from "zod";

export const createMedicineSchema = z.object({
  name: z.string().min(2, "Name is required").max(150),
  category: z.string().min(2, "Category is required").max(80),
  unit: z.string().min(1, "Unit is required").max(30),
  stock: z.coerce.number().int().min(0, "Stock must be zero or more"),
  minimumStock: z.coerce.number().int().min(0, "Minimum stock must be zero or more"),
  price: z.coerce.number().min(0, "Price must be zero or more"),
  expiryDate: z.string().optional().or(z.literal("")),
});

export const updateMedicineSchema = createMedicineSchema.extend({
  id: z.string().min(1),
});

export const adjustStockSchema = z.object({
  id: z.string().min(1),
  delta: z.coerce.number().int(),
});

export type CreateMedicineInput = z.infer<typeof createMedicineSchema>;
export type UpdateMedicineInput = z.infer<typeof updateMedicineSchema>;
