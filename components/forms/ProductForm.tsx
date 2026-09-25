import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { productSchema, type ProductInput } from "@/schemas/catalog";
import type { Category } from "@/features/catalog/use-categories";
import type { Product } from "@/features/catalog/use-products";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

const emptyValues: ProductInput = { sku: "", barcode: "", name: "", description: "", categoryId: "", unit: "PIECE", mrp: "", defaultBuyPrice: "", defaultSellPrice: "", reorderLevel: "0", status: "ACTIVE" };

function toFormValues(product?: Product): ProductInput {
  if (!product) return emptyValues;
  return { sku: product.sku, barcode: product.barcode ?? "", name: product.name, description: product.description ?? "", categoryId: product.categoryId ?? "", unit: product.unit as ProductInput["unit"], mrp: product.mrp, defaultBuyPrice: product.defaultBuyPrice ?? "", defaultSellPrice: product.defaultSellPrice ?? "", reorderLevel: product.reorderLevel, status: product.status as ProductInput["status"] };
}

export function ProductForm({ product, categories, isSaving, serverError, onSubmit, onCancel }: { product?: Product; categories: Category[]; isSaving: boolean; serverError?: string; onSubmit: (values: ProductInput) => Promise<void>; onCancel: () => void }) {
  const { register, reset, handleSubmit, formState: { errors } } = useForm<z.input<typeof productSchema>, unknown, ProductInput>({ resolver: zodResolver(productSchema), defaultValues: toFormValues(product) });
  useEffect(() => { reset(toFormValues(product)); }, [product, reset]);

  return <form className="grid gap-5 sm:grid-cols-2" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
    <FormField label="SKU" htmlFor="product-sku" error={errors.sku?.message}><Input id="product-sku" {...register("sku")} /></FormField>
    <FormField label="Barcode" htmlFor="product-barcode" error={errors.barcode?.message}><Input id="product-barcode" {...register("barcode")} /></FormField>
    <div className="sm:col-span-2"><FormField label="Product name" htmlFor="product-name" error={errors.name?.message}><Input id="product-name" {...register("name")} /></FormField></div>
    <FormField label="Category" htmlFor="product-category" error={errors.categoryId?.message}><Select id="product-category" {...register("categoryId")}><option value="">Uncategorized</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></FormField>
    <FormField label="Unit" htmlFor="product-unit" error={errors.unit?.message}><Select id="product-unit" {...register("unit")}><option value="PIECE">Piece</option><option value="KG">Kilogram</option><option value="GRAM">Gram</option><option value="LITRE">Litre</option><option value="ML">Millilitre</option><option value="PACK">Pack</option><option value="BOX">Box</option><option value="DOZEN">Dozen</option></Select></FormField>
    <FormField label="MRP" htmlFor="product-mrp" error={errors.mrp?.message}><Input id="product-mrp" inputMode="decimal" {...register("mrp")} /></FormField>
    <FormField label="Default buying price" htmlFor="product-buy" error={errors.defaultBuyPrice?.message}><Input id="product-buy" inputMode="decimal" {...register("defaultBuyPrice")} /></FormField>
    <FormField label="Default selling price" htmlFor="product-sell" error={errors.defaultSellPrice?.message}><Input id="product-sell" inputMode="decimal" {...register("defaultSellPrice")} /></FormField>
    <FormField label="Reorder level" htmlFor="product-reorder" error={errors.reorderLevel?.message}><Input id="product-reorder" inputMode="decimal" {...register("reorderLevel")} /></FormField>
    <FormField label="Status" htmlFor="product-status" error={errors.status?.message}><Select id="product-status" {...register("status")}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></Select></FormField>
    <div className="sm:col-span-2"><FormField label="Description" htmlFor="product-description" error={errors.description?.message}><Textarea id="product-description" {...register("description")} /></FormField></div>
    {serverError && <div className="sm:col-span-2"><Alert tone="danger">{serverError}</Alert></div>}
    <div className="flex justify-end gap-3 sm:col-span-2"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save product"}</Button></div>
  </form>;
}
