import { NextResponse } from "next/server";
import {
  createId,
  createSessionToken,
  hashPassword,
  normalizeEmail,
  sha256Hex,
  validateEmail,
  validatePassword,
  verifyPassword,
} from "@/lib/auth-crypto";
import { validateUsername } from "@/lib/order";
import { hydrateOrder } from "@/lib/order-status";
import { shopDb, writeOrderRow } from "@/lib/shop-db";
import type { SignOrder } from "@/lib/order";
import type { ShopAccount } from "@/lib/account";

export const SESSION_COOKIE = "jumaboev_session";
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export type { ShopAccount } from "@/lib/account";

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  username: string;
};

function publicAccount(row: Pick<UserRow, "id" | "email" | "username">): ShopAccount {
  return { id: row.id, email: row.email, username: row.username };
}

function cookieSecure(): boolean {
  return (process.env.APP_URL ?? "").startsWith("https://");
}

export function sessionTokenFromRequest(request: Request): string {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) {
      try {
        return decodeURIComponent(rest.join("="));
      } catch {
        return rest.join("=");
      }
    }
  }
  return "";
}

export function applySessionCookie(
  response: NextResponse,
  token: string | null,
): NextResponse {
  response.cookies.set(SESSION_COOKIE, token ?? "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: token ? SESSION_MAX_AGE_SEC : 0,
    secure: cookieSecure(),
  });
  return response;
}

export async function findUserByEmail(email: string): Promise<UserRow | undefined> {
  const row = (await (await shopDb())
    .prepare("SELECT id, email, password_hash, username FROM users WHERE email = ?")
    .get(normalizeEmail(email))) as UserRow | undefined;
  return row;
}

export async function getUserById(id: string): Promise<ShopAccount | undefined> {
  const row = (await (await shopDb())
    .prepare("SELECT id, email, username FROM users WHERE id = ?")
    .get(id)) as ShopAccount | undefined;
  return row ? publicAccount(row) : undefined;
}

export async function createUser(input: {
  email: string;
  password: string;
  username?: string;
}): Promise<{ user: ShopAccount } | { error: string; status: number }> {
  const email = normalizeEmail(input.email);
  const emailError = validateEmail(email);
  if (emailError) return { error: emailError, status: 400 };
  const passwordError = validatePassword(input.password);
  if (passwordError) return { error: passwordError, status: 400 };

  let username = String(input.username ?? "").trim();
  if (!username) username = email;
  const usernameError = validateUsername(username);
  if (usernameError) return { error: usernameError, status: 400 };

  if (await findUserByEmail(email)) {
    return { error: "An account with this email already exists.", status: 409 };
  }

  const user: ShopAccount = {
    id: createId("usr"),
    email,
    username,
  };
  await (
    await shopDb()
  )
    .prepare(
      "INSERT INTO users (id, email, password_hash, username, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .run(user.id, email, await hashPassword(input.password), username, new Date().toISOString());
  return { user };
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<ShopAccount | undefined> {
  const row = await findUserByEmail(email);
  if (!row) {
    await hashPassword("timing-guard-missing-user");
    return undefined;
  }
  if (!(await verifyPassword(password, row.password_hash))) return undefined;
  return publicAccount(row);
}

export async function createSession(userId: string): Promise<string> {
  const token = createSessionToken();
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_MAX_AGE_SEC * 1000);
  await (
    await shopDb()
  )
    .prepare(
      "INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
    )
    .run(await sha256Hex(token), userId, expires.toISOString(), now.toISOString());
  return token;
}

export async function deleteSession(token: string): Promise<void> {
  if (!token) return;
  await (await shopDb())
    .prepare("DELETE FROM sessions WHERE id = ?")
    .run(await sha256Hex(token));
}

export async function userFromRequest(
  request: Request,
): Promise<ShopAccount | undefined> {
  const token = sessionTokenFromRequest(request);
  if (!token) return undefined;
  const hash = await sha256Hex(token);
  const now = new Date().toISOString();
  const row = (await (await shopDb())
    .prepare(
      `SELECT users.id, users.email, users.username
       FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.id = ? AND sessions.expires_at > ?`,
    )
    .get(hash, now)) as ShopAccount | undefined;
  if (!row) return undefined;
  return publicAccount(row);
}

/** Attach older guest tickets that used this shop username. */
export async function claimGuestOrders(account: ShopAccount): Promise<number> {
  const db = await shopDb();
  const rows = (await db.prepare("SELECT json FROM orders").all()) as Array<{
    json: string;
  }>;
  let claimed = 0;
  for (const row of rows) {
    const order = hydrateOrder(JSON.parse(row.json) as SignOrder);
    if (order.userId) continue;
    if (order.username.toLowerCase() !== account.username.toLowerCase()) continue;
    await writeOrderRow(db, {
      ...order,
      userId: account.id,
      updatedAt: new Date().toISOString(),
    });
    claimed += 1;
  }
  return claimed;
}
