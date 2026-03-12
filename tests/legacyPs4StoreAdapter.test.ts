import { buildLegacyPs4PricePayload } from "../src/legacyPs4StoreAdapter";
import type { PriceInput } from "../src/types";
describe("legacyPs4StoreAdapter.buildLegacyPs4PricePayload", () => {
  it("keeps non-JP pricing untouched for legacy PS4", () => {
    const input: PriceInput = {
      basePriceCents: 5999,
      region: "US",
    };
    const payload = buildLegacyPs4PricePayload("ASTRO-US", input);
    expect(payload.displayAmount).toBeGreaterThan(0);
    expect(payload.currency).toBe("USD");
    expect(payload.region).toBe("US");
  });
  // This test is ENABLED on the hotfix branch to prove the fix.
  it("charges the full intended amount for JP Astro Special Edition on legacy PS4", () => {
    const input: PriceInput = {
      basePriceCents: 800000, // Intended ¥8,000
      region: "JP",
    };
    const payload = buildLegacyPs4PricePayload("ASTRO-JP-SE", input);
    expect(payload.displayAmount).toBe(8000);
    expect(payload.currency).toBe("JPY");
    expect(payload.region).toBe("JP");
  });
});