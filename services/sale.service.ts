/* eslint-disable @typescript-eslint/no-explicit-any */
import Decimal from "decimal.js";
import { ApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";
import type { SaleInput } from "@/schemas/catalog";

function money(value: Decimal) { return value.toDecimalPlaces(2).toFixed(2); }
function calculateSale(input: SaleInput) { let subtotal = new Decimal(0); let discount = new Decimal(0); let tax = new Decimal(0); const items = input.items.map((item) => { const base = new Decimal(item.quantity).times(item.sellPrice); const itemDiscount = new Decimal(item.discount ?? "0"); const itemTax = base.minus(itemDiscount).times(new Decimal(item.taxRate ?? "0")).div(100); const lineTotal = base.minus(itemDiscount).plus(itemTax); subtotal = subtotal.plus(base); discount = discount.plus(itemDiscount); tax = tax.plus(itemTax); return { ...item, lineTotal: money(lineTotal) }; }); return { items, subtotal: money(subtotal), discount: money(discount), tax: money(tax), total: money(subtotal.minus(discount).plus(tax)) }; }
function serializeSale(sale: any) { return { ...sale, subtotal: sale.subtotal.toString(), discount: sale.discount.toString(), tax: sale.tax.toString(), total: sale.total.toString(), amountPaid: sale.amountPaid.toString(), saleDate: sale.saleDate.toISOString(), createdAt: sale.createdAt.toISOString(), updatedAt: sale.updatedAt.toISOString(), items: sale.items?.map((item: any) => ({ ...item, quantity: item.quantity.toString(), sellPrice: item.sellPrice.toString(), mrpAtSale: item.mrpAtSale.toString(), costPriceSnapshot: item.costPriceSnapshot.toString(), discount: item.discount.toString(), taxRate: item.taxRate?.toString() ?? null, lineTotal: item.lineTotal.toString() })) }; }

export async function createSale(storeId: string, userId: string, input: SaleInput) {
  const calculated = calculateSale(input); const total = new Decimal(calculated.total); const amountPaid = new Decimal(input.amountPaid);
  if (amountPaid.gt(total)) throw new ApiError("INVALID_PAYMENT", "Amount paid cannot exceed the sale total", 400);
  const due = total.minus(amountPaid); if (due.gt(0) && !input.customerId) throw new ApiError("INVALID_PAYMENT", "A customer is required for credit sales", 400);
  return prisma.$transaction(async (tx) => {
    let customer: any = null;
    if (input.customerId) { customer = await tx.customer.findFirst({ where: { id: input.customerId, storeId } }); if (!customer) throw new ApiError("FORBIDDEN", "Customer does not belong to this store", 403); }
    const products = await tx.product.findMany({ where: { storeId, id: { in: input.items.map((item) => item.productId) } }, include: { inventory: true } });
    if (products.length !== new Set(input.items.map((item) => item.productId)).size) throw new ApiError("FORBIDDEN", "One or more products do not belong to this store", 403);
    const sale = await tx.sale.create({ data: { storeId, customerId: input.customerId || null, saleNumber: input.saleNumber, saleDate: new Date(input.saleDate), paymentMethod: input.paymentMethod || null, amountPaid: input.amountPaid, paymentStatus: amountPaid.eq(0) ? "CREDIT" : amountPaid.eq(total) ? "PAID" : "PARTIALLY_PAID", notes: input.notes || null, createdById: userId, subtotal: calculated.subtotal, discount: calculated.discount, tax: calculated.tax, total: calculated.total, items: { create: calculated.items.map((item) => { const product = products.find((candidate) => candidate.id === item.productId)!; return { productId: item.productId, quantity: item.quantity, sellPrice: item.sellPrice, mrpAtSale: product.mrp, costPriceSnapshot: product.defaultBuyPrice || "0", discount: item.discount ?? "0", taxRate: item.taxRate ?? null, lineTotal: item.lineTotal }; }) } }, include: { items: true, customer: true } });
    for (const item of calculated.items) {
      const updated = await tx.inventoryBalance.updateMany({ where: { productId: item.productId, quantity: { gte: item.quantity } }, data: { quantity: { decrement: item.quantity } } });
      if (updated.count !== 1) throw new ApiError("INSUFFICIENT_STOCK", "Insufficient stock for one or more products", 409);
      await tx.inventoryMovement.create({ data: { storeId, productId: item.productId, type: "SALE", quantityDelta: new Decimal(item.quantity).negated().toFixed(3), unitCost: products.find((product) => product.id === item.productId)?.defaultBuyPrice || "0", saleId: sale.id, reference: input.saleNumber, createdById: userId } });
    }
    if (due.gt(0) && customer) {
      const entries = await tx.creditLedgerEntry.findMany({ where: { storeId, customerId: customer.id }, select: { amountDelta: true } });
      const projected = customer.openingCredit.plus(entries.reduce((sum: Decimal, entry: any) => sum.plus(entry.amountDelta), new Decimal(0))).plus(due);
      if (customer.creditLimit && projected.gt(customer.creditLimit)) throw new ApiError("CREDIT_LIMIT_EXCEEDED", "This sale exceeds the customer credit limit", 409);
      await tx.creditLedgerEntry.create({ data: { storeId, customerId: customer.id, saleId: sale.id, type: "SALE_CREDIT", amountDelta: due.toFixed(2), createdById: userId } });
    }
    return serializeSale(sale);
  });
}
export async function listSales(storeId: string, filters: { from?: string; to?: string; paymentStatus?: string; page: number; pageSize: number }) { const saleDate: any = {}; if (filters.from) saleDate.gte = new Date(filters.from); if (filters.to) saleDate.lt = new Date(filters.to); const where = { storeId, ...(Object.keys(saleDate).length ? { saleDate } : {}), ...(filters.paymentStatus ? { paymentStatus: filters.paymentStatus as any } : {}) }; const [items, total] = await Promise.all([prisma.sale.findMany({ where, include: { customer: true }, orderBy: { saleDate: "desc" }, skip: (filters.page - 1) * filters.pageSize, take: filters.pageSize }), prisma.sale.count({ where })]); return { items: items.map(serializeSale), total, page: filters.page, pageSize: filters.pageSize }; }
export async function getSale(storeId: string, id: string) { const sale = await prisma.sale.findFirst({ where: { id, storeId }, include: { customer: true, items: { include: { product: true } }, creditEntries: true } }); if (!sale) throw new ApiError("NOT_FOUND", "Sale not found", 404); return serializeSale(sale); }
export { calculateSale };
