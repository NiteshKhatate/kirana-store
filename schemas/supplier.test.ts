import { supplierSchema } from "@/schemas/catalog";

describe("supplier schema", () => {
  it("requires a supplier name", () => {
    expect(supplierSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("accepts optional contact details", () => {
    expect(supplierSchema.safeParse({ name: "Fresh Foods", phone: "9876543210", address: "Market Road", gstNumber: "GST-123" }).success).toBe(true);
  });
});
