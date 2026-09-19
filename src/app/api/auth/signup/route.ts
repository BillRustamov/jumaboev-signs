import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import {
  applySessionCookie,
  claimGuestOrders,
  createSession,
  createUser,
} from "@/lib/auth";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { notifyAccountWelcome } from "@/lib/shop-mail";

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "auth-signup"), 8, 15 * 60_000)) {
    return NextResponse.json(
      { error: "Too many account attempts. Wait a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send JSON account fields." }, { status: 400 });
  }
  const input = body as { email?: string; password?: string; username?: string };
  const created = await createUser({
    email: String(input.email ?? ""),
    password: String(input.password ?? ""),
    username: input.username,
  });
  if ("error" in created) {
    return NextResponse.json({ error: created.error }, { status: created.status });
  }

  await claimGuestOrders(created.user);
  const token = await createSession(created.user.id);
  void notifyAccountWelcome(created.user);
  return applySessionCookie(NextResponse.json({ user: created.user }), token);
}
