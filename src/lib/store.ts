import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { SignOrder } from "@/lib/order";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "orders.json");

type GlobalOrders = typeof globalThis & {
  __jumaboevOrders?: Map<string, SignOrder>;
};

function hydrate(): Map<string, SignOrder> {
  const map = new Map<string, SignOrder>();
  try {
    const raw = JSON.parse(readFileSync(DATA_FILE, "utf8")) as SignOrder[];
    if (Array.isArray(raw)) {
      for (const order of raw) {
        if (order?.id) map.set(order.id, order);
      }
    }
  } catch {
    /* first run or empty file */
  }
  return map;
}

function ordersMap(): Map<string, SignOrder> {
  const g = globalThis as GlobalOrders;
  if (!g.__jumaboevOrders) {
    g.__jumaboevOrders = hydrate();
  }
  return g.__jumaboevOrders;
}

function persist(): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(
      DATA_FILE,
      JSON.stringify(Array.from(ordersMap().values()), null, 2),
    );
  } catch (error) {
    console.error("Could not persist shop orders.", error);
  }
}

export function saveOrder(order: SignOrder): SignOrder {
  ordersMap().set(order.id, order);
  persist();
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
