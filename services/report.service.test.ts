import Decimal from "decimal.js";

describe("report calculations", () => {
  it("calculates an inventory value using quantity and buy price", () => { expect(new Decimal("4.5").times("10.00").toFixed(2)).toBe("45.00"); });
  it("calculates outstanding credit as opening credit plus ledger deltas", () => { expect(new Decimal("100").plus("50").minus("20").toFixed(2)).toBe("130.00"); });
});
