import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import {
  createOrderId,
  normalizeSign,
  validateSign,
  validateUsername,
  type OrderSource,
  type SignOrder,
} from "@/lib/order";
import { listOrders, saveOrder } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") ?? undefined;
  return NextResponse.json({ orders: listOrders(username) });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send JSON order fields." }, { status: 400 });
  }

  const input = body as Partial<SignOrder>;
  const fields = normalizeSign({
    companyName: String(input.companyName ?? ""),
    legalName: String(input.legalName ?? ""),
    dotNumber: String(input.dotNumber ?? ""),
    mcNumber: String(input.mcNumber ?? ""),
    fleetNumber: String(input.fleetNumber ?? ""),
    logoDataUrl: String(input.logoDataUrl ?? ""),
  });
  const username = String(input.username ?? "").trim();
  const usernameError = validateUsername(username);
  if (usernameError) {
    return NextResponse.json({ error: usernameError }, { status: 400 });
  }
  const issues = validateSign(fields);
  if (issues.length) {
    return NextResponse.json({ error: issues[0] }, { status: 400 });
  }

  const source: OrderSource = input.source === "telegram" ? "telegram" : "web";
  const order: SignOrder = {
    ...fields,
    id: input.id?.startsWith("JS-") ? input.id : createOrderId(),
    username,
    source,
    language: input.language,
    createdAt: input.createdAt ?? new Date().toISOString(),
    status: "received",
  };

  return NextResponse.json(saveOrder(order));
}
