"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CreditCard, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CheckoutPublic, CheckoutReason } from "@/lib/checkout";
import { formatUsd, isPriced } from "@/lib/money";
import { payT, paymentLabel, productionLabel, type PayCopyKey } from "@/lib/order-copy";
import { paymentOf, productionOf } from "@/lib/order-status";
import type { SignOrder } from "@/lib/order";
import { shopT } from "@/lib/shop-entry";
import { useShopLang } from "@/lib/shop-lang";
import { OrderStatusBadges } from "@/components/order-status-badges";

function reasonCopy(reason: CheckoutReason): PayCopyKey {
  switch (reason) {
    case "missing_keys":
      return "payMissingKeys";
    case "live_blocked":
      return "payLiveBlocked";
    case "invalid_key":
      return "payInvalidKey";
    case "already_paid":
      return "payConfirmed";
    case "refunded":
      return "payRefunded";
    case "cancelled":
      return "payCancelled";
    case "no_price":
      return "payNoPrice";
    case "not_ready":
      return "payNotReady";
    case "pending":
      return "payPending";
    case "failed":
      return "payFailed";
    case "ready":
      return "payCardHint";
    default:
      return "payOffline";
  }
}

export function PayDesk({ id, token }: { id: string; token: string }) {
  const lang = useShopLang();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<SignOrder | null>(null);
  const [checkout, setCheckout] = useState<CheckoutPublic | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!token) {
        setError(payT(lang, "payInvalid"));
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `/api/orders/${id}?token=${encodeURIComponent(token)}`,
          { cache: "no-store" },
        );
        const payload = (await response.json()) as {
          order?: SignOrder;
          checkout?: CheckoutPublic;
          error?: string;
        };
        if (cancelled) return;
        if (!response.ok || !payload.order) {
          setError(payload.error || payT(lang, "payInvalid"));
          return;
        }
        setOrder(payload.order);
        setCheckout(payload.checkout ?? null);
      } catch {
        if (!cancelled) setError(payT(lang, "payInvalid"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id, token, lang]);

  async function startCheckout() {
    setStarting(true);
    setError(null);
    try {
      const response = await fetch(`/api/orders/${id}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (payload.url) {
        window.location.href = payload.url;
        return;
      }
      setError(payload.error || payT(lang, "payStartError"));
    } catch {
      setError(payT(lang, "payStartError"));
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {payT(lang, "payLead")}
      </p>
    );
  }

  if (!order) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>{payT(lang, "payInvalid")}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const production = productionOf(order);
  const payment = paymentOf(order);
  const ready = production === "READY_FOR_PAYMENT";
  const priced = isPriced(order.amountMinor);
  const reason = checkout?.reason;
  const canPay = Boolean(checkout?.enabled && ready && priced && payment !== "PAID");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{payT(lang, "payTitle", { id: order.id })}</CardTitle>
        <CardDescription>{payT(lang, "payLead")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OrderStatusBadges order={order} lang={lang} />
        <p className="text-sm text-muted-foreground">{payT(lang, "paySize")}</p>
        {!priced ? (
          <p className="text-sm">{payT(lang, "payNoPrice")}</p>
        ) : !ready && payment !== "PAID" ? (
          <p className="text-sm">{payT(lang, "payNotReady")}</p>
        ) : (
          <p className="text-lg font-semibold text-[var(--navy)]">
            {payT(lang, "payDue", { amount: formatUsd(order.amountMinor) })}
          </p>
        )}
        <Alert variant={payment === "PAYMENT_FAILED" ? "destructive" : "default"}>
          <AlertCircle />
          <AlertTitle>
            {payT(lang, "paymentLabel")}: {paymentLabel(lang, payment)}
          </AlertTitle>
          <AlertDescription>
            {reason ? payT(lang, reasonCopy(reason)) : payT(lang, "payOffline")}
          </AlertDescription>
        </Alert>
        {canPay ? (
          <div className="space-y-2">
            <Button type="button" disabled={starting} onClick={() => void startCheckout()}>
              {starting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CreditCard className="size-4" />
              )}
              {reason === "pending" ? payT(lang, "payContinue") : payT(lang, "payCard")}
            </Button>
            <p className="text-xs text-muted-foreground">{payT(lang, "payWaitWebhook")}</p>
          </div>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <p className="text-xs text-muted-foreground">
          {payT(lang, "productionLabel")}: {productionLabel(lang, production)}
        </p>
        <Button variant="outline" asChild>
          <Link href="/">{shopT(lang, "backToMenu")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
