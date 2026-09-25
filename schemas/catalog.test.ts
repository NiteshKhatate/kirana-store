import { categorySchema, productSchema } from "@/schemas/catalog";

describe("catalog schemas", () => {
  it("requires category and product names", () => {
    expect(categorySchema.safeParse({ name: "" }).success).toBe(false);
    expect(productSchema.safeParse({ sku: "", name: "", unit: "PIECE", mrp: "0", reorderLevel: "0", status: "ACTIVE" }).success).toBe(false);
  });

  it("accepts decimal prices without allowing negative or excessive precision", () => {
    const valid = productSchema.safeParse({ sku: "RICE-1", name: "Rice", unit: "KG", mrp: "52.50", defaultBuyPrice: "48.25", defaultSellPrice: "52.50", reorderLevel: "2.500", status: "ACTIVE" });
    expect(valid.success).toBe(true);
    expect(productSchema.safeParse({ sku: "RICE-2", name: "Rice", unit: "KG", mrp: "-1", reorderLevel: "0", status: "ACTIVE" }).success).toBe(false);
    expect(productSchema.safeParse({ sku: "RICE-3", name: "Rice", unit: "KG", mrp: "1.999", reorderLevel: "0", status: "ACTIVE" }).success).toBe(false);
  });
});
