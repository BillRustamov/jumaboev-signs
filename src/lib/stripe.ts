import Stripe from "stripe";
import { shopAppUrl, stripeConfig } from "@/lib/stripe-config";
import type { SignOrder } from "@/lib/order";

export const STRIPE_API_VERSION = "2026-07-29.dahlia" as const;
export const CHECKOUT_INTEGRATION = "jumaboev_xqmtrwab";

export function stripeClient(): Stripe | null {
  const config = stripeConfig();
  if (!config.enabled) return null;
  return new Stripe(config.secret, {
    apiVersion: STRIPE_API_VERSION,
  });
}

function webhookVerifier(): Stripe {
  return (
    stripeClient() ??
    new Stripe("sk_test_webhook_verify_only", {
      apiVersion: STRIPE_API_VERSION,
    })
  );
}

export function constructStripeEvent(
  rawBody: string,
  signature: string | null,
): Stripe.Event {
  const secret = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set.");
  }
  if (!signature) {
    throw new Error("stripe-signature header is missing.");
  }
  return webhookVerifier().webhooks.constructEvent(rawBody, signature, secret);
}

export function checkoutUrls(
  orderId: string,
  token: string,
): { successUrl: string; cancelUrl: string } {
  const base = shopAppUrl();
  const q = `token=${encodeURIComponent(token)}`;
  return {
    successUrl: `${base}/orders/${orderId}/pay/return?${q}&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${base}/orders/${orderId}/pay?${q}`,
  };
}

export async function retrieveCheckoutSession(
  sessionId: string,
): Promise<Stripe.Checkout.Session | null> {
  const stripe = stripeClient();
  if (!stripe) return null;
  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}

export async function createCheckoutSession(
  order: SignOrder,
  token: string,
): Promise<Stripe.Checkout.Session> {
  const stripe = stripeClient();
  if (!stripe) {
    throw new Error("Card checkout is not configured.");
  }
  if (typeof order.amountMinor !== "number" || order.amountMinor <= 0) {
    throw new Error("Approved amount is missing.");
  }
  const { successUrl, cancelUrl } = checkoutUrls(order.id, token);
  const previous = order.stripeCheckoutSessionId ?? "none";
  return stripe.checkout.sessions.create(
    {
      mode: "payment",
      client_reference_id: order.id,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id,
        amountMinor: String(order.amountMinor),
      },
      payment_intent_data: {
        metadata: {
          orderId: order.id,
          amountMinor: String(order.amountMinor),
        },
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: order.amountMinor,
            product_data: {
              name: `Jumaboev Signs ${order.id}`,
              description: "20 × 12 in vinyl pair (left + right door)",
            },
          },
        },
      ],
      integration_identifier: CHECKOUT_INTEGRATION,
    },
    {
      idempotencyKey: `doorpay-${order.id}-${order.amountMinor}-${previous}`,
    },
  );
}
