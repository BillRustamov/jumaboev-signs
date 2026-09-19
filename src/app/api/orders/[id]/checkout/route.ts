import { NextResponse } from "next/server";
import {
  applyCheckoutStarted,
  checkoutBlockReason,
  describeCheckout,
} from "@/lib/checkout";
import { paymentOf } from "@/lib/order-status";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { stripeConfig } from "@/lib/stripe-config";
import {
  createCheckoutSession,
  retrieveCheckoutSession,
} from "@/lib/stripe";
import {
  getOrderIfTokenInternal,
  recordLedger,
  updateOrder,
} from "@/lib/store";
import { notifyPaymentChange } from "@/lib/telegram";
import { notifyPaymentEmail } from "@/lib/shop-mail";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const inflight = new Map<string, Promise<Response>>();

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!rateLimit(clientKey(request, "pay-checkout"), 12, 60_000)) {
    return NextResponse.json({ error: "Too many checkout attempts." }, { status: 429 });
  }

  const { id } = await context.params;
  const existing = inflight.get(id);
  if (existing) return existing;

  const started = startCheckout(request, id).finally(() => {
    inflight.delete(id);
  });
  inflight.set(id, started);
  return started;
}

async function startCheckout(request: Request, id: string): Promise<Response> {
  let token = new URL(request.url).searchParams.get("token") ?? "";
  try {
    const body = (await request.json()) as { token?: unknown; amountMinor?: unknown };
    if (typeof body.token === "string") token = body.token;
  } catch {
    /* token may be on the query string */
  }

  const order = await getOrderIfTokenInternal(id, token);
  if (!order) {
    return NextResponse.json({ error: "This pay link is not valid." }, { status: 404 });
  }

  if (paymentOf(order) === "PAID") {
    return NextResponse.json({ error: "This ticket is already paid." }, { status: 409 });
  }

  const config = stripeConfig();
  const checkout = describeCheckout(order, config);
  const blocked = checkoutBlockReason(order, config);
  if (blocked && !checkout.enabled) {
    return NextResponse.json(
      { error: blocked, checkout },
      { status: config.enabled ? 409 : 503 },
    );
  }

  if (order.stripeCheckoutSessionId) {
    const open = await retrieveCheckoutSession(order.stripeCheckoutSessionId);
    if (open?.status === "open" && open.url) {
      if (open.amount_total === order.amountMinor) {
        return NextResponse.json({ url: open.url, reused: true });
      }
    }
    if (open?.status === "complete" && paymentOf(order) !== "PAID") {
      return NextResponse.json(
        {
          error:
            "Stripe already has a completed session. This page does not mark the ticket paid. Wait for the webhook.",
        },
        { status: 409 },
      );
    }
  }

  try {
    const session = await createCheckoutSession(order, token);
    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }
    const pending = applyCheckoutStarted(order, session.id);
    const saved = await updateOrder(pending);
    await recordLedger(
      id,
      "checkout",
      `session ${session.id} for ${order.amountMinor} usd cents`,
    );
    if (paymentOf(saved) === "PAYMENT_PENDING" && paymentOf(order) !== "PAYMENT_PENDING") {
      void notifyPaymentChange(saved);
      void notifyPaymentEmail(saved);
    }
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start Stripe Checkout.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
