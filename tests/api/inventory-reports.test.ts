import inventoryHandler from "@/pages/api/inventory/index";
import reportsHandler from "@/pages/api/reports";

const response = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis(), setHeader: jest.fn() });

describe("inventory and reports APIs", () => {
  it("reject unauthenticated inventory access", async () => { const res = response(); await inventoryHandler({ method: "GET", query: {}, headers: {} } as never, res as never); expect(res.status).toHaveBeenCalledWith(401); });
  it("reject unauthenticated report access", async () => { const res = response(); await reportsHandler({ method: "GET", query: { type: "sales" }, headers: {} } as never, res as never); expect(res.status).toHaveBeenCalledWith(401); });
});
