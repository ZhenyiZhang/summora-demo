import { calculateDisplayPrice } from "./pricingService";
import type { LegacyPricePayload, Platform, PriceInput } from "./types";
const LEGACY_PLATFORM: Platform = "PS4_LEGACY";
/**
 * Adapter responsible for shaping pricing data for the legacy PS4 Storefront.
 *
 * This version contains the **fix** for the JP pricing bug that previously
 * dropped the last zero (¥8,000 -> ¥800) on legacy PS4.
 */
export function buildLegacyPs4PricePayload(
  skuId: string,
  input: PriceInput
): LegacyPricePayload {
  const price = calculateDisplayPrice(input);
  let displayAmount = price.amount;
  if (price.currency === "JPY") {
    // FIX: legacy firmware now expects prices in Yen, not "tens of Yen".
    // We therefore do NOT divide by 10 anymore.
    displayAmount = price.amount;
  }
  return {
    skuId,
    platform: LEGACY_PLATFORM,
    region: input.region,
    displayAmount,
    currency: price.currency,
  };
}