"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Inbox, Printer } from "lucide-react";
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
import { TruckSign } from "@/components/truck-sign";
import { readLocalOrders } from "@/lib/client-session";
import type { SignOrder } from "@/lib/order";

export function AdminDesk() {
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
        setOrders(mergeOrders(payload.orders, local));
      } catch (err) {
        if (cancelled) return;
        setOrders(local);
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
            Physical sheet is 24×24 in. Each download places two logos — left
            and right — in 11×20 in cells.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/admin/print/sample">
              <Printer className="size-4" />
              Open sample 24×24 sheet
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
              When a driver checks out, the pair lands here for a 24×24 sheet
              with two 11×20 doors. The sample sheet above is always available.
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
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <TruckSign fields={order} />
                <Button className="w-full" asChild>
                  <Link href={`/admin/print/${order.id}`}>
                    <Printer className="size-4" />
                    Download 24×24 print sheet
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
