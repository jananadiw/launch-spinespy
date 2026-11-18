import { describe, expect, it } from "vitest";
import type Stripe from "stripe";
import { isChargeFullyRefunded } from "./stripe-refunds";

describe("isChargeFullyRefunded", () => {
  it("returns false for partial refunds", () => {
    const charge = {
      amount: 500,
      amount_refunded: 100,
      refunded: false,
    } as Stripe.Charge;
    expect(isChargeFullyRefunded(charge)).toBe(false);
  });

  it("returns true when refunded flag is set", () => {
    const charge = {
      amount: 500,
      amount_refunded: 100,
      refunded: true,
    } as Stripe.Charge;
    expect(isChargeFullyRefunded(charge)).toBe(true);
  });

  it("returns true when amount_refunded covers amount", () => {
    const charge = {
      amount: 500,
      amount_refunded: 500,
      refunded: false,
    } as Stripe.Charge;
    expect(isChargeFullyRefunded(charge)).toBe(true);
  });
});
