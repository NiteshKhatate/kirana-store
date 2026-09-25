import { z } from "zod";

const decimal = (scale: number) =>
  z
    .string()
    .trim()
    .regex(new RegExp(`^\\d+(\\.\\d{1,${scale}})?$`), `Enter a valid number with up to ${scale} decimal places`);

const optionalDecimal = (scale: number) => z.union([decimal(scale), z.literal("")]).optional();

const optionalText = z.union([z.string().trim().max(500), z.literal("")]).optional();

const optionalId = z.union([z.string().cuid(), z.literal("")]).nullable().optional();

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(100),
  description: optionalText,
});

export const categoryUpdateSchema = categorySchema.partial();

export const productSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required").max(80),
  barcode: optionalText,
  name: z.string().trim().min(1, "Product name is required").max(160),
  description: optionalText,
  categoryId: optionalId,
  unit: z.enum(["PIECE", "KG", "GRAM", "LITRE", "ML", "PACK", "BOX", "DOZEN"]),
  mrp: decimal(2),
  defaultBuyPrice: optionalDecimal(2),
  defaultSellPrice: optionalDecimal(2),
  reorderLevel: decimal(3).default("0"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const productUpdateSchema = productSchema.partial();

export const listQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  categoryId: z.string().cuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
