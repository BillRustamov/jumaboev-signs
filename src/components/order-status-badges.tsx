"use client";

import { Badge } from "@/components/ui/badge";
import { paymentLabel, productionLabel } from "@/lib/order-copy";
import {
  paymentOf,
  productionOf,
} from "@/lib/order-status";
import type { SignOrder } from "@/lib/order";
import type { ShopLang } from "@/lib/shop-entry";

export function OrderStatusBadges({
  order,
  lang,
}: {
  order: SignOrder;
  lang: ShopLang;
}) {
  const production = productionOf(order);
  const payment = paymentOf(order);
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge variant="secondary">{productionLabel(lang, production)}</Badge>
      <Badge variant={payment === "UNPAID" ? "outline" : "secondary"}>
        {paymentLabel(lang, payment)}
      </Badge>
      {order.service === "PRINT_ONLY" ? (
        <Badge variant="outline">PRINT_ONLY</Badge>
      ) : (
        <Badge variant="outline">CUSTOM_DESIGN</Badge>
      )}
    </div>
  );
}
