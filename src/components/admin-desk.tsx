"use client";

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
import { formatUsd, isPriced } from "@/lib/money";
import { isPrintOnly } from "@/lib/order";
import { hydrateOrder } from "@/lib/order-status";
import { payT } from "@/lib/order-copy";
import { useShopOrders } from "@/lib/use-shop-orders";
import { useShopLang } from "@/lib/shop-lang";

export function AdminDesk() {
  const lang = useShopLang();
  const { loading, error, orders, setOrders } = useShopOrders();

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

      <p className="text-sm text-muted-foreground">{payT(lang, "adminSiteLead")}</p>

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
