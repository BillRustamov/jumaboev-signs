import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { SignOrder } from "@/lib/order";
import { hydrateOrder } from "@/lib/order-status";
import {
  localSqlite,
  tryCloudflareD1,
  type ShopSql,
} from "@/lib/shop-sql";

const DATA_DIR = path.join(process.cwd(), "data");

const SCHEMA = `
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
    CREATE TABLE IF NOT EXISTS processed_events (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      order_id TEXT,
      created_at TEXT NOT NULL
    );
`;

function jsonFile(): string {
  return process.env.SHOP_JSON_PATH || path.join(DATA_DIR, "orders.json");
}

function snapshotFile(): string {
  return process.env.SHOP_SNAPSHOT_PATH || path.join(DATA_DIR, "orders.snapshot.json");
}

type GlobalDb = typeof globalThis & {
  __jumaboevShopSql?: ShopSql;
  __jumaboevShopSqlReady?: Promise<ShopSql>;
};

export function dbPath(): string {
  return process.env.SHOP_DB_PATH || path.join(DATA_DIR, "shop.sqlite");
}

export async function shopDb(): Promise<ShopSql> {
  const g = globalThis as GlobalDb;
  if (g.__jumaboevShopSql) {
    await ensureSchema(g.__jumaboevShopSql);
    return g.__jumaboevShopSql;
  }
  if (!g.__jumaboevShopSqlReady) {
    g.__jumaboevShopSqlReady = openShopSql();
  }
  const sql = await g.__jumaboevShopSqlReady;
  g.__jumaboevShopSql = sql;
  return sql;
}

async function openShopSql(): Promise<ShopSql> {
  const d1 = await tryCloudflareD1();
  const sql = d1 ?? (await localSqlite(dbPath()));
  await ensureSchema(sql);
  await migrateJsonIfNeeded(sql);
  return sql;
}

async function ensureSchema(db: ShopSql): Promise<void> {
  await db.exec(SCHEMA);
}

export function resetShopDbForTests(): void {
  const g = globalThis as GlobalDb;
  g.__jumaboevShopSql = undefined;
  g.__jumaboevShopSqlReady = undefined;
}

async function metaGet(db: ShopSql, key: string): Promise<string | undefined> {
  const row = (await db.prepare("SELECT value FROM meta WHERE key = ?").get(key)) as
    | { value: string }
    | undefined;
  return row?.value;
}

async function metaSet(db: ShopSql, key: string, value: string): Promise<void> {
  await db
    .prepare(
      "INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    )
    .run(key, value);
}

async function migrateJsonIfNeeded(db: ShopSql): Promise<void> {
  if ((await metaGet(db, "migrated_from_json")) === "1") return;
  if (db.kind === "d1" || !existsSync(jsonFile())) {
    await metaSet(db, "migrated_from_json", "1");
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
    await metaSet(db, "migrated_from_json", "1");
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
  try {
    if (db.kind === "sqlite") await db.exec("BEGIN");
    for (const item of raw) {
      if (!item || typeof item !== "object" || !("id" in item)) continue;
      const order = hydrateOrder(item as SignOrder);
      await insert.run(
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
      await ledger.run(
        order.id,
        "migrate",
        "imported from data/orders.json after backup",
        now,
      );
    }
    await metaSet(db, "migrated_from_json", "1");
    await metaSet(db, "migrated_at", now);
    if (db.kind === "sqlite") await db.exec("COMMIT");
  } catch (error) {
    if (db.kind === "sqlite") {
      try {
        await db.exec("ROLLBACK");
      } catch {
        /* already rolled back */
      }
    }
    console.error("SQLite migrate from orders.json failed.", error);
  }
}

export function rowToOrder(row: { json: string }): SignOrder {
  return hydrateOrder(JSON.parse(row.json) as SignOrder);
}

export async function writeOrderRow(db: ShopSql, order: SignOrder): Promise<void> {
  const hydrated = hydrateOrder(order);
  await db
    .prepare(
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
    )
    .run(
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

export async function appendLedger(
  db: ShopSql,
  orderId: string,
  kind: string,
  detail: string,
): Promise<void> {
  await db
    .prepare(
      "INSERT INTO ledger (order_id, kind, detail, created_at) VALUES (?, ?, ?, ?)",
    )
    .run(orderId, kind, detail, new Date().toISOString());
}

export function snapshotOrders(orders: SignOrder[]): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(snapshotFile(), JSON.stringify(orders, null, 2));
  } catch (error) {
    if (process.env.SHOP_SNAPSHOT_PATH) {
      console.error("Could not write orders snapshot.", error);
    }
  }
}

export async function markEventProcessed(
  id: string,
  kind: string,
  orderId: string | null,
): Promise<boolean> {
  const result = await (
    await shopDb()
  )
    .prepare(
      "INSERT OR IGNORE INTO processed_events (id, kind, order_id, created_at) VALUES (?, ?, ?, ?)",
    )
    .run(id, kind, orderId, new Date().toISOString());
  return Number(result.changes) > 0;
}

export async function eventWasProcessed(id: string): Promise<boolean> {
  const row = (await (
    await shopDb()
  )
    .prepare("SELECT id FROM processed_events WHERE id = ?")
    .get(id)) as { id: string } | undefined;
  return Boolean(row);
}

export async function listLedger(orderId: string): Promise<
  Array<{
    id: number;
    kind: string;
    detail: string;
    createdAt: string;
  }>
> {
  return (await (
    await shopDb()
  )
    .prepare(
      "SELECT id, kind, detail, created_at AS createdAt FROM ledger WHERE order_id = ? ORDER BY id ASC",
    )
    .all(orderId)) as Array<{
    id: number;
    kind: string;
    detail: string;
    createdAt: string;
  }>;
}
