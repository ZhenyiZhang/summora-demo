import type { Money, PriceInput } from "../src/types";
import {
  applyDiscountsToPrice,
  computeDiscountedPrice,
  deriveLoyaltyDiscount,
  deriveRegionalDiscount,
  type AppliedDiscount,
} from "../src/discountEngine";

describe("discountEngine", () => {
  const baseMoney: Money = { amount: 100, currency: "USD" };

  it("derives a JP regional promo in March", () => {
    const marchDate = new Date(Date.UTC(2026, 2, 1));
    const promo = deriveRegionalDiscount("JP", marchDate);
    expect(promo).not.toBeNull();
    expect(promo!.percentage).toBeGreaterThan(0);
  });

  it("does not derive a regional promo for unsupported month/region combos", () => {
    const promo = deriveRegionalDiscount("EU", new Date(Date.UTC(2026, 5, 1)));
    expect(promo).toBeNull();
  });

  it("derives loyalty discounts for gold and silver tiers", () => {
    const gold = deriveLoyaltyDiscount("gold");
    const silver = deriveLoyaltyDiscount("silver");
    const unknown = deriveLoyaltyDiscount("bronze");

    expect(gold).not.toBeNull();
    expect(silver).not.toBeNull();
    expect(unknown).toBeNull();
  });

  it("applies multiple discounts and clamps totals", () => {
    const discounts: AppliedDiscount[] = [
      { reason: "REGIONAL_PROMO", percentage: 0.1 },
      { reason: "LOYALTY", percentage: 0.05 },
    ];

    const discounted = applyDiscountsToPrice(baseMoney, discounts);

    expect(discounted.amount).toBeCloseTo(85);
  });

  it("computes a discounted price end-to-end for a JP gold customer", () => {
    const input: PriceInput = {
      basePriceCents: 10000,
      region: "JP",
    };

    const base: Money = {
      amount: 100,
      currency: "JPY",
    };

    const result = computeDiscountedPrice(
      {
        region: input.region,
        originalPrice: input,
        loyaltyTier: "gold",
      },
      base
    );

    expect(result.base.amount).toBe(100);
    expect(result.final.amount).toBeLessThan(100);
    expect(result.applied.length).toBeGreaterThan(0);
  });
});

