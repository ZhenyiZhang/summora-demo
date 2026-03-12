import type { Money, PriceInput, Region } from "./types";

export function currencyForRegion(region: Region): Money["currency"] {
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

export function calculateJpyDisplayMoney(input: PriceInput): Money {
  const amount = Math.round(input.basePriceCents / 100);
  return { amount, currency: "JPY" };
}

export function calculateNonJpDisplayMoney(
  input: PriceInput,
  currency: Exclude<Money["currency"], "JPY">
): Money {
  const amount = Math.round(input.basePriceCents) / 100;
  return { amount, currency };
}

