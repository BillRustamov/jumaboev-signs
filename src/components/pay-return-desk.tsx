"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CheckoutPublic } from "@/lib/checkout";
import { formatUsd, isPriced } from "@/lib/money";
import { payT, paymentLabel } from "@/lib/order-copy";
import { paymentOf } from "@/lib/order-status";
import type { SignOrder } from "@/lib/order";
import { useShopLang } from "@/lib/shop-lang";
import { OrderStatusBadges } from "@/components/order-status-badges";

export function PayReturnDesk({ id, token }: { id: string; token: string }) {
  const lang = useShopLang();
  const [order, setOrder] = useState<SignOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch {
        if (!cancelled) setError(payT(lang, "payInvalid"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [id, token, lang]);

  if (loading && !order) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {payT(lang, "payReturnLead")}
      </p>
    );
  }

  if (error && !order) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>{payT(lang, "payInvalid")}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const payment = order ? paymentOf(order) : "UNPAID";
  const paid = payment === "PAID";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{payT(lang, "payReturnTitle")}</CardTitle>
        <CardDescription>{payT(lang, "payReturnLead")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {order ? <OrderStatusBadges order={order} lang={lang} /> : null}
        {order && isPriced(order.amountMinor) ? (
          <p className="text-lg font-semibold text-[var(--navy)]">
            {payT(lang, "payDue", { amount: formatUsd(order.amountMinor) })}
          </p>
        ) : null}
        <Alert>
          <AlertCircle />
          <AlertTitle>
            {payT(lang, "paymentLabel")}: {paymentLabel(lang, payment)}
          </AlertTitle>
          <AlertDescription>
            {paid ? payT(lang, "payConfirmed") : payT(lang, "payWaitWebhook")}
          </AlertDescription>
        </Alert>
        {!paid ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {payT(lang, "payReturnLead")}
          </p>
        ) : null}
        <Button variant="outline" asChild>
          <Link href={`/orders/${id}/pay?token=${encodeURIComponent(token)}`}>
            {payT(lang, "payTitle", { id: order?.id ?? id })}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
