"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatUsd, isPriced } from "@/lib/money";
import { payT } from "@/lib/order-copy";
import {
  canEnterReadyForPayment,
  nextProductionStates,
  productionOf,
  type ProductionStatus,
} from "@/lib/order-status";
import type { SignOrder } from "@/lib/order";
import type { ShopLang } from "@/lib/shop-entry";

export function AdminOrderControls({
  order,
  lang,
  onUpdated,
}: {
  order: SignOrder;
  lang: ShopLang;
  onUpdated: (order: SignOrder, payPath?: string) => void;
}) {
  const production = productionOf(order);
  const [price, setPrice] = useState(
    isPriced(order.amountMinor) ? (order.amountMinor! / 100).toString() : "",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payPath, setPayPath] = useState<string | null>(null);
  const nextStates = nextProductionStates(production);
  const readyBlocked = canEnterReadyForPayment(order);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as {
        error?: string;
        order?: SignOrder;
        payPath?: string;
      };
      if (!response.ok || !payload.order) {
        setError(payload.error || "Could not update this ticket.");
        return;
      }
      if (payload.payPath) setPayPath(payload.payPath);
      onUpdated(payload.order, payload.payPath);
    } catch {
      setError("Could not reach the shop list.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
      <div className="space-y-1.5">
        <Label htmlFor={`price-${order.id}`}>{payT(lang, "priceLabel")}</Label>
        <p className="text-xs text-muted-foreground">{payT(lang, "priceHint")}</p>
        <div className="flex flex-wrap gap-2">
          <Input
            id={`price-${order.id}`}
            inputMode="decimal"
            placeholder="85.00"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="max-w-[8rem]"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => void patch({ amountUsd: price })}
          >
            {payT(lang, "setPrice")}
          </Button>
        </div>
        {isPriced(order.amountMinor) ? (
          <p className="text-sm font-medium text-[var(--navy)]">
            {formatUsd(order.amountMinor)}
          </p>
        ) : null}
      </div>

      {nextStates.length ? (
        <div className="space-y-1.5">
          <p className="text-sm font-medium">{payT(lang, "moveStatus")}</p>
          <div className="flex flex-wrap gap-1.5">
            {nextStates.map((status: ProductionStatus) => (
              <Button
                key={status}
                type="button"
                size="sm"
                variant={status === "CANCELLED" ? "outline" : "secondary"}
                disabled={
                  busy || (status === "READY_FOR_PAYMENT" && Boolean(readyBlocked))
                }
                onClick={() => void patch({ productionStatus: status })}
              >
                {status === "READY_FOR_PAYMENT"
                  ? payT(lang, "readyPay")
                  : status.replaceAll("_", " ")}
              </Button>
            ))}
          </div>
          {readyBlocked && nextStates.includes("READY_FOR_PAYMENT") ? (
            <p className="text-xs text-muted-foreground">{readyBlocked}</p>
          ) : null}
        </div>
      ) : null}

      {payPath ? (
        <div className="space-y-1">
          <p className="text-sm font-medium">{payT(lang, "payLink")}</p>
          <p className="break-all text-xs text-muted-foreground">{payPath}</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void navigator.clipboard.writeText(payPath)}
          >
            {payT(lang, "copyLink")}
          </Button>
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
