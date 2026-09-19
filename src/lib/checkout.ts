import type { SignOrder } from "@/lib/order";
import { isPriced } from "@/lib/money";
import { paymentOf, productionOf, type PaymentStatus } from "@/lib/order-status";
import {
  stripeConfig,
  type StripeConfig,
  type StripeDisableReason,
} from "@/lib/stripe-config";

export type CheckoutReason =
  | StripeDisableReason
  | "not_ready"
  | "no_price"
  | "already_paid"
  | "cancelled"
  | "ready"
  | "pending"
  | "failed"
  | "refunded";

export type CheckoutPublic = {
  enabled: boolean;
  reason: CheckoutReason;
};

export type StripeLikeEvent = {
  id: string;
  type: string;
  livemode: boolean;
  data: { object: Record<string, unknown> };
};

export type WebhookDecision =
  | { action: "ignore"; detail: string }
  | { action: "reject"; detail: string }
  | {
      action: "paid";
      sessionId: string;
      paymentIntentId?: string;
      amountMinor: number;
    }
  | { action: "failed"; sessionId?: string; paymentIntentId?: string }
  | { action: "unpaid"; sessionId?: string }
  | { action: "refunded"; partial: boolean; paymentIntentId?: string };

export function describeCheckout(
  order: SignOrder,
  config: StripeConfig = stripeConfig(),
): CheckoutPublic {
  const payment = paymentOf(order);
  if (payment === "PAID") {
    return { enabled: false, reason: "already_paid" };
  }
  if (payment === "REFUNDED" || payment === "PARTIALLY_REFUNDED") {
    return { enabled: false, reason: "refunded" };
  }
  if (productionOf(order) === "CANCELLED") {
    return { enabled: false, reason: "cancelled" };
  }
  if (!isPriced(order.amountMinor)) {
    return { enabled: false, reason: "no_price" };
  }
  if (productionOf(order) !== "READY_FOR_PAYMENT") {
    return { enabled: false, reason: "not_ready" };
  }
  if (!config.enabled) {
    return { enabled: false, reason: config.reason };
  }
  if (payment === "PAYMENT_PENDING") {
    return { enabled: true, reason: "pending" };
  }
  if (payment === "PAYMENT_FAILED") {
    return { enabled: true, reason: "failed" };
  }
  return { enabled: true, reason: "ready" };
}

export function checkoutBlockReason(order: SignOrder, config: StripeConfig): string | null {
  const state = describeCheckout(order, config);
  if (state.enabled) return null;
  switch (state.reason) {
    case "missing_keys":
      return "Card checkout is not configured. Stripe test keys are missing.";
    case "live_blocked":
      return "Live Stripe keys are refused. This shop only accepts test-mode checkout.";
    case "invalid_key":
      return "Stripe key is not a test key. Checkout stays closed.";
    case "already_paid":
      return "This ticket is already paid.";
    case "refunded":
      return "This ticket was refunded.";
    case "cancelled":
      return "A cancelled ticket cannot be paid.";
    case "no_price":
      return "Khurshid has not set a shop price yet.";
    case "not_ready":
      return "This ticket is not ready for payment.";
    default:
      return "Card checkout is not open for this ticket.";
  }
}

export function applyCheckoutStarted(
  order: SignOrder,
  sessionId: string,
): SignOrder {
  if (paymentOf(order) === "PAID") {
    throw new Error("This ticket is already paid.");
  }
  return {
    ...order,
    paymentStatus: "PAYMENT_PENDING",
    stripeCheckoutSessionId: sessionId,
  };
}

export function applyVerifiedPayment(
  order: SignOrder,
  input: {
    amountMinor: number;
    sessionId: string;
    paymentIntentId?: string;
  },
): SignOrder {
  if (paymentOf(order) === "PAID") {
    return {
      ...order,
      stripeCheckoutSessionId: order.stripeCheckoutSessionId ?? input.sessionId,
      stripePaymentIntentId: order.stripePaymentIntentId ?? input.paymentIntentId,
    };
  }
  if (!isPriced(order.amountMinor) || order.amountMinor !== input.amountMinor) {
    throw new Error("Webhook amount does not match the approved order.");
  }
  return {
    ...order,
    paymentStatus: "PAID" satisfies PaymentStatus,
    stripeCheckoutSessionId: input.sessionId,
    stripePaymentIntentId: input.paymentIntentId,
  };
}

export function applyPaymentFailed(
  order: SignOrder,
  extra?: { sessionId?: string; paymentIntentId?: string },
): SignOrder {
  if (paymentOf(order) === "PAID") return order;
  return {
    ...order,
    paymentStatus: "PAYMENT_FAILED",
    stripeCheckoutSessionId: extra?.sessionId ?? order.stripeCheckoutSessionId,
    stripePaymentIntentId: extra?.paymentIntentId ?? order.stripePaymentIntentId,
  };
}

