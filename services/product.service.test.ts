import { createProduct } from "@/services/product.service";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      findFirst: jest.fn(),
    },
    product: {
      findFirst: jest.fn(),
    },
  },
}));

describe("product service", () => {
  it("rejects duplicate SKU within the authenticated store", async () => {
    const findFirst = prisma.product.findFirst as jest.Mock;
    findFirst.mockResolvedValueOnce({ id: "existing-product" });

    await expect(createProduct("store-a", { sku: "SKU-1", name: "Rice", unit: "KG", mrp: "10.00", reorderLevel: "0", status: "ACTIVE" })).rejects.toMatchObject({ code: "DUPLICATE_SKU" });
    expect(findFirst).toHaveBeenCalledWith({ where: { storeId: "store-a", sku: "SKU-1" } });
  });

  it("rejects a category belonging to another store", async () => {
    const categoryFindFirst = prisma.category.findFirst as jest.Mock;
    categoryFindFirst.mockResolvedValueOnce(null);

    await expect(createProduct("store-b", { sku: "SKU-2", name: "Rice", unit: "KG", mrp: "10.00", reorderLevel: "0", status: "ACTIVE", categoryId: "ckat3g3g3g3g3g3g3g3g3g3g3" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(categoryFindFirst).toHaveBeenCalledWith({ where: { id: "ckat3g3g3g3g3g3g3g3g3g3g3", storeId: "store-b" } });
  });
});
