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
import { paymentOf } from "@/lib/order-status";
import {
  findOrderByCheckoutSession,
  findOrderByPaymentIntent,
  getOrder,
  recordLedger,
  rememberStripeEvent,
  stripeEventSeen,
  updateOrder,
} from "@/lib/store";
import { notifyPaymentChange } from "@/lib/telegram";
import { notifyPaymentEmail } from "@/lib/shop-mail";

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

  if (await stripeEventSeen(event.id)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const like = event as unknown as StripeLikeEvent;
  const obj = like.data.object;
  const orderId =
    orderIdFromEvent(like) ??
    (await findOrderByCheckoutSession(sessionIdOf(obj) ?? ""))?.id ??
    (await findOrderByPaymentIntent(paymentIntentIdOf(obj) ?? ""))?.id;
  const order = orderId ? await getOrder(orderId) : undefined;
  const decision = decideWebhook(like, order);

  if (decision.action === "reject") {
    if (orderId) {
      await recordLedger(orderId, "webhook_rejected", `${event.type}: ${decision.detail}`);
    }
    await rememberStripeEvent(event.id, event.type, orderId ?? null);
    return NextResponse.json({ ok: true, rejected: decision.detail });
  }

  if (decision.action === "ignore") {
    await rememberStripeEvent(event.id, event.type, orderId ?? null);
    return NextResponse.json({ ok: true, ignored: decision.detail });
  }

  if (!order) {
    await rememberStripeEvent(event.id, event.type, orderId ?? null);
    return NextResponse.json({ ok: true, ignored: "No order for this event." });
  }

  try {
    const next = applyWebhookDecision(order, decision);
    await updateOrder(next);
    await recordLedger(
      order.id,
      paymentOf(next) === "PAID" ? "paid" : `payment_${decision.action}`,
      `${event.type} ${event.id}`,
    );
    await rememberStripeEvent(event.id, event.type, order.id);
    if (paymentOf(next) !== paymentOf(order)) {
      void notifyPaymentChange(next);
      void notifyPaymentEmail(next);
    }
    return NextResponse.json({
      ok: true,
      action: decision.action,
      payment: paymentOf(next),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not apply webhook.";
    await recordLedger(order.id, "webhook_rejected", message);
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
