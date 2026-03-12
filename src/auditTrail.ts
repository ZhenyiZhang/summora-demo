import type { Money } from "./types";

export type AuditEventKind =
  | "PRICE_COMPUTED"
  | "DISCOUNT_APPLIED"
  | "ADAPTER_PAYLOAD_BUILT";

export interface AuditEventBase {
  id: string;
  at: Date;
  kind: AuditEventKind;
  skuId: string;
  region: string;
}

export interface PriceComputedEvent extends AuditEventBase {
  kind: "PRICE_COMPUTED";
  rawCents: number;
  displayPrice: Money;
}

export interface DiscountAppliedEvent extends AuditEventBase {
  kind: "DISCOUNT_APPLIED";
  discountReasons: string[];
  before: Money;
  after: Money;
}

export interface AdapterPayloadBuiltEvent extends AuditEventBase {
  kind: "ADAPTER_PAYLOAD_BUILT";
  platform: string;
}

export type AuditEvent =
  | PriceComputedEvent
  | DiscountAppliedEvent
  | AdapterPayloadBuiltEvent;

export class AuditTrail {
  private readonly events: AuditEvent[] = [];

  record(event: AuditEvent): void {
    this.events.push(event);
  }

  getEvents(): AuditEvent[] {
    return [...this.events];
  }

  getEventsForSku(skuId: string): AuditEvent[] {
    return this.events.filter((e) => e.skuId === skuId);
  }

  getEventsByKind(kind: AuditEventKind): AuditEvent[] {
    return this.events.filter((e) => e.kind === kind);
  }

  clear(): void {
    this.events.length = 0;
  }
}

