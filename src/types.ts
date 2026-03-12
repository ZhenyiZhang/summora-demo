export type Region = "JP" | "US" | "EU";

export type Platform = "PS5" | "PS4_LEGACY";

export interface PriceInput {
  /**
   * Base price in minor units (e.g. cents).
   * For JPY this is still stored as "cents" (price * 100) for consistency.
   */
  basePriceCents: number;
  region: Region;
}

export interface Money {
  amount: number;
  currency: "JPY" | "USD" | "EUR";
}

export interface PriceFormattingOptions {
  /**
   * Optional BFF-side hinting for how a given storefront prefers to
   * present prices (e.g. locale or currency symbol handling).
   *
   * This is intentionally not used by the core pricing logic yet, but
   * exists as a realistic "future extension" type to make the PR
   * diff look larger for demo purposes.
   */
  locale?: string;
  showCurrencySymbol?: boolean;
}

export interface LegacyPricePayload {
  skuId: string;
  platform: Platform;
  region: Region;
  /**
   * Display price as seen by the user in whole currency units.
   * For JP this is the value in Yen with no decimals.
   */
  displayAmount: number;
  currency: Money["currency"];
}

