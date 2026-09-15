import type { SignOrder } from "@/lib/order";

type GlobalOrders = typeof globalThis & {
  __jumaboevOrders?: Map<string, SignOrder>;
};

function ordersMap(): Map<string, SignOrder> {
  const g = globalThis as GlobalOrders;
  if (!g.__jumaboevOrders) {
    g.__jumaboevOrders = new Map();
  }
  return g.__jumaboevOrders;
}

export function saveOrder(order: SignOrder): SignOrder {
  ordersMap().set(order.id, order);
  return order;
}

export function getOrder(id: string): SignOrder | undefined {
  return ordersMap().get(id);
}

export function listOrders(username?: string): SignOrder[] {
  const all = Array.from(ordersMap().values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!username) return all;
  return all.filter(
    (order) => order.username.toLowerCase() === username.toLowerCase(),
  );
}
