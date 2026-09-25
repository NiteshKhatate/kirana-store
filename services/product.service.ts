import { ApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { ProductInput, ProductUpdateInput } from "@/schemas/catalog";

function serializeProduct(product: {
  id: string; storeId: string; categoryId: string | null; sku: string; barcode: string | null; name: string; description: string | null;
  unit: string; mrp: { toString(): string }; defaultBuyPrice: { toString(): string } | null; defaultSellPrice: { toString(): string } | null;
  reorderLevel: { toString(): string }; status: string; createdAt: Date; updatedAt: Date;
  category?: { id: string; name: string } | null;
}) {
  return {
    ...product,
    mrp: product.mrp.toString(),
    defaultBuyPrice: product.defaultBuyPrice?.toString() ?? null,
    defaultSellPrice: product.defaultSellPrice?.toString() ?? null,
    reorderLevel: product.reorderLevel.toString(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

function productCreateData(input: ProductInput): Prisma.ProductUncheckedCreateInput {
  return {
    storeId: "",
    sku: input.sku,
    barcode: input.barcode || null,
    name: input.name,
    description: input.description || null,
    categoryId: input.categoryId || null,
    unit: input.unit,
    mrp: input.mrp,
    defaultBuyPrice: input.defaultBuyPrice || null,
    defaultSellPrice: input.defaultSellPrice || null,
    reorderLevel: input.reorderLevel,
    status: input.status,
  };
}

function productUpdateData(input: ProductUpdateInput): Prisma.ProductUncheckedUpdateInput {
  return {
    ...(input.sku !== undefined ? { sku: input.sku } : {}),
    ...(input.barcode !== undefined ? { barcode: input.barcode || null } : {}),
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.description !== undefined ? { description: input.description || null } : {}),
    ...(input.categoryId !== undefined ? { categoryId: input.categoryId || null } : {}),
    ...(input.unit !== undefined ? { unit: input.unit } : {}),
    ...(input.mrp !== undefined ? { mrp: input.mrp } : {}),
    ...(input.defaultBuyPrice !== undefined ? { defaultBuyPrice: input.defaultBuyPrice || null } : {}),
    ...(input.defaultSellPrice !== undefined ? { defaultSellPrice: input.defaultSellPrice || null } : {}),
    ...(input.reorderLevel !== undefined ? { reorderLevel: input.reorderLevel } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
  };
}

async function assertCategoryBelongsToStore(storeId: string, categoryId: string | null | undefined) {
  if (categoryId === undefined || categoryId === null || categoryId === "") return;
  const category = await prisma.category.findFirst({ where: { id: categoryId, storeId } });
  if (!category) throw new ApiError("FORBIDDEN", "Category does not belong to this store", 403);
}

export async function listProducts(storeId: string, filters: { search?: string; status?: "ACTIVE" | "INACTIVE"; categoryId?: string; page: number; pageSize: number }) {
  const where = {
    storeId,
    ...(filters.search ? { OR: [{ name: { contains: filters.search, mode: "insensitive" as const } }, { sku: { contains: filters.search, mode: "insensitive" as const } }, { barcode: { contains: filters.search, mode: "insensitive" as const } }] } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, include: { category: { select: { id: true, name: true } } }, orderBy: { name: "asc" }, skip: (filters.page - 1) * filters.pageSize, take: filters.pageSize }),
    prisma.product.count({ where }),
  ]);
  return { items: items.map(serializeProduct), total, page: filters.page, pageSize: filters.pageSize };
}

export async function getProduct(storeId: string, productId: string) {
  const product = await prisma.product.findFirst({ where: { id: productId, storeId }, include: { category: { select: { id: true, name: true } } } });
  if (!product) throw new ApiError("NOT_FOUND", "Product not found", 404);
  return serializeProduct(product);
}

export async function createProduct(storeId: string, input: ProductInput) {
  await assertCategoryBelongsToStore(storeId, input.categoryId);
  const duplicateSku = await prisma.product.findFirst({ where: { storeId, sku: input.sku } });
  if (duplicateSku) throw new ApiError("DUPLICATE_SKU", "A product with this SKU already exists", 409);
  if (input.barcode) {
    const duplicateBarcode = await prisma.product.findFirst({ where: { storeId, barcode: input.barcode } });
    if (duplicateBarcode) throw new ApiError("CONFLICT", "A product with this barcode already exists", 409);
  }

  try {
    const product = await prisma.product.create({ data: { ...productCreateData(input), storeId }, include: { category: { select: { id: true, name: true } } } });
    return serializeProduct(product);
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") throw new ApiError("CONFLICT", "Product SKU or barcode already exists", 409);
    throw error;
  }
}

export async function updateProduct(storeId: string, productId: string, input: ProductUpdateInput) {
  const existing = await prisma.product.findFirst({ where: { id: productId, storeId } });
  if (!existing) throw new ApiError("NOT_FOUND", "Product not found", 404);
  await assertCategoryBelongsToStore(storeId, input.categoryId);
  if (input.sku) {
    const duplicateSku = await prisma.product.findFirst({ where: { storeId, sku: input.sku, NOT: { id: productId } } });
    if (duplicateSku) throw new ApiError("DUPLICATE_SKU", "A product with this SKU already exists", 409);
  }
  if (input.barcode) {
    const duplicateBarcode = await prisma.product.findFirst({ where: { storeId, barcode: input.barcode, NOT: { id: productId } } });
    if (duplicateBarcode) throw new ApiError("CONFLICT", "A product with this barcode already exists", 409);
  }

  try {
    const product = await prisma.product.update({ where: { id: productId }, data: productUpdateData(input), include: { category: { select: { id: true, name: true } } } });
    return serializeProduct(product);
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") throw new ApiError("CONFLICT", "Product SKU or barcode already exists", 409);
    throw error;
  }
}
