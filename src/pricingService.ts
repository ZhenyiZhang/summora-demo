import type { Money, PriceInput } from "./types";
import {
  calculateJpyDisplayMoney,
  calculateNonJpDisplayMoney,
  currencyForRegion,
} from "./priceFormatting";

/**
 * Core pricing logic used by all Storefronts.
 *
 * For JP:
 * - We do not show decimals.
 * - We round to the nearest Yen.
 */
export function calculateDisplayPrice(input: PriceInput): Money {
  const currency = currencyForRegion(input.region);

  if (currency === "JPY") {
    return calculateJpyDisplayMoney(input);
  }

  // For non-JP regions this demo keeps it simple and just returns a
  // 2-decimal style amount, but represented as integer "cents" for tests.
  return calculateNonJpDisplayMoney(
    input,
    currency as Exclude<Money["currency"], "JPY">
  );
}

