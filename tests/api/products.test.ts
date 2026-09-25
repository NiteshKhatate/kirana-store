import handler from "@/pages/api/products/index";

describe("products API", () => {
  it("rejects unauthenticated requests", async () => {
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
    };

    await handler({ method: "GET", query: {}, headers: {} } as never, response as never);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ data: null, error: { code: "UNAUTHORIZED", message: "Authentication is required" } });
  });
});
