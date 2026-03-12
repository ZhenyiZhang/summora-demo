import type { Money } from "../src/types";
import {
  AuditTrail,
  type AuditEventKind,
} from "../src/auditTrail";

describe("AuditTrail", () => {
  const makeMoney = (amount: number): Money => ({
    amount,
    currency: "JPY",
  });

  const baseEvent = {
    id: "evt-1",
    at: new Date("2026-03-12T00:00:00Z"),
    skuId: "ASTRO-JP-SE",
    region: "JP",
  };

  it("records and retrieves events", () => {
    const trail = new AuditTrail();

    trail.record({
      ...baseEvent,
      kind: "PRICE_COMPUTED",
      rawCents: 800000,
      displayPrice: makeMoney(8000),
    });

    const events = trail.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe<AuditEventKind>("PRICE_COMPUTED");
  });

  it("filters by sku and kind", () => {
    const trail = new AuditTrail();

    trail.record({
      ...baseEvent,
      kind: "PRICE_COMPUTED",
      rawCents: 800000,
      displayPrice: makeMoney(8000),
    });

    trail.record({
      ...baseEvent,
      id: "evt-2",
      kind: "ADAPTER_PAYLOAD_BUILT",
      platform: "PS4_LEGACY",
    });

    const skuEvents = trail.getEventsForSku("ASTRO-JP-SE");
    const adapterEvents = trail.getEventsByKind("ADAPTER_PAYLOAD_BUILT");

    expect(skuEvents).toHaveLength(2);
    expect(adapterEvents).toHaveLength(1);
    expect(adapterEvents[0].kind).toBe("ADAPTER_PAYLOAD_BUILT");
  });

  it("clears events", () => {
    const trail = new AuditTrail();

    trail.record({
      ...baseEvent,
      kind: "PRICE_COMPUTED",
      rawCents: 800000,
      displayPrice: makeMoney(8000),
    });

    expect(trail.getEvents()).toHaveLength(1);
    trail.clear();
    expect(trail.getEvents()).toHaveLength(0);
  });
});

