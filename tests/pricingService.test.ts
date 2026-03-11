import { calculateDisplayPrice } from "../src/pricingService";
import type { PriceInput } from "../src/types";

describe("pricingService.calculateDisplayPrice", () => {
  it("correctly formats JP pricing without decimals", () => {
    const input: PriceInput = {
      basePriceCents: 800000, // ¥8,000
      region: "JP",
    };

    const result = calculateDisplayPrice(input);

    expect(result.currency).toBe("JPY");
    expect(result.amount).toBe(8000);
  });

  it("handles non-JP regions (basic check)", () => {
    const input: PriceInput = {
      basePriceCents: 4999, // $49.99
      region: "US",
    };

    const result = calculateDisplayPrice(input);

    expect(result.currency).toBe("USD");
    expect(result.amount).toBeCloseTo(49.99);
  });
});

