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

export const supplierSchema = z.object({
  name: z.string().trim().min(1, "Supplier name is required").max(160),
  phone: z.union([z.string().trim().max(30), z.literal("")]).optional(),
  address: optionalText,
  gstNumber: z.union([z.string().trim().max(30), z.literal("")]).optional(),
});

export const supplierUpdateSchema = supplierSchema.partial();

export const supplierListQuerySchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

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
export type SupplierInput = z.infer<typeof supplierSchema>;
export type SupplierUpdateInput = z.infer<typeof supplierUpdateSchema>;

const positiveDecimal = (scale: number) => decimal(scale).refine((value) => Number(value) > 0, "Must be greater than zero");
const nonNegativeDecimal = (scale: number) => decimal(scale);

export const purchaseItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: positiveDecimal(3),
  buyPrice: nonNegativeDecimal(2),
  mrpAtPurchase: nonNegativeDecimal(2),
  discount: nonNegativeDecimal(2).default("0"),
  taxRate: nonNegativeDecimal(2).nullable().optional(),
});

export const purchaseSchema = z.object({
  supplierId: z.string().cuid().nullable().optional(),
  invoiceNumber: z.string().trim().max(100).optional(),
  purchaseDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  notes: optionalText,
  items: z.array(purchaseItemSchema).min(1, "Add at least one product"),
});

export const purchaseListQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  supplierId: z.string().cuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const customerSchema = z.object({
  name: z.string().trim().min(1, "Customer name is required").max(160),
  phone: z.union([z.string().trim().max(30), z.literal("")]).optional(),
  address: optionalText,
  creditLimit: z.union([nonNegativeDecimal(2), z.literal("")]).optional(),
  openingCredit: nonNegativeDecimal(2).default("0"),
  isActive: z.boolean().default(true),
});

export const customerUpdateSchema = customerSchema.partial();
export const customerListQuerySchema = z.object({ search: z.string().trim().optional(), page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(25) });

export const saleItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: positiveDecimal(3),
  sellPrice: nonNegativeDecimal(2),
  discount: nonNegativeDecimal(2).default("0"),
  taxRate: nonNegativeDecimal(2).nullable().optional(),
});

export const saleSchema = z.object({
  customerId: z.string().cuid().nullable().optional(),
  saleNumber: z.string().trim().min(1).max(100),
  paymentMethod: z.enum(["CASH", "UPI", "CARD", "BANK_TRANSFER", "OTHER"]).nullable().optional(),
  amountPaid: nonNegativeDecimal(2),
  saleDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  notes: optionalText,
  items: z.array(saleItemSchema).min(1, "Add at least one product"),
});

export const saleListQuerySchema = z.object({ from: z.string().optional(), to: z.string().optional(), paymentStatus: z.enum(["PAID", "PARTIALLY_PAID", "CREDIT"]).optional(), page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(25) });

export const creditPaymentSchema = z.object({ amount: positiveDecimal(2), paymentMethod: z.enum(["CASH", "UPI", "CARD", "BANK_TRANSFER", "OTHER"]), reference: z.string().trim().max(100).optional(), notes: optionalText });
export const creditAdjustmentSchema = z.object({ amount: positiveDecimal(2), direction: z.enum(["DEBIT", "CREDIT"]), reference: z.string().trim().max(100).optional(), notes: optionalText });
export const inventoryListQuerySchema = z.object({ search: z.string().trim().optional(), categoryId: z.string().cuid().optional(), status: z.enum(["LOW", "OUT", "ALL"]).default("ALL"), page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(25) });
export const inventoryAdjustmentSchema = z.object({ productId: z.string().cuid(), direction: z.enum(["IN", "OUT"]), quantity: positiveDecimal(3), reason: z.string().trim().min(1, "Reason is required").max(200) });
export type ProductInput = z.infer<typeof productSchema>;
export type PurchaseInput = z.infer<typeof purchaseSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;
export type SaleInput = z.infer<typeof saleSchema>;
export type CreditPaymentInput = z.infer<typeof creditPaymentSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
