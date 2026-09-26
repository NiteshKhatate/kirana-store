import { ApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";
import type { SupplierInput, SupplierUpdateInput } from "@/schemas/catalog";

function serializeSupplier(supplier: { id: string; storeId: string; name: string; phone: string | null; address: string | null; gstNumber: string | null; createdAt: Date; updatedAt: Date }) {
  return { ...supplier, createdAt: supplier.createdAt.toISOString(), updatedAt: supplier.updatedAt.toISOString() };
}

export async function listSuppliers(storeId: string, filters: { search?: string; page: number; pageSize: number }) {
  const where = {
    storeId,
    ...(filters.search ? { OR: [{ name: { contains: filters.search, mode: "insensitive" as const } }, { phone: { contains: filters.search, mode: "insensitive" as const } }, { gstNumber: { contains: filters.search, mode: "insensitive" as const } }] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.supplier.findMany({ where, orderBy: { name: "asc" }, skip: (filters.page - 1) * filters.pageSize, take: filters.pageSize }),
    prisma.supplier.count({ where }),
  ]);
  return { items: items.map(serializeSupplier), total, page: filters.page, pageSize: filters.pageSize };
}

export async function getSupplier(storeId: string, supplierId: string) {
  const supplier = await prisma.supplier.findFirst({ where: { id: supplierId, storeId } });
  if (!supplier) throw new ApiError("NOT_FOUND", "Supplier not found", 404);
  return serializeSupplier(supplier);
}

export async function createSupplier(storeId: string, input: SupplierInput) {
  try {
    const supplier = await prisma.supplier.create({ data: { storeId, name: input.name, phone: input.phone || null, address: input.address || null, gstNumber: input.gstNumber || null } });
    return serializeSupplier(supplier);
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") throw new ApiError("CONFLICT", "A supplier with these details already exists", 409);
    throw error;
  }
}

export async function updateSupplier(storeId: string, supplierId: string, input: SupplierUpdateInput) {
  const existing = await prisma.supplier.findFirst({ where: { id: supplierId, storeId } });
  if (!existing) throw new ApiError("NOT_FOUND", "Supplier not found", 404);
  try {
    const supplier = await prisma.supplier.update({ where: { id: supplierId }, data: { ...(input.name !== undefined ? { name: input.name } : {}), ...(input.phone !== undefined ? { phone: input.phone || null } : {}), ...(input.address !== undefined ? { address: input.address || null } : {}), ...(input.gstNumber !== undefined ? { gstNumber: input.gstNumber || null } : {}) } });
    return serializeSupplier(supplier);
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") throw new ApiError("CONFLICT", "A supplier with these details already exists", 409);
    throw error;
  }
}
