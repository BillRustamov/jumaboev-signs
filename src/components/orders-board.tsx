"use client";

import Link from "next/link";
import { AlertCircle, Inbox } from "lucide-react";
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
import { OrderStatusBadges } from "@/components/order-status-badges";
import { PrintOrderCard } from "@/components/print-order-card";
import { SignPreview } from "@/components/sign-preview";
import { useUsername } from "@/lib/client-session";
import { formatUsd, isPriced } from "@/lib/money";
import { isPrintOnly } from "@/lib/order";
import { payT } from "@/lib/order-copy";
import { uiT } from "@/lib/shop-copy";
import { localizeNote } from "@/lib/shop-labels";
import { useAccount } from "@/lib/use-account";
import { useShopOrders } from "@/lib/use-shop-orders";
import { useShopLang } from "@/lib/shop-lang";

export function OrdersBoard() {
  const lang = useShopLang();
  const username = useUsername();
  const { user } = useAccount();
  const { loading, error, orders } = useShopOrders();

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
      <div className="mb-4 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
          {uiT(lang, "queueKicker")}
        </p>
        <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]">
          {uiT(lang, "shopOrdersTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground">{payT(lang, "ordersSiteLead")}</p>
      </div>

      {user ? (
        <p className="text-sm text-muted-foreground">
          {uiT(lang, "accountSignedInAs", { email: user.email })}
        </p>
      ) : (
        <Alert>
          <AlertCircle />
          <AlertTitle>{uiT(lang, "signIn")}</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>{uiT(lang, "ordersSignInHint")}</span>
            <Button size="sm" asChild>
              <Link href="/account?next=/orders">{uiT(lang, "createAccount")}</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{uiT(lang, "showingSaved")}</AlertTitle>
          <AlertDescription>{localizeNote(lang, error)}</AlertDescription>
        </Alert>
      ) : null}

      {orders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="size-4" />
              {uiT(lang, "noDoorOrders")}
            </CardTitle>
            <CardDescription>
              {username
                ? uiT(lang, "noOrdersForUser", { user: username })
                : uiT(lang, "noOrdersAnon")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/print">{uiT(lang, "printDesk")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/order">{uiT(lang, "keepDesigning")}</Link>
            </Button>
          </CardContent>
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
                      @{order.username} · {order.source === "telegram" ? uiT(lang, "sourceTelegram") : uiT(lang, "sourceWeb")}
                      {order.service === "PRINT_ONLY" ? ` · ${uiT(lang, "printExistingTag")}` : ""}
                      {order.language ? ` · ${order.language}` : ""}
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
                <p className="text-xs text-muted-foreground">
                  {new Date(order.updatedAt ?? order.createdAt).toLocaleString()}
                </p>
                {isPrintOnly(order) ? null : (
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/admin/print/${order.id}`}>{uiT(lang, "printSheet")}</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
