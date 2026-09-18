-- Jumaboev Signs tickets. Used by Cloudflare D1 and documented for local SQLite.
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
