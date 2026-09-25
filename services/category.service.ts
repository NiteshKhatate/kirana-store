import { ApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";
import type { CategoryInput } from "@/schemas/catalog";

function serializeCategory(category: { id: string; storeId: string; name: string; description: string | null; createdAt: Date; updatedAt: Date }) {
  return { ...category, createdAt: category.createdAt.toISOString(), updatedAt: category.updatedAt.toISOString() };
}

export async function listCategories(storeId: string) {
  const categories = await prisma.category.findMany({ where: { storeId }, orderBy: { name: "asc" } });
  return categories.map(serializeCategory);
}

export async function createCategory(storeId: string, input: CategoryInput) {
  const existing = await prisma.category.findFirst({ where: { storeId, name: input.name } });
  if (existing) throw new ApiError("CONFLICT", "A category with this name already exists", 409);

  try {
    const category = await prisma.category.create({ data: { storeId, name: input.name, description: input.description } });
    return serializeCategory(category);
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") throw new ApiError("CONFLICT", "A category with this name already exists", 409);
    throw error;
  }
}

export async function updateCategory(storeId: string, categoryId: string, input: CategoryInput) {
  const existing = await prisma.category.findFirst({ where: { id: categoryId, storeId } });
  if (!existing) throw new ApiError("NOT_FOUND", "Category not found", 404);

  const duplicate = await prisma.category.findFirst({ where: { storeId, name: input.name, NOT: { id: categoryId } } });
  if (duplicate) throw new ApiError("CONFLICT", "A category with this name already exists", 409);

  try {
    const category = await prisma.category.update({ where: { id: categoryId }, data: input });
    return serializeCategory(category);
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") throw new ApiError("CONFLICT", "A category with this name already exists", 409);
    throw error;
  }
}
