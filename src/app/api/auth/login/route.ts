import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import {
  applySessionCookie,
  authenticateUser,
  claimGuestOrders,
  createSession,
} from "@/lib/auth";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "auth-login"), 12, 15 * 60_000)) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Wait a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send JSON account fields." }, { status: 400 });
  }
  const input = body as { email?: string; password?: string };
  const user = await authenticateUser(
    String(input.email ?? ""),
    String(input.password ?? ""),
  );
  if (!user) {
    return NextResponse.json(
      { error: "Email or password is wrong." },
      { status: 401 },
    );
  }

  await claimGuestOrders(user);
  const token = await createSession(user.id);
  return applySessionCookie(NextResponse.json({ user }), token);
}
