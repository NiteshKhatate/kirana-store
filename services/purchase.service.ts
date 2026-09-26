/* eslint-disable @typescript-eslint/no-explicit-any */
import Decimal from "decimal.js";
import { ApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";
import type { PurchaseInput } from "@/schemas/catalog";

function money(value: Decimal) { return value.toDecimalPlaces(2).toFixed(2); }
function serializePurchase(purchase: any) {
  return { ...purchase, subtotal: purchase.subtotal.toString(), discount: purchase.discount.toString(), tax: purchase.tax.toString(), total: purchase.total.toString(), purchaseDate: purchase.purchaseDate.toISOString(), createdAt: purchase.createdAt.toISOString(), updatedAt: purchase.updatedAt.toISOString(), items: purchase.items?.map((item: any) => ({ ...item, quantity: item.quantity.toString(), buyPrice: item.buyPrice.toString(), mrpAtPurchase: item.mrpAtPurchase.toString(), discount: item.discount.toString(), taxRate: item.taxRate?.toString() ?? null, lineTotal: item.lineTotal.toString() })) };
}

function calculatePurchase(input: PurchaseInput) {
  let subtotal = new Decimal(0); let discount = new Decimal(0); let tax = new Decimal(0);
  const items = input.items.map((item) => { const base = new Decimal(item.quantity).times(item.buyPrice); const itemDiscount = new Decimal(item.discount ?? "0"); const itemTax = base.minus(itemDiscount).times(new Decimal(item.taxRate ?? "0")).div(100); const lineTotal = base.minus(itemDiscount).plus(itemTax); subtotal = subtotal.plus(base); discount = discount.plus(itemDiscount); tax = tax.plus(itemTax); return { ...item, lineTotal: money(lineTotal) }; });
  return { items, subtotal: money(subtotal), discount: money(discount), tax: money(tax), total: money(subtotal.minus(discount).plus(tax)) };
}

export async function createPurchase(storeId: string, userId: string, input: PurchaseInput) {
  const calculated = calculatePurchase(input);
  return prisma.$transaction(async (tx) => {
    if (input.supplierId && !(await tx.supplier.findFirst({ where: { id: input.supplierId, storeId } }))) throw new ApiError("FORBIDDEN", "Supplier does not belong to this store", 403);
    const products = await tx.product.findMany({ where: { storeId, id: { in: input.items.map((item) => item.productId) } } });
    if (products.length !== new Set(input.items.map((item) => item.productId)).size) throw new ApiError("FORBIDDEN", "One or more products do not belong to this store", 403);
    const purchase = await tx.purchase.create({ data: { storeId, supplierId: input.supplierId || null, invoiceNumber: input.invoiceNumber || null, purchaseDate: new Date(input.purchaseDate), notes: input.notes || null, createdById: userId, subtotal: calculated.subtotal, discount: calculated.discount, tax: calculated.tax, total: calculated.total, items: { create: calculated.items.map((item) => ({ productId: item.productId, quantity: item.quantity, buyPrice: item.buyPrice, mrpAtPurchase: item.mrpAtPurchase, discount: item.discount ?? "0", taxRate: item.taxRate ?? null, lineTotal: item.lineTotal })) } }, include: { items: true, supplier: true } });
    for (const item of calculated.items) {
      await tx.inventoryMovement.create({ data: { storeId, productId: item.productId, type: "PURCHASE", quantityDelta: item.quantity, unitCost: item.buyPrice, purchaseId: purchase.id, reference: input.invoiceNumber || null, createdById: userId } });
      await tx.inventoryBalance.upsert({ where: { productId: item.productId }, create: { productId: item.productId, quantity: item.quantity }, update: { quantity: { increment: item.quantity } } });
    }
    return serializePurchase(purchase);
  });
}

export async function listPurchases(storeId: string, filters: { from?: string; to?: string; supplierId?: string; page: number; pageSize: number }) {
  const purchaseDate: any = {}; if (filters.from) purchaseDate.gte = new Date(filters.from); if (filters.to) purchaseDate.lt = new Date(filters.to);
  const where = { storeId, ...(Object.keys(purchaseDate).length ? { purchaseDate } : {}), ...(filters.supplierId ? { supplierId: filters.supplierId } : {}) };
  const [items, total] = await Promise.all([prisma.purchase.findMany({ where, include: { supplier: true }, orderBy: { purchaseDate: "desc" }, skip: (filters.page - 1) * filters.pageSize, take: filters.pageSize }), prisma.purchase.count({ where })]);
  return { items: items.map(serializePurchase), total, page: filters.page, pageSize: filters.pageSize };
}

export async function getPurchase(storeId: string, id: string) {
  const purchase = await prisma.purchase.findFirst({ where: { id, storeId }, include: { supplier: true, items: { include: { product: true } } } });
  if (!purchase) throw new ApiError("NOT_FOUND", "Purchase not found", 404);
  return serializePurchase(purchase);
}

export { calculatePurchase };
