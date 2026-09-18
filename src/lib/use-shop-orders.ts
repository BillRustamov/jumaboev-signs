"use client";

import { useEffect, useState } from "react";
import { readLocalOrders } from "@/lib/client-session";
import type { SignOrder } from "@/lib/order";
import { hydrateOrder } from "@/lib/order-status";
import { mergeShopOrders } from "@/lib/payment-sync";

export function useShopOrders() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<SignOrder[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const local = readLocalOrders();
      try {
        const response = await fetch("/api/orders", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("The shop list is unavailable right now.");
        }
        const payload = (await response.json()) as { orders: SignOrder[] };
        if (cancelled) return;
        setOrders(mergeShopOrders(payload.orders, local).map(hydrateOrder));
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
  }, []);

  return { loading, error, orders, setOrders };
}
