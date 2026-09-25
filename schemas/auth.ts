import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const bootstrapStoreSchema = z.object({
  storeName: z
    .string()
    .trim()
    .min(2, "Store name must be at least 2 characters")
    .max(120, "Store name must be 120 characters or fewer")
    .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type BootstrapStoreInput = z.infer<typeof bootstrapStoreSchema>;