export function applyCheckoutExpired(order: SignOrder, sessionId?: string): SignOrder {
  if (paymentOf(order) === "PAID") return order;
  if (sessionId && order.stripeCheckoutSessionId && order.stripeCheckoutSessionId !== sessionId) {
    return order;
  }
  return {
    ...order,
    paymentStatus: "UNPAID",
  };
}

export function applyRefund(order: SignOrder, partial: boolean): SignOrder {
  return {
    ...order,
    paymentStatus: partial ? "PARTIALLY_REFUNDED" : "REFUNDED",
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function metadataOrderId(obj: Record<string, unknown>): string | undefined {
  const meta = asRecord(obj.metadata);
  const fromMeta = asString(meta?.orderId);
  if (fromMeta) return fromMeta;
  return asString(obj.client_reference_id);
}

export function paymentIntentIdOf(obj: Record<string, unknown>): string | undefined {
  const value = obj.payment_intent;
  if (typeof value === "string") return value;
  const nested = asRecord(value);
  return asString(nested?.id);
}

export function sessionIdOf(obj: Record<string, unknown>): string | undefined {
  const id = asString(obj.id);
  return id?.startsWith("cs_") ? id : asString(obj.checkout_session);
}

export function orderIdFromEvent(event: StripeLikeEvent): string | undefined {
  return metadataOrderId(event.data.object);
}

function sessionAmount(obj: Record<string, unknown>): number | undefined {
  return asNumber(obj.amount_total) ?? asNumber(obj.amount);
}

export function decideWebhook(
  event: StripeLikeEvent,
  order: SignOrder | undefined,
): WebhookDecision {
  if (event.livemode) {
    return { action: "reject", detail: "Live Stripe events are refused." };
  }
  const obj = event.data.object;
  const sessionId = sessionIdOf(obj);
  const intentId = paymentIntentIdOf(obj);

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    if (!order) return { action: "reject", detail: "Order for this session is missing." };
    if (paymentOf(order) === "PAID") {
      return { action: "ignore", detail: "Already paid." };
    }
    const amount = sessionAmount(obj);
    if (typeof amount !== "number") {
      return { action: "reject", detail: "Session has no amount_total." };
    }
    if (order.amountMinor !== amount) {
      return {
        action: "reject",
        detail: `Session amount ${amount} does not match order ${order.amountMinor}.`,
      };
    }
    const currency = asString(obj.currency);
    if (currency && currency !== "usd") {
      return { action: "reject", detail: `Unexpected currency ${currency}.` };
    }
    if (
      event.type === "checkout.session.completed" &&
      asString(obj.payment_status) &&
      asString(obj.payment_status) !== "paid"
    ) {
      return { action: "ignore", detail: "Session completed but not yet paid." };
    }
    if (!sessionId) {
      return { action: "reject", detail: "Session id missing." };
    }
    return {
      action: "paid",
      sessionId,
      paymentIntentId: intentId,
      amountMinor: amount,
    };
  }

  if (
    event.type === "checkout.session.async_payment_failed" ||
    event.type === "payment_intent.payment_failed"
  ) {
    if (!order) return { action: "ignore", detail: "No order for failed payment." };
    if (paymentOf(order) === "PAID") {
      return { action: "ignore", detail: "Already paid; ignore failure." };
    }
    return { action: "failed", sessionId, paymentIntentId: intentId };
  }

  if (event.type === "checkout.session.expired") {
    if (!order) return { action: "ignore", detail: "No order for expired session." };
    if (paymentOf(order) === "PAID") {
      return { action: "ignore", detail: "Already paid." };
    }
    return { action: "unpaid", sessionId };
  }

  if (event.type === "charge.refunded") {
    if (!order) return { action: "ignore", detail: "No order for refund." };
    const amount = asNumber(obj.amount) ?? order.amountMinor ?? 0;
    const refunded = asNumber(obj.amount_refunded) ?? 0;
    return {
      action: "refunded",
      partial: refunded > 0 && refunded < amount,
      paymentIntentId: intentId,
    };
  }

  return { action: "ignore", detail: `Unhandled ${event.type}.` };
}

export function applyWebhookDecision(
  order: SignOrder,
  decision: WebhookDecision,
): SignOrder {
  switch (decision.action) {
    case "paid":
      return applyVerifiedPayment(order, {
        amountMinor: decision.amountMinor,
        sessionId: decision.sessionId,
        paymentIntentId: decision.paymentIntentId,
      });
    case "failed":
      return applyPaymentFailed(order, {
        sessionId: decision.sessionId,
        paymentIntentId: decision.paymentIntentId,
      });
    case "unpaid":
      return applyCheckoutExpired(order, decision.sessionId);
    case "refunded":
      return applyRefund(order, decision.partial);
    default:
      return order;
  }
}

/** Success / return URLs never write payment status. */
export function paymentFromSuccessUrl(): null {
  return null;
}
