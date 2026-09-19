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

export async function saveOrder(order: SignOrder): Promise<SignOrder> {
  const db = await shopDb();
  const existing = (await db
    .prepare("SELECT json FROM orders WHERE id = ?")
    .get(order.id)) as { json: string } | undefined;
  if (existing) return publicOrder(rowToOrder(existing));

  const hydrated = hydrateOrder(order);
  await writeOrderRow(db, hydrated);
  await appendLedger(
    db,
    hydrated.id,
    "created",
    `${hydrated.service} ${hydrated.productionStatus}`,
  );
  snapshotOrders(await listOrders());
  return publicOrder(hydrated);
}

export async function updateOrder(order: SignOrder): Promise<SignOrder> {
  const db = await shopDb();
  const existing = (await db
    .prepare("SELECT json FROM orders WHERE id = ?")
    .get(order.id)) as { json: string } | undefined;
  if (!existing) {
    throw new Error("Order not on this server.");
  }
  const next = hydrateOrder({
    ...order,
    updatedAt: new Date().toISOString(),
  });
  await writeOrderRow(db, next);
  snapshotOrders(await listOrders());
  return publicOrder(next);
}

export async function getOrder(id: string): Promise<SignOrder | undefined> {
  const row = (await (await shopDb())
    .prepare("SELECT json FROM orders WHERE id = ?")
    .get(id)) as { json: string } | undefined;
  return row ? hydrateOrder(rowToOrder(row)) : undefined;
}

export async function getPublicOrder(id: string): Promise<SignOrder | undefined> {
  const order = await getOrder(id);
  return order ? publicOrder(order) : undefined;
}

export async function getOrderIfToken(
  id: string,
  token: string,
): Promise<SignOrder | undefined> {
  const order = await getOrder(id);
  if (!order || !accessTokenMatches(token, order.accessTokenHash)) return undefined;
  return publicOrder(order);
}

export async function listOrders(username?: string): Promise<SignOrder[]> {
  const rows = (await (await shopDb())
    .prepare("SELECT json FROM orders ORDER BY created_at DESC")
    .all()) as Array<{ json: string }>;
  const all = rows.map((row) => publicOrder(rowToOrder(row)));
  if (!username) return all;
  return all.filter(
    (order) => order.username.toLowerCase() === username.toLowerCase(),
  );
}

export async function listOrdersByTelegramChat(
  chatId: number,
): Promise<SignOrder[]> {
  if (!Number.isFinite(chatId) || chatId === 0) return [];
  return (await listOrders()).filter((order) => order.telegramChatId === chatId);
}

export async function listOrdersForAccount(account: {
  id: string;
  username: string;
}): Promise<SignOrder[]> {
  return (await listOrders()).filter((order) => {
    if (order.userId === account.id) return true;
    if (order.userId) return false;
    return order.username.toLowerCase() === account.username.toLowerCase();
  });
}

export async function recordLedger(
  orderId: string,
  kind: string,
  detail: string,
): Promise<void> {
  await appendLedger(await shopDb(), orderId, kind, detail);
}

export async function getOrderIfTokenInternal(
  id: string,
  token: string,
): Promise<SignOrder | undefined> {
  const order = await getOrder(id);
  if (!order || !accessTokenMatches(token, order.accessTokenHash)) return undefined;
  return order;
}

export async function findOrderByCheckoutSession(
  sessionId: string,
): Promise<SignOrder | undefined> {
  if (!sessionId) return undefined;
  const rows = (await (await shopDb())
    .prepare("SELECT json FROM orders")
    .all()) as Array<{ json: string }>;
  for (const row of rows) {
    const order = rowToOrder(row);
    if (order.stripeCheckoutSessionId === sessionId) return order;
  }
  return undefined;
}

export async function findOrderByPaymentIntent(
  intentId: string,
): Promise<SignOrder | undefined> {
  if (!intentId) return undefined;
  const rows = (await (await shopDb())
    .prepare("SELECT json FROM orders")
    .all()) as Array<{ json: string }>;
  for (const row of rows) {
    const order = rowToOrder(row);
    if (order.stripePaymentIntentId === intentId) return order;
  }
  return undefined;
}

export async function rememberStripeEvent(
  id: string,
  kind: string,
  orderId: string | null,
): Promise<boolean> {
  return markEventProcessed(id, kind, orderId);
}

export async function stripeEventSeen(id: string): Promise<boolean> {
  return eventWasProcessed(id);
}

export async function attachAccessToken(
  id: string,
): Promise<{ order: SignOrder; token: string }> {
  const current = await getOrder(id);
  if (!current) throw new Error("Order not on this server.");
  const minted = createAccessToken();
  current.accessTokenHash = minted.hash;
  const next = await updateOrder(current);
  await appendLedger(await shopDb(), id, "pay_link", "minted hashed access token");
  return { order: next, token: minted.token };
}
