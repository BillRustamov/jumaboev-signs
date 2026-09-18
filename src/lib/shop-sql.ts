/** Shared SQL shape for local node:sqlite and Cloudflare D1. */

export type SqlResult = { changes: number };

export type SqlStatement = {
  get(...params: unknown[]): Promise<unknown>;
  all(...params: unknown[]): Promise<unknown[]>;
  run(...params: unknown[]): Promise<SqlResult>;
};

export type ShopSql = {
  kind: "sqlite" | "d1";
  exec(sql: string): Promise<void>;
  prepare(sql: string): SqlStatement;
};

type D1Like = {
  exec(query: string): Promise<unknown>;
  prepare(query: string): {
    bind(...values: unknown[]): {
      first<T = unknown>(): Promise<T | null>;
      all<T = unknown>(): Promise<{ results: T[] }>;
      run(): Promise<{ meta?: { changes?: number } }>;
    };
  };
};

export function d1Sql(db: D1Like): ShopSql {
  return {
    kind: "d1",
    async exec(sql: string) {
      await db.exec(sql);
    },
    prepare(sql: string) {
      return {
        async get(...params: unknown[]) {
          return (await db.prepare(sql).bind(...params).first()) ?? undefined;
        },
        async all(...params: unknown[]) {
          const result = await db.prepare(sql).bind(...params).all();
          return result.results ?? [];
        },
        async run(...params: unknown[]) {
          const result = await db.prepare(sql).bind(...params).run();
          return { changes: Number(result.meta?.changes ?? 0) };
        },
      };
    },
  };
}

export async function localSqlite(file: string): Promise<ShopSql> {
  const { DatabaseSync } = await import("node:sqlite");
  const { mkdirSync } = await import("node:fs");
  const path = await import("node:path");
  mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  return {
    kind: "sqlite",
    async exec(sql: string) {
      db.exec(sql);
    },
    prepare(sql: string) {
      const stmt = db.prepare(sql);
      return {
        async get(...params: unknown[]) {
          return stmt.get(...params);
        },
        async all(...params: unknown[]) {
          return stmt.all(...params);
        },
        async run(...params: unknown[]) {
          const result = stmt.run(...params) as { changes: number };
          return { changes: Number(result.changes) };
        },
      };
    },
  };
}

export async function tryCloudflareD1(): Promise<ShopSql | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    const db = (ctx.env as { DB?: D1Like } | undefined)?.DB;
    return db ? d1Sql(db) : null;
  } catch {
    return null;
  }
}
