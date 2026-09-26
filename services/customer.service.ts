/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";
import Decimal from "decimal.js";
import type { CustomerInput, CustomerUpdateInput } from "@/schemas/catalog";

function serializeCustomer(customer: any, outstanding?: string) { return { ...customer, creditLimit: customer.creditLimit?.toString() ?? null, openingCredit: customer.openingCredit.toString(), createdAt: customer.createdAt.toISOString(), updatedAt: customer.updatedAt.toISOString(), ...(outstanding === undefined ? {} : { outstanding }) }; }
async function outstandingFor(storeId: string, customerId: string, db: any = prisma) { const customer = await db.customer.findFirst({ where: { id: customerId, storeId }, include: { creditEntries: { select: { amountDelta: true } } } }); if (!customer) throw new ApiError("NOT_FOUND", "Customer not found", 404); return customer.openingCredit.plus(customer.creditEntries.reduce((sum: Decimal, entry: any) => sum.plus(entry.amountDelta), new Decimal(0))).toFixed(2); }

export async function listCustomers(storeId: string, filters: { search?: string; page: number; pageSize: number }) {
  const where = { storeId, ...(filters.search ? { OR: [{ name: { contains: filters.search, mode: "insensitive" as const } }, { phone: { contains: filters.search, mode: "insensitive" as const } }] } : {}) };
  const customers = await prisma.customer.findMany({ where, orderBy: { name: "asc" }, skip: (filters.page - 1) * filters.pageSize, take: filters.pageSize, include: { creditEntries: { select: { amountDelta: true } } } });
  const total = await prisma.customer.count({ where });
  return { items: customers.map((customer) => serializeCustomer(customer, customer.openingCredit.plus(customer.creditEntries.reduce((sum, entry) => sum.plus(entry.amountDelta), new Decimal(0))).toFixed(2))), total, page: filters.page, pageSize: filters.pageSize };
}
export async function getCustomer(storeId: string, id: string) { const customer = await prisma.customer.findFirst({ where: { id, storeId }, include: { creditEntries: { orderBy: { createdAt: "desc" }, include: { sale: { select: { saleNumber: true } } } } } }); if (!customer) throw new ApiError("NOT_FOUND", "Customer not found", 404); return { ...serializeCustomer(customer, await outstandingFor(storeId, id)), creditEntries: customer.creditEntries.map((entry: any) => ({ ...entry, amountDelta: entry.amountDelta.toString(), createdAt: entry.createdAt.toISOString() })) }; }
export async function createCustomer(storeId: string, input: CustomerInput) { const customer = await prisma.customer.create({ data: { storeId, name: input.name, phone: input.phone || null, address: input.address || null, creditLimit: input.creditLimit || null, openingCredit: input.openingCredit, isActive: input.isActive } }); return serializeCustomer(customer); }
export async function updateCustomer(storeId: string, id: string, input: CustomerUpdateInput) { const existing = await prisma.customer.findFirst({ where: { id, storeId } }); if (!existing) throw new ApiError("NOT_FOUND", "Customer not found", 404); const customer = await prisma.customer.update({ where: { id }, data: { ...(input.name !== undefined ? { name: input.name } : {}), ...(input.phone !== undefined ? { phone: input.phone || null } : {}), ...(input.address !== undefined ? { address: input.address || null } : {}), ...(input.creditLimit !== undefined ? { creditLimit: input.creditLimit || null } : {}), ...(input.isActive !== undefined ? { isActive: input.isActive } : {}) } }); return serializeCustomer(customer, await outstandingFor(storeId, id)); }
export { outstandingFor };
