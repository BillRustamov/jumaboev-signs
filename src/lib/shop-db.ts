import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { SignOrder } from "@/lib/order";
import { hydrateOrder } from "@/lib/order-status";

const DATA_DIR = path.join(process.cwd(), "data");

function jsonFile(): string {
  return process.env.SHOP_JSON_PATH || path.join(DATA_DIR, "orders.json");
}

function snapshotFile(): string {
  return process.env.SHOP_SNAPSHOT_PATH || path.join(DATA_DIR, "orders.snapshot.json");
}

type GlobalDb = typeof globalThis & {
  __jumaboevShopDb?: DatabaseSync;
};

export function dbPath(): string {
  return process.env.SHOP_DB_PATH || path.join(DATA_DIR, "shop.sqlite");
}

export function shopDb(): DatabaseSync {
  const g = globalThis as GlobalDb;
  if (g.__jumaboevShopDb) return g.__jumaboevShopDb;
  const file = dbPath();
  mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      json TEXT NOT NULL,
      username TEXT NOT NULL,
      service TEXT NOT NULL,
      production_status TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      amount_minor INTEGER,
      currency TEXT,
      access_token_hash TEXT,
      telegram_chat_id INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ledger (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      detail TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS ledger_order ON ledger(order_id);
  `);
  migrateJsonIfNeeded(db);
  g.__jumaboevShopDb = db;
  return db;
}

export function resetShopDbForTests(): void {
  const g = globalThis as GlobalDb;
  if (g.__jumaboevShopDb) {
    try {
      g.__jumaboevShopDb.close();
    } catch {
      /* already closed */
    }
    g.__jumaboevShopDb = undefined;
  }
}

function metaGet(db: DatabaseSync, key: string): string | undefined {
  const row = db.prepare("SELECT value FROM meta WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value;
}

function metaSet(db: DatabaseSync, key: string, value: string): void {
  db.prepare(
    "INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
  ).run(key, value);
}

function migrateJsonIfNeeded(db: DatabaseSync): void {
  if (metaGet(db, "migrated_from_json") === "1") return;
  if (!existsSync(jsonFile())) {
    metaSet(db, "migrated_from_json", "1");
    return;
  }
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(jsonFile(), "utf8"));
  } catch (error) {
    console.error("Could not read orders.json for SQLite migrate.", error);
    return;
  }
  if (!Array.isArray(raw)) {
    metaSet(db, "migrated_from_json", "1");
    return;
  }
  const insert = db.prepare(`
    INSERT OR IGNORE INTO orders (
      id, json, username, service, production_status, payment_status,
      amount_minor, currency, access_token_hash, telegram_chat_id,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const ledger = db.prepare(
    "INSERT INTO ledger (order_id, kind, detail, created_at) VALUES (?, ?, ?, ?)",
  );
  const now = new Date().toISOString();
  db.exec("BEGIN");
  try {
    for (const item of raw) {
      if (!item || typeof item !== "object" || !("id" in item)) continue;
      const order = hydrateOrder(item as SignOrder);
      insert.run(
        order.id,
        JSON.stringify(order),
        order.username,
        order.service ?? "CUSTOM_DESIGN",
        order.productionStatus ?? "RECEIVED",
        order.paymentStatus ?? "UNPAID",
        order.amountMinor ?? null,
        order.currency ?? "usd",
        order.accessTokenHash ?? null,
        order.telegramChatId ?? null,
        order.createdAt,
        order.updatedAt ?? order.createdAt,
      );
      ledger.run(
        order.id,
        "migrate",
        "imported from data/orders.json after backup",
        now,
      );
    }
    metaSet(db, "migrated_from_json", "1");
    metaSet(db, "migrated_at", now);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    console.error("SQLite migrate from orders.json failed.", error);
  }
}

export function rowToOrder(row: { json: string }): SignOrder {
  return hydrateOrder(JSON.parse(row.json) as SignOrder);
}

export function writeOrderRow(db: DatabaseSync, order: SignOrder): void {
  const hydrated = hydrateOrder(order);
  db.prepare(
    `
    INSERT INTO orders (
      id, json, username, service, production_status, payment_status,
      amount_minor, currency, access_token_hash, telegram_chat_id,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      json = excluded.json,
      username = excluded.username,
      service = excluded.service,
      production_status = excluded.production_status,
      payment_status = excluded.payment_status,
      amount_minor = excluded.amount_minor,
      currency = excluded.currency,
      access_token_hash = excluded.access_token_hash,
      telegram_chat_id = excluded.telegram_chat_id,
      updated_at = excluded.updated_at
  `,
  ).run(
    hydrated.id,
    JSON.stringify(hydrated),
    hydrated.username,
    hydrated.service ?? "CUSTOM_DESIGN",
    hydrated.productionStatus ?? "RECEIVED",
    hydrated.paymentStatus ?? "UNPAID",
    hydrated.amountMinor ?? null,
    hydrated.currency ?? "usd",
    hydrated.accessTokenHash ?? null,
    hydrated.telegramChatId ?? null,
    hydrated.createdAt,
    hydrated.updatedAt ?? hydrated.createdAt,
  );
}

export function appendLedger(
  db: DatabaseSync,
  orderId: string,
  kind: string,
  detail: string,
): void {
  db.prepare(
    "INSERT INTO ledger (order_id, kind, detail, created_at) VALUES (?, ?, ?, ?)",
  ).run(orderId, kind, detail, new Date().toISOString());
}

export function snapshotOrders(orders: SignOrder[]): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(snapshotFile(), JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error("Could not write orders snapshot.", error);
  }
}

export function listLedger(orderId: string): Array<{
  id: number;
  kind: string;
  detail: string;
  createdAt: string;
}> {
  return shopDb()
    .prepare(
      "SELECT id, kind, detail, created_at AS createdAt FROM ledger WHERE order_id = ? ORDER BY id ASC",
    )
    .all(orderId) as Array<{
    id: number;
    kind: string;
    detail: string;
    createdAt: string;
  }>;
}
