"use client";

import { useEffect, useState } from "react";
import { readLocalOrders } from "@/lib/client-session";
import type { SignOrder } from "@/lib/order";
import { hydrateOrder } from "@/lib/order-status";
import { mergeShopOrders } from "@/lib/payment-sync";
import { useAccount } from "@/lib/use-account";

export function useShopOrders(options?: { all?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<SignOrder[]>([]);
  const all = options?.all === true;
  const { user, loading: accountLoading } = useAccount();

  useEffect(() => {
    if (accountLoading) return;
    let cancelled = false;

    async function load() {
      const local = readLocalOrders().filter((order) => {
        if (all || !user) return true;
        if (order.userId && order.userId === user.id) return true;
        return order.username.toLowerCase() === user.username.toLowerCase();
      });
      try {
        const path = all ? "/api/orders" : "/api/orders?mine=1";
        const response = await fetch(path, {
          cache: "no-store",
          credentials: "same-origin",
        });
        if (!response.ok) {
          throw new Error("The shop list is unavailable right now.");
        }
        const payload = (await response.json()) as { orders: SignOrder[] };
        if (cancelled) return;
        setOrders(mergeShopOrders(payload.orders ?? [], local).map(hydrateOrder));
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setOrders(local.map(hydrateOrder));
        setError(
          err instanceof Error ? err.message : "Could not reach the shop list.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 8000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [all, accountLoading, user]);

  return { loading, error, orders, setOrders };
}
