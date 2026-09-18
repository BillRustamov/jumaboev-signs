import assert from "node:assert/strict";
import { test } from "node:test";
import { emptySign } from "./order";
import { stampNewOrder } from "./order-status";
import {
  canOfferPayLink,
  customerOrdersText,
  mergeShopOrders,
  messageClaimsPaid,
  paymentChangeMessage,
  ticketSyncLine,
} from "./payment-sync";
import { LANGS } from "./shop-entry";

function ticket(overrides: Record<string, unknown> = {}) {
  return {
    ...stampNewOrder({
      ...emptySign(),
      id: "JS-8500",
      username: "shop",
      source: "telegram" as const,
      createdAt: "2026-01-01T00:00:00.000Z",
      status: "received",
      service: "CUSTOM_DESIGN",
      telegramChatId: 42,
      language: "en",
    }),
    amountMinor: 8500,
    productionStatus: "READY_FOR_PAYMENT" as const,
    ...overrides,
  };
}

test("sync copy never claims paid unless the store says PAID", () => {
  const unpaid = ticket({ paymentStatus: "UNPAID" });
  assert.equal(messageClaimsPaid(unpaid), false);
  assert.match(paymentChangeMessage(unpaid, "en"), /unpaid/i);
  assert.doesNotMatch(paymentChangeMessage(unpaid, "en"), /ticket is paid/i);

  const pending = ticket({ paymentStatus: "PAYMENT_PENDING" });
  assert.equal(messageClaimsPaid(pending), false);
  assert.doesNotMatch(paymentChangeMessage(pending, "en"), /This ticket is paid/i);

  const failed = ticket({ paymentStatus: "PAYMENT_FAILED" });
  assert.equal(messageClaimsPaid(failed), false);
  assert.doesNotMatch(paymentChangeMessage(failed, "en"), /This ticket is paid/i);

  const paid = ticket({ paymentStatus: "PAID" });
  assert.equal(messageClaimsPaid(paid), true);
  assert.match(paymentChangeMessage(paid, "en"), /is paid/i);
});

test("every shop language can render a stored unpaid ticket", () => {
  const unpaid = ticket({ paymentStatus: "UNPAID" });
  for (const lang of LANGS) {
    const text = paymentChangeMessage(unpaid, lang);
    assert.match(text, /JS-8500/);
    assert.equal(messageClaimsPaid(unpaid), false);
    assert.ok(text.length > 10, lang);
  }
});

test("my-orders list is empty until the store has tickets for that chat", () => {
  assert.match(customerOrdersText([], "en"), /No tickets/);
  const text = customerOrdersText([ticket()], "en");
  assert.match(text, /JS-8500/);
  assert.match(text, /Unpaid|UNPAID|unpaid/);
});

test("pay link is offered only when ready and not already paid", () => {
  assert.equal(canOfferPayLink(ticket({ paymentStatus: "UNPAID" })), true);
  assert.equal(canOfferPayLink(ticket({ paymentStatus: "PAID" })), false);
  assert.equal(
    canOfferPayLink(ticket({ productionStatus: "RECEIVED", paymentStatus: "UNPAID" })),
    false,
  );
});

test("server payment status wins over a stale local copy", () => {
  const localPaidGuess = ticket({ paymentStatus: "PAID" });
  const server = ticket({ paymentStatus: "UNPAID" });
  const merged = mergeShopOrders([server], [localPaidGuess]);
  assert.equal(merged[0]?.paymentStatus, "UNPAID");
  assert.equal(messageClaimsPaid(merged[0]!), false);
});

test("ticket line includes production and payment from the order", () => {
  const line = ticketSyncLine(
    ticket({ productionStatus: "IN_PRODUCTION", paymentStatus: "PAYMENT_FAILED" }),
    "en",
  );
  assert.match(line, /In production/);
  assert.match(line, /Payment failed/);
});
