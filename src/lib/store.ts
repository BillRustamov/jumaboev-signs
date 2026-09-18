import type { SignOrder } from "@/lib/order";
import { accessTokenMatches, createAccessToken } from "@/lib/order-token";
import { hydrateOrder } from "@/lib/order-status";
import {
  appendLedger,
  eventWasProcessed,
  markEventProcessed,
  rowToOrder,
  shopDb,
  snapshotOrders,
  writeOrderRow,
} from "@/lib/shop-db";

export function publicOrder(order: SignOrder): SignOrder {
  const copy = hydrateOrder(order);
  delete copy.accessTokenHash;
  return copy;
}

export function saveOrder(order: SignOrder): SignOrder {
  const db = shopDb();
  const existing = db
    .prepare("SELECT json FROM orders WHERE id = ?")
    .get(order.id) as { json: string } | undefined;
  if (existing) return publicOrder(rowToOrder(existing));

  const hydrated = hydrateOrder(order);
  writeOrderRow(db, hydrated);
  appendLedger(
    db,
    hydrated.id,
    "created",
    `${hydrated.service} ${hydrated.productionStatus}`,
  );
  snapshotOrders(listOrders());
  return publicOrder(hydrated);
}

export function updateOrder(order: SignOrder): SignOrder {
  const db = shopDb();
  const existing = db
    .prepare("SELECT json FROM orders WHERE id = ?")
    .get(order.id) as { json: string } | undefined;
  if (!existing) {
    throw new Error("Order not on this server.");
  }
  const next = hydrateOrder({
    ...order,
    updatedAt: new Date().toISOString(),
  });
  writeOrderRow(db, next);
  snapshotOrders(listOrders());
  return publicOrder(next);
}

export function getOrder(id: string): SignOrder | undefined {
  const row = shopDb()
    .prepare("SELECT json FROM orders WHERE id = ?")
    .get(id) as { json: string } | undefined;
  return row ? hydrateOrder(rowToOrder(row)) : undefined;
}

export function getPublicOrder(id: string): SignOrder | undefined {
  const order = getOrder(id);
  return order ? publicOrder(order) : undefined;
}

export function getOrderIfToken(id: string, token: string): SignOrder | undefined {
  const order = getOrder(id);
  if (!order || !accessTokenMatches(token, order.accessTokenHash)) return undefined;
  return publicOrder(order);
}

export function listOrders(username?: string): SignOrder[] {
  const rows = shopDb()
    .prepare("SELECT json FROM orders ORDER BY created_at DESC")
    .all() as Array<{ json: string }>;
  const all = rows.map((row) => publicOrder(rowToOrder(row)));
  if (!username) return all;
  return all.filter(
    (order) => order.username.toLowerCase() === username.toLowerCase(),
  );
}

export function recordLedger(orderId: string, kind: string, detail: string): void {
  appendLedger(shopDb(), orderId, kind, detail);
}

export function getOrderIfTokenInternal(
  id: string,
  token: string,
): SignOrder | undefined {
  const order = getOrder(id);
  if (!order || !accessTokenMatches(token, order.accessTokenHash)) return undefined;
  return order;
}

export function findOrderByCheckoutSession(sessionId: string): SignOrder | undefined {
  if (!sessionId) return undefined;
  const rows = shopDb()
    .prepare("SELECT json FROM orders")
    .all() as Array<{ json: string }>;
  for (const row of rows) {
    const order = rowToOrder(row);
    if (order.stripeCheckoutSessionId === sessionId) return order;
  }
  return undefined;
}

export function findOrderByPaymentIntent(intentId: string): SignOrder | undefined {
  if (!intentId) return undefined;
  const rows = shopDb()
    .prepare("SELECT json FROM orders")
    .all() as Array<{ json: string }>;
  for (const row of rows) {
    const order = rowToOrder(row);
    if (order.stripePaymentIntentId === intentId) return order;
  }
  return undefined;
}

export function rememberStripeEvent(
  id: string,
  kind: string,
  orderId: string | null,
): boolean {
  return markEventProcessed(id, kind, orderId);
}

export function stripeEventSeen(id: string): boolean {
  return eventWasProcessed(id);
}

export function attachAccessToken(id: string): { order: SignOrder; token: string } {
  const current = getOrder(id);
  if (!current) throw new Error("Order not on this server.");
  const minted = createAccessToken();
  current.accessTokenHash = minted.hash;
  const next = updateOrder(current);
  appendLedger(shopDb(), id, "pay_link", "minted hashed access token");
  return { order: next, token: minted.token };
}
