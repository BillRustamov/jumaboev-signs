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
import { formatUsd, isPriced } from "@/lib/money";
import { payT, paymentLabel, productionLabel } from "@/lib/order-copy";
import { paymentOf, productionOf } from "@/lib/order-status";
import type { SignOrder } from "@/lib/order";
import { shopT } from "@/lib/shop-entry";
import { useShopLang } from "@/lib/shop-lang";
import { OrderStatusBadges } from "@/components/order-status-badges";

export function PayDesk({ id, token }: { id: string; token: string }) {
  const lang = useShopLang();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<SignOrder | null>(null);

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
        const payload = (await response.json()) as SignOrder & { error?: string };
        if (cancelled) return;
        if (!response.ok) {
          setError(payload.error || payT(lang, "payInvalid"));
          return;
        }
        setOrder(payload);
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

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {payT(lang, "payLead")}
      </p>
    );
  }

  if (error || !order) {
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
        ) : !ready ? (
          <p className="text-sm">{payT(lang, "payNotReady")}</p>
        ) : (
          <p className="text-lg font-semibold text-[var(--navy)]">
            {payT(lang, "payDue", { amount: formatUsd(order.amountMinor) })}
          </p>
        )}
        <Alert>
          <AlertCircle />
          <AlertTitle>
            {payT(lang, "paymentLabel")}: {paymentLabel(lang, payment)}
          </AlertTitle>
          <AlertDescription>{payT(lang, "payOffline")}</AlertDescription>
        </Alert>
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
