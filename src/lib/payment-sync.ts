import { formatUsd, isPriced } from "@/lib/money";
import type { SignOrder } from "@/lib/order";
import {
  isShopLangList,
  payT,
  paymentLabel,
  productionLabel,
} from "@/lib/order-copy";
import {
  hydrateOrder,
  paymentOf,
  productionOf,
  type PaymentStatus,
} from "@/lib/order-status";
import type { ShopLang } from "@/lib/shop-entry";

export function shopLangOf(order: Pick<SignOrder, "language">): ShopLang {
  return isShopLangList(String(order.language ?? ""))
    ? (order.language as ShopLang)
    : "en";
}

export function canOfferPayLink(order: SignOrder): boolean {
  const payment = paymentOf(order);
  if (payment === "PAID" || payment === "REFUNDED" || payment === "PARTIALLY_REFUNDED") {
    return false;
  }
  return productionOf(order) === "READY_FOR_PAYMENT" && isPriced(order.amountMinor);
}

export function ticketSyncLine(order: SignOrder, lang: ShopLang): string {
  const service = order.service === "PRINT_ONLY" ? "PRINT_ONLY" : "CUSTOM_DESIGN";
  const amount = isPriced(order.amountMinor) ? ` · ${formatUsd(order.amountMinor)}` : "";
  return [
    `${order.id} · ${service}`,
    `${payT(lang, "productionLabel")}: ${productionLabel(lang, productionOf(order))}`,
    `${payT(lang, "paymentLabel")}: ${paymentLabel(lang, paymentOf(order))}${amount}`,
  ].join("\n");
}

function extraForPayment(lang: ShopLang, payment: PaymentStatus): string {
  switch (payment) {
    case "PAID":
      return payT(lang, "payConfirmed");
    case "PAYMENT_PENDING":
      return payT(lang, "payPending");
    case "PAYMENT_FAILED":
      return payT(lang, "payFailed");
    case "REFUNDED":
    case "PARTIALLY_REFUNDED":
      return payT(lang, "payRefunded");
    default:
      return payT(lang, "syncUnpaid");
  }
}

/** Copy is taken from the stored payment status. Never invents PAID. */
export function paymentChangeMessage(order: SignOrder, lang?: ShopLang): string {
  const resolved = lang ?? shopLangOf(order);
  const payment = paymentOf(order);
  return `${ticketSyncLine(order, resolved)}\n${extraForPayment(resolved, payment)}`;
}

export function customerOrdersText(orders: SignOrder[], lang: ShopLang): string {
  if (orders.length === 0) {
    return payT(lang, "syncEmpty");
  }
  return orders
    .map((order) => {
      const line = ticketSyncLine(order, lang);
      return canOfferPayLink(order) ? `${line}\n${payT(lang, "syncPayHint")}` : line;
    })
    .join("\n\n");
}

export function messageClaimsPaid(order: SignOrder): boolean {
  return paymentOf(order) === "PAID";
}

/** Server payment / production / price win. Local copies cannot invent PAID. */
export function mergeShopOrders(
  server: SignOrder[],
  local: SignOrder[],
): SignOrder[] {
  const map = new Map<string, SignOrder>();
  for (const order of local) {
    map.set(order.id, hydrateOrder(order));
  }
  for (const raw of server) {
    const incoming = hydrateOrder(raw);
    map.set(incoming.id, incoming);
  }
  return Array.from(map.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}
