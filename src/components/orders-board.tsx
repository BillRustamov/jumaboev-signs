"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Inbox } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SignPreview } from "@/components/sign-preview";
import {
  readLocalOrders,
  useUsername,
} from "@/lib/client-session";
import type { SignOrder } from "@/lib/order";

export function OrdersBoard() {
  const username = useUsername();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<SignOrder[]>([]);

  useEffect(() => {
    const local = readLocalOrders();
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/orders", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("The shop list is unavailable right now.");
        }
        const payload = (await response.json()) as { orders: SignOrder[] };
        if (cancelled) return;
        setOrders(mergeOrders(payload.orders, local));
      } catch (err) {
        if (cancelled) return;
        setOrders(local);
        setError(
          err instanceof Error
            ? err.message
            : "Could not reach the shop list.",
        );
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

      {orders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="size-4" />
              No door orders yet
            </CardTitle>
            <CardDescription>
              {username
                ? `Nothing on file for ${username}. Add a 20–24 × 10–12 in pair to the cart and check out.`
                : "Design a door, add it to the cart, and check out. The ticket lands here."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/order">Print desk</Link>
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
                      @{order.username} · {order.source}
                      {order.language ? ` · ${order.language}` : ""}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <SignPreview fields={order} />
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/admin/print/${order.id}`}>
                    Print sheet
                  </Link>
                </Button>
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
