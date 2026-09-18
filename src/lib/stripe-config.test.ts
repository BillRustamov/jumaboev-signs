import assert from "node:assert/strict";
import { test } from "node:test";
import { stripeConfig } from "./stripe-config";

function withEnv(values: Record<string, string | undefined>, run: () => void) {
  const previous = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  };
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    run();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("missing Stripe keys keep checkout disabled", () => {
  withEnv({ STRIPE_SECRET_KEY: undefined, STRIPE_WEBHOOK_SECRET: undefined }, () => {
    const config = stripeConfig();
    assert.equal(config.enabled, false);
    assert.equal(config.reason, "missing_keys");
    assert.equal(config.secret, null);
  });
});

test("live Stripe keys never enable checkout", () => {
  withEnv({ STRIPE_SECRET_KEY: "sk_live_example_do_not_use" }, () => {
    const config = stripeConfig();
    assert.equal(config.enabled, false);
    assert.equal(config.reason, "live_blocked");
    assert.equal(config.secret, null);
  });
  withEnv({ STRIPE_SECRET_KEY: "rk_live_example_do_not_use" }, () => {
    assert.equal(stripeConfig().reason, "live_blocked");
  });
});

test("test secret keys enable checkout", () => {
  withEnv({ STRIPE_SECRET_KEY: "sk_test_example" }, () => {
    const config = stripeConfig();
    assert.equal(config.enabled, true);
    assert.equal(config.reason, "ready");
    if (config.enabled) assert.equal(config.secret, "sk_test_example");
  });
});
