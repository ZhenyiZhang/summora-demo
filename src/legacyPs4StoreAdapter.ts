import { calculateDisplayPrice } from "./pricingService";
import type { LegacyPricePayload, Platform, PriceInput } from "./types";

const LEGACY_PLATFORM: Platform = "PS4_LEGACY";

/**
 * Adapter responsible for shaping pricing data for the legacy PS4 Storefront.
 *
 * NOTE: This is where the JP pricing bug lives for the demo.
 */
export function buildLegacyPs4PricePayload(
  skuId: string,
  input: PriceInput
): LegacyPricePayload {
  const price = calculateDisplayPrice(input);

  let displayAmount = price.amount;

  if (price.currency === "JPY") {
    /**
     * BUG (for demo):
     *
     * Legacy PS4 firmware expects "price in tens of Yen" but the metadata
     * contract was updated to "price in Yen". This adapter never removed the
     * division, so 8000 Yen becomes 800.
     *
     *  - Intended: 8000 -> 8000
     *  - Actual:   8000 -> 800
     */
    displayAmount = Math.floor(displayAmount / 10);
  }

  return {
    skuId,
    platform: LEGACY_PLATFORM,
    region: input.region,
    displayAmount,
    currency: price.currency,
  };
}

