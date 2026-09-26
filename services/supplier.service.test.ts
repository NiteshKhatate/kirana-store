import { getSupplier, listSuppliers } from "@/services/supplier.service";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    supplier: { findFirst: jest.fn(), findMany: jest.fn(), count: jest.fn() },
  },
}));

describe("supplier service", () => {
  it("scopes supplier lookup to the authenticated store", async () => {
    const findFirst = prisma.supplier.findFirst as jest.Mock;
    findFirst.mockResolvedValueOnce(null);

    await expect(getSupplier("store-b", "supplier-a")).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(findFirst).toHaveBeenCalledWith({ where: { id: "supplier-a", storeId: "store-b" } });
  });

  it("scopes supplier search and pagination to the authenticated store", async () => {
    (prisma.supplier.findMany as jest.Mock).mockResolvedValueOnce([]);
    (prisma.supplier.count as jest.Mock).mockResolvedValueOnce(0);

    await expect(listSuppliers("store-a", { search: "fresh", page: 2, pageSize: 25 })).resolves.toMatchObject({ items: [], total: 0, page: 2, pageSize: 25 });
    expect(prisma.supplier.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ storeId: "store-a" }), skip: 25, take: 25 }));
    expect(prisma.supplier.count).toHaveBeenCalledWith({ where: expect.objectContaining({ storeId: "store-a" }) });
  });
});
