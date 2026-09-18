import { NextResponse } from "next/server";
import {
  applyWebhookDecision,
  decideWebhook,
  orderIdFromEvent,
  paymentIntentIdOf,
  sessionIdOf,
  type StripeLikeEvent,
} from "@/lib/checkout";
import { constructStripeEvent } from "@/lib/stripe";
import {
  findOrderByCheckoutSession,
  findOrderByPaymentIntent,
  getOrder,
  recordLedger,
  rememberStripeEvent,
  stripeEventSeen,
  updateOrder,
} from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret is not configured. Paid is never set from a URL." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event;
  try {
    event = constructStripeEvent(rawBody, signature);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid Stripe signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (stripeEventSeen(event.id)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const like = event as unknown as StripeLikeEvent;
  const obj = like.data.object;
  const orderId =
    orderIdFromEvent(like) ??
    findOrderByCheckoutSession(sessionIdOf(obj) ?? "")?.id ??
    findOrderByPaymentIntent(paymentIntentIdOf(obj) ?? "")?.id;
  const order = orderId ? getOrder(orderId) : undefined;
  const decision = decideWebhook(like, order);

  if (decision.action === "reject") {
    if (orderId) {
      recordLedger(orderId, "webhook_rejected", `${event.type}: ${decision.detail}`);
    }
    rememberStripeEvent(event.id, event.type, orderId ?? null);
    return NextResponse.json({ ok: true, rejected: decision.detail });
  }

  if (decision.action === "ignore") {
    rememberStripeEvent(event.id, event.type, orderId ?? null);
    return NextResponse.json({ ok: true, ignored: decision.detail });
  }

  if (!order) {
    rememberStripeEvent(event.id, event.type, orderId ?? null);
    return NextResponse.json({ ok: true, ignored: "No order for this event." });
  }

  try {
    const next = applyWebhookDecision(order, decision);
    updateOrder(next);
    recordLedger(
      order.id,
      decision.action === "paid" ? "paid" : `payment_${decision.action}`,
      `${event.type} ${event.id}`,
    );
    rememberStripeEvent(event.id, event.type, order.id);
    return NextResponse.json({ ok: true, action: decision.action });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not apply webhook.";
    recordLedger(order.id, "webhook_rejected", message);
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
