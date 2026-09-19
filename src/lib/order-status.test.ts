import assert from "node:assert/strict";
import { test } from "node:test";
import { emptySign } from "./order";
import {
  assertPaymentMove,
  assertProductionMove,
  canEnterReadyForPayment,
  hydrateOrder,
  initialProductionStatus,
  stampNewOrder,
} from "./order-status";

test("legacy received becomes RECEIVED and UNPAID", () => {
  const order = hydrateOrder({
    ...emptySign(),
    id: "JS-1",
    username: "shop",
    source: "web",
    createdAt: "2026-01-01T00:00:00.000Z",
    status: "received",
  });
  assert.equal(order.productionStatus, "RECEIVED");
  assert.equal(order.paymentStatus, "UNPAID");
  assert.equal(order.quantity, 1);
  assert.equal(order.widthIn, 20);
  assert.equal(order.heightIn, 12);
  assert.equal(order.amountMinor, null);
});

test("print-only notes start in needs review", () => {
  assert.equal(
    initialProductionStatus({
      service: "PRINT_ONLY",
      printExact: false,
      printNotes: "move the MC down",
    }),
    "NEEDS_REVIEW",
  );
  assert.equal(
    initialProductionStatus({ service: "CUSTOM_DESIGN" }),
    "RECEIVED",
  );
});

test("ready for payment requires a real price", () => {
  const order = stampNewOrder({
    ...emptySign(),
    id: "JS-2",
    username: "shop",
    source: "web",
    createdAt: "2026-01-01T00:00:00.000Z",
    status: "received",
    service: "CUSTOM_DESIGN",
  });
  assert.match(canEnterReadyForPayment(order) ?? "", /price/);
  order.amountMinor = 0;
  assert.match(canEnterReadyForPayment(order) ?? "", /price/);
  order.amountMinor = 8500;
  order.productionStatus = "APPROVED";
  assert.equal(canEnterReadyForPayment(order), null);
  assert.equal(assertProductionMove(order, "READY_FOR_PAYMENT"), null);
});

test("admin cannot mark a ticket paid", () => {
  assert.match(assertPaymentMove("PAID") ?? "", /not set by hand/);
  assert.match(assertPaymentMove("REFUNDED") ?? "", /not set by hand/);
});
