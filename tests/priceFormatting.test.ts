import {
  calculateJpyDisplayMoney,
  calculateNonJpDisplayMoney,
  currencyForRegion,
} from "../src/priceFormatting";
import type { PriceInput, Money } from "../src/types";

describe("priceFormatting helpers", () => {
  describe("currencyForRegion", () => {
    it("maps JP to JPY", () => {
      expect(currencyForRegion("JP")).toBe<Money["currency"]>("JPY");
    });

    it("maps US to USD", () => {
      expect(currencyForRegion("US")).toBe<Money["currency"]>("USD");
    });

    it("maps unknown / EU to EUR", () => {
      expect(currencyForRegion("EU")).toBe<Money["currency"]>("EUR");
    });
  });

  describe("calculateJpyDisplayMoney", () => {
    it("converts cents to whole Yen without decimals", () => {
      const input: PriceInput = {
        basePriceCents: 800000, // ¥8,000
        region: "JP",
      };

      const result = calculateJpyDisplayMoney(input);

      expect(result.currency).toBe("JPY");
      expect(result.amount).toBe(8000);
    });
  });

  describe("calculateNonJpDisplayMoney", () => {
    it("rounds to 2 decimal places from cents for non-JP regions", () => {
      const input: PriceInput = {
        basePriceCents: 4999, // $49.99
        region: "US",
      };

      const result = calculateNonJpDisplayMoney(input, "USD");

      expect(result.currency).toBe("USD");
      expect(result.amount).toBeCloseTo(49.99);
    });
  });
}

