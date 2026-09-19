import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { userFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await userFromRequest(request);
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user });
}
