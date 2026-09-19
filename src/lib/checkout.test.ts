import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyCheckoutStarted,
  applyVerifiedPayment,
  applyWebhookDecision,
  checkoutBlockReason,
  decideWebhook,
  describeCheckout,
  paymentFromSuccessUrl,
  type StripeLikeEvent,
} from "./checkout";
import { emptySign } from "./order";
import { payT } from "./order-copy";
import { stampNewOrder } from "./order-status";
import { LANGS } from "./shop-entry";

function ticket(overrides: Record<string, unknown> = {}) {
  return {
    ...stampNewOrder({
      ...emptySign(),
      id: "JS-8500",
      username: "shop",
      source: "web",
      createdAt: "2026-01-01T00:00:00.000Z",
      status: "received",
      service: "CUSTOM_DESIGN",
    }),
    amountMinor: 8500,
    productionStatus: "READY_FOR_PAYMENT" as const,
    ...overrides,
  };
}

const disabled = {
  enabled: false as const,
  reason: "missing_keys" as const,
  secret: null,
  webhookSecret: null,
};

const enabled = {
  enabled: true as const,
  reason: "ready" as const,
  secret: "sk_test_example",
  webhookSecret: "whsec_example",
};

test("every shop language has Stripe pay copy", () => {
  for (const lang of LANGS) {
    assert.match(payT(lang, "payMissingKeys"), /\S/);
    assert.match(payT(lang, "payWaitWebhook"), /\S/);
    assert.match(payT(lang, "payConfirmed"), /\S/);
    assert.match(payT(lang, "payReturnLead"), /\S/);
  }
});

test("pay page stays disabled when Stripe keys are missing", () => {
  const state = describeCheckout(ticket(), disabled);
  assert.equal(state.enabled, false);
  assert.equal(state.reason, "missing_keys");
  assert.match(checkoutBlockReason(ticket(), disabled) ?? "", /missing/);
});

test("live keys keep the Pay button closed even if the ticket is ready", () => {
  const state = describeCheckout(ticket(), {
    enabled: false,
    reason: "live_blocked",
    secret: null,
    webhookSecret: null,
  });
  assert.equal(state.enabled, false);
  assert.equal(state.reason, "live_blocked");
});

test("already paid tickets never open checkout", () => {
  const state = describeCheckout(ticket({ paymentStatus: "PAID" }), enabled);
  assert.equal(state.enabled, false);
  assert.equal(state.reason, "already_paid");
});

test("starting checkout only marks pending, never paid", () => {
  const next = applyCheckoutStarted(ticket(), "cs_test_1");
  assert.equal(next.paymentStatus, "PAYMENT_PENDING");
  assert.equal(next.stripeCheckoutSessionId, "cs_test_1");
  assert.notEqual(next.paymentStatus, "PAID");
});

test("verified webhook marks paid only when the amount matches", () => {
  const paid = applyVerifiedPayment(ticket(), {
    amountMinor: 8500,
    sessionId: "cs_test_1",
    paymentIntentId: "pi_test_1",
  });
  assert.equal(paid.paymentStatus, "PAID");
  assert.throws(() =>
    applyVerifiedPayment(ticket(), {
      amountMinor: 1,
      sessionId: "cs_test_2",
    }),
  );
});

test("success URL never writes a payment status", () => {
  assert.equal(paymentFromSuccessUrl(), null);
});

function event(
  type: string,
  object: Record<string, unknown>,
  extras: Partial<StripeLikeEvent> = {},
): StripeLikeEvent {
  return {
    id: extras.id ?? "evt_test_1",
    type,
    livemode: extras.livemode ?? false,
    data: { object },
  };
}

test("live webhook events are refused and do not mark paid", () => {
  const decision = decideWebhook(
    event(
      "checkout.session.completed",
      {
        id: "cs_live_1",
        amount_total: 8500,
        currency: "usd",
        payment_status: "paid",
        metadata: { orderId: "JS-8500" },
      },
      { livemode: true },
    ),
    ticket(),
  );
  assert.equal(decision.action, "reject");
  assert.match(decision.detail, /Live/);
});

test("completed session with matching amount becomes paid", () => {
  const decision = decideWebhook(
    event("checkout.session.completed", {
      id: "cs_test_1",
      amount_total: 8500,
      currency: "usd",
      payment_status: "paid",
      payment_intent: "pi_test_1",
      metadata: { orderId: "JS-8500" },
    }),
    ticket({ paymentStatus: "PAYMENT_PENDING" }),
  );
  assert.equal(decision.action, "paid");
  const next = applyWebhookDecision(
    ticket({ paymentStatus: "PAYMENT_PENDING" }),
    decision,
  );
  assert.equal(next.paymentStatus, "PAID");
});

test("amount mismatch is rejected and stays unpaid", () => {
  const order = ticket();
  const decision = decideWebhook(
    event("checkout.session.completed", {
      id: "cs_test_2",
      amount_total: 1,
      currency: "usd",
      payment_status: "paid",
      metadata: { orderId: "JS-8500" },
    }),
    order,
  );
  assert.equal(decision.action, "reject");
  assert.equal(applyWebhookDecision(order, decision).paymentStatus, "UNPAID");
});

test("idempotent paid webhook does not fail", () => {
  const decision = decideWebhook(
    event("checkout.session.completed", {
      id: "cs_test_1",
      amount_total: 8500,
      currency: "usd",
      payment_status: "paid",
    }),
    ticket({ paymentStatus: "PAID" }),
  );
  assert.equal(decision.action, "ignore");
});
