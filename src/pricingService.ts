import type { Money, PriceInput, Region } from "./types";

function currencyForRegion(region: Region): Money["currency"] {
  switch (region) {
    case "JP":
      return "JPY";
    case "US":
      return "USD";
    case "EU":
    default:
      return "EUR";
  }
}

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
    const amount = Math.round(input.basePriceCents / 100);
    return { amount, currency };
  }

  // For non-JP regions this demo keeps it simple and just returns a
  // 2-decimal style amount, but represented as integer "cents" for tests.
  const amount = Math.round(input.basePriceCents) / 100;
  return { amount, currency } as Money;
}

