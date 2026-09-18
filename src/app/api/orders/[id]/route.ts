import { NextResponse } from "next/server";
import { describeCheckout } from "@/lib/checkout";
import {
  assertPaymentMove,
  assertProductionMove,
  hydrateOrder,
  isPaymentStatus,
  isProductionStatus,
  paymentOf,
  productionOf,
} from "@/lib/order-status";
import { parseUsdToMinor } from "@/lib/money";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import {
  attachAccessToken,
  getOrder,
  getOrderIfToken,
  getPublicOrder,
  recordLedger,
  updateOrder,
} from "@/lib/store";
import { notifyCustomerPay } from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (token) {
    if (!rateLimit(clientKey(request, "pay-get"), 30, 60_000)) {
      return NextResponse.json({ error: "Too many lookups." }, { status: 429 });
    }
    const order = getOrderIfToken(id, token);
    if (!order) {
      return NextResponse.json({ error: "This pay link is not valid." }, { status: 404 });
    }
    return NextResponse.json({
      order,
      checkout: describeCheckout(order),
    });
  }
  const order = getPublicOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not on this server." }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!rateLimit(clientKey(request, "order-patch"), 40, 60_000)) {
    return NextResponse.json({ error: "Too many updates." }, { status: 429 });
  }
  const { id } = await context.params;
  const current = getOrder(id);
  if (!current) {
    return NextResponse.json({ error: "Order not on this server." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send JSON fields." }, { status: 400 });
  }
  const input = body as {
    productionStatus?: unknown;
    paymentStatus?: unknown;
    amountUsd?: unknown;
    amountMinor?: unknown;
    mintPayLink?: unknown;
  };

  let next = hydrateOrder(current);

  if (input.paymentStatus !== undefined) {
    if (!isPaymentStatus(input.paymentStatus)) {
      return NextResponse.json({ error: "Unknown payment status." }, { status: 400 });
    }
    const blocked = assertPaymentMove(input.paymentStatus);
    if (blocked) {
      return NextResponse.json({ error: blocked }, { status: 400 });
    }
    next.paymentStatus = input.paymentStatus;
  }

  if (input.amountUsd !== undefined || input.amountMinor !== undefined) {
    const minor =
      typeof input.amountMinor === "number"
        ? Math.round(input.amountMinor)
        : parseUsdToMinor(String(input.amountUsd ?? ""));
    if (minor === null || minor <= 0) {
      return NextResponse.json(
        { error: "Set an approved price above $0." },
        { status: 400 },
      );
    }
    next.amountMinor = minor;
    next.currency = "usd";
    recordLedger(id, "price", `${minor} usd cents`);
  }

  const wantsReady = input.productionStatus === "READY_FOR_PAYMENT";
  const mintLink = wantsReady || input.mintPayLink === true;

  if (input.productionStatus !== undefined) {
    if (!isProductionStatus(input.productionStatus)) {
      return NextResponse.json({ error: "Unknown production status." }, { status: 400 });
    }
    const blocked = assertProductionMove(next, input.productionStatus);
    if (blocked) {
      return NextResponse.json({ error: blocked }, { status: 400 });
    }
    const from = productionOf(next);
    next.productionStatus = input.productionStatus;
    next.status =
      input.productionStatus === "RECEIVED" ? "received" : input.productionStatus;
    recordLedger(id, "production", `${from} -> ${input.productionStatus}`);
  }

  next = updateOrder(next);

  if (mintLink) {
    const minted = attachAccessToken(id);
    next = minted.order;
    const payPath = `/orders/${id}/pay?token=${encodeURIComponent(minted.token)}`;
    if (wantsReady) void notifyCustomerPay(next, payPath);
    return NextResponse.json({ order: next, payPath, token: minted.token });
  }

  return NextResponse.json({
    order: next,
    production: productionOf(next),
    payment: paymentOf(next),
  });
}
