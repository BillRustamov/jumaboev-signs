import assert from "node:assert/strict";
import { test } from "node:test";
import Stripe from "stripe";
import { constructStripeEvent } from "./stripe";

test("webhook constructor accepts a signed payload and rejects a bad signature", () => {
  const secret = "whsec_test_jumaboev_signs";
  const previous = process.env.STRIPE_WEBHOOK_SECRET;
  process.env.STRIPE_WEBHOOK_SECRET = secret;
  const payload = JSON.stringify({
    id: "evt_test_signed",
    object: "event",
    type: "checkout.session.completed",
    livemode: false,
    data: {
      object: {
        id: "cs_test_signed",
        amount_total: 8500,
        currency: "usd",
        payment_status: "paid",
      },
    },
  });
  const signature = Stripe.webhooks.generateTestHeaderString({
    payload,
    secret,
  });
  try {
    const event = constructStripeEvent(payload, signature);
    assert.equal(event.id, "evt_test_signed");
    assert.equal(event.type, "checkout.session.completed");
    assert.throws(() => constructStripeEvent(payload, "t=1,v1=deadbeef"));
  } finally {
    if (previous === undefined) delete process.env.STRIPE_WEBHOOK_SECRET;
    else process.env.STRIPE_WEBHOOK_SECRET = previous;
  }
});
