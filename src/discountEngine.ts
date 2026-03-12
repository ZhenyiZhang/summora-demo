import type { Money, PriceInput, Region } from "./types";

export type DiscountReason =
  | "REGIONAL_PROMO"
  | "FLASH_SALE"
  | "LOYALTY"
  | "CORRECTION";

export interface DiscountContext {
  region: Region;
  /**
   * Raw, un-discounted price input.
   */
  originalPrice: PriceInput;
  /**
   * Arbitrary flag, e.g. "gold", "silver".
   */
  loyaltyTier?: string;
}

export interface AppliedDiscount {
  reason: DiscountReason;
  /**
   * A percentage in the range \[0, 1\], where 0.15 means "15% off".
   */
  percentage: number;
}

export interface DiscountComputationResult {
  base: Money;
  final: Money;
  applied: AppliedDiscount[];
}

function clampPercentage(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
}

export function deriveRegionalDiscount(
  region: Region,
  now: Date = new Date()
): AppliedDiscount | null {
  const month = now.getUTCMonth();

  if (region === "JP" && month === 2) {
    return {
      reason: "REGIONAL_PROMO",
      percentage: 0.1,
    };
  }

  if (region === "US" && month === 10) {
    return {
      reason: "FLASH_SALE",
      percentage: 0.2,
    };
  }

  return null;
}

export function deriveLoyaltyDiscount(
  loyaltyTier: string | undefined
): AppliedDiscount | null {
  if (!loyaltyTier) {
    return null;
  }
  if (loyaltyTier.toLowerCase() === "gold") {
    return { reason: "LOYALTY", percentage: 0.05 };
  }
  if (loyaltyTier.toLowerCase() === "silver") {
    return { reason: "LOYALTY", percentage: 0.02 };
  }
  return null;
}

export function applyDiscountsToPrice(
  base: Money,
  discounts: AppliedDiscount[]
): Money {
  const totalPercentage = clampPercentage(
    discounts.reduce((acc, d) => acc + clampPercentage(d.percentage), 0)
  );

  if (totalPercentage === 0) {
    return base;
  }

  const discountedAmount = base.amount * (1 - totalPercentage);
  const roundedAmount =
    base.currency === "JPY"
      ? Math.round(discountedAmount)
      : Math.round(discountedAmount * 100) / 100;

  return {
    ...base,
    amount: roundedAmount,
  };
}

export function computeDiscountedPrice(
  ctx: DiscountContext,
  base: Money,
  correctionDiscount?: AppliedDiscount | null
): DiscountComputationResult {
  const regional = deriveRegionalDiscount(ctx.region);
  const loyalty = deriveLoyaltyDiscount(ctx.loyaltyTier);

  const applied = [
    regional,
    loyalty,
    correctionDiscount ?? null,
  ].filter((d): d is AppliedDiscount => d !== null);

  const final = applyDiscountsToPrice(base, applied);

  return {
    base,
    final,
    applied,
  };
}

