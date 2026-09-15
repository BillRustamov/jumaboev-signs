import { NextResponse } from "next/server";
import { getOrder } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const order = getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not on this server." }, { status: 404 });
  }
  return NextResponse.json(order);
}
