export type StripeDisableReason =
  | "missing_keys"
  | "live_blocked"
  | "invalid_key";

export type StripeConfig =
  | {
      enabled: true;
      reason: "ready";
      secret: string;
      webhookSecret: string | null;
    }
  | {
      enabled: false;
      reason: StripeDisableReason;
      secret: null;
      webhookSecret: string | null;
    };

function readSecret(): string {
  return (process.env.STRIPE_SECRET_KEY ?? "").trim();
}

function readWebhookSecret(): string | null {
  const value = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();
  return value || null;
}

/** Test-mode only. Live keys never enable checkout. */
export function stripeConfig(): StripeConfig {
  const secret = readSecret();
  const webhookSecret = readWebhookSecret();
  if (!secret) {
    return {
      enabled: false,
      reason: "missing_keys",
      secret: null,
      webhookSecret,
    };
  }
  if (secret.startsWith("sk_live") || secret.startsWith("rk_live")) {
    return {
      enabled: false,
      reason: "live_blocked",
      secret: null,
      webhookSecret: null,
    };
  }
  if (!secret.startsWith("sk_test") && !secret.startsWith("rk_test")) {
    return {
      enabled: false,
      reason: "invalid_key",
      secret: null,
      webhookSecret: null,
    };
  }
  return {
    enabled: true,
    reason: "ready",
    secret,
    webhookSecret,
  };
}

export function shopAppUrl(): string {
  return (process.env.APP_URL ?? "http://127.0.0.1:43147").replace(/\/$/, "");
}
