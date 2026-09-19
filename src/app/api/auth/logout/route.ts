import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import {
  applySessionCookie,
  deleteSession,
  sessionTokenFromRequest,
} from "@/lib/auth";

export async function POST(request: Request) {
  await deleteSession(sessionTokenFromRequest(request));
  return applySessionCookie(NextResponse.json({ ok: true }), null);
}
