"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Inbox, Printer } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminOrderControls } from "@/components/admin-order-controls";
import { OrderStatusBadges } from "@/components/order-status-badges";
import { PrintOrderCard } from "@/components/print-order-card";
import { SignPreview } from "@/components/sign-preview";
import { readLocalOrders } from "@/lib/client-session";
import { formatUsd, isPriced } from "@/lib/money";
import { isPrintOnly, type SignOrder } from "@/lib/order";
import { hydrateOrder } from "@/lib/order-status";
import { useShopLang } from "@/lib/shop-lang";

export function AdminDesk() {
  const lang = useShopLang();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<SignOrder[]>([]);

  useEffect(() => {
    const local = readLocalOrders();
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/orders", { cache: "no-store" });
        if (!response.ok) throw new Error("Shop list unavailable.");
        const payload = (await response.json()) as { orders: SignOrder[] };
        if (cancelled) return;
        setOrders(mergeOrders(payload.orders, local).map(hydrateOrder));
      } catch (err) {
        if (cancelled) return;
        setOrders(local.map(hydrateOrder));
        setError(err instanceof Error ? err.message : "Could not reach the shop list.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Showing saved copies on this device</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Cutter sheet</CardTitle>
          <CardDescription>
            Physical pair is two 20 × 12 in doors, laid out along a 24 in
            roll. Download places both plaques — left and right — at true size.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/admin/print/sample">
              <Printer className="size-4" />
              Open sample print sheet
            </Link>
          </Button>
        </CardContent>
      </Card>

      {orders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="size-4" />
              No tickets to print
            </CardTitle>
            <CardDescription>
              When a driver checks out — or the Telegram bot posts a ticket —
              the pair lands here for a 20 × 12 in left and right print. The
              sample sheet above is always available.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle>{order.id}</CardTitle>
                    <CardDescription>
                      @{order.username} · {order.source}
                      {order.service === "PRINT_ONLY" ? " · print-existing" : ""}
                      {order.language ? ` · ${order.language}` : ""}
                      {order.telegramChatId
                        ? ` · chat ${order.telegramChatId}`
                        : ""}
                    </CardDescription>
                  </div>
                  <OrderStatusBadges order={order} lang={lang} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {isPriced(order.amountMinor) ? (
                  <p className="text-sm font-medium text-[var(--navy)]">
                    {formatUsd(order.amountMinor)}
                  </p>
                ) : null}
                {isPrintOnly(order) ? (
                  <PrintOrderCard order={order} />
                ) : (
                  <SignPreview fields={order} />
                )}
                {isPrintOnly(order) ? (
                  <p className="text-xs text-muted-foreground">
                    Print the original upload at 20 × 12 in. This is not a
                    designer plaque — the cutter sheet stays for custom designs.
                  </p>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href={`/admin/print/${order.id}`}>
                      <Printer className="size-4" />
                      Download print sheet
                    </Link>
                  </Button>
                )}
                <AdminOrderControls
                  order={order}
                  lang={lang}
                  onUpdated={(updated) => {
                    setOrders((current) =>
                      current.map((item) =>
                        item.id === updated.id ? hydrateOrder(updated) : item,
                      ),
                    );
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function mergeOrders(server: SignOrder[], local: SignOrder[]): SignOrder[] {
  const map = new Map<string, SignOrder>();
  for (const order of [...server, ...local]) {
    map.set(order.id, order);
  }
  return Array.from(map.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}
