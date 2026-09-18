import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import {
  createOrderId,
  normalizeSign,
  resolveService,
  validateSign,
  validateUsername,
  type OrderSource,
  type SignOrder,
} from "@/lib/order";
import {
  PRINT_FILE_MAX_BYTES,
  isPrintFile,
  printFileFromDataUrl,
} from "@/lib/print-file";
import { stampNewOrder } from "@/lib/order-status";
import { listOrders, listOrdersByTelegramChat, saveOrder } from "@/lib/store";
import { notifyShop } from "@/lib/telegram";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatRaw = searchParams.get("telegramChatId");
  if (chatRaw) {
    const chatId = Number(chatRaw);
    return NextResponse.json({ orders: listOrdersByTelegramChat(chatId) });
  }
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
  const fields = normalizeSign(input);
  const username = String(input.username ?? "").trim();
  const usernameError = validateUsername(username);
  if (usernameError) {
    return NextResponse.json({ error: usernameError }, { status: 400 });
  }
  const service = resolveService(input.service);
  if (service === "PRINT_ONLY") {
    const file = String(
      input.originalArtworkUrl || input.logoDataUrl || "",
    ).trim();
    const parsed = printFileFromDataUrl(file);
    if (!file || !parsed || !isPrintFile(parsed.mime, input.originalFileName)) {
      return NextResponse.json(
        { error: "Send a PDF, SVG, PNG, JPEG, or WebP." },
        { status: 400 },
      );
    }
    if (parsed.bytes > PRINT_FILE_MAX_BYTES) {
      return NextResponse.json(
        { error: "Print file must be under 8 MB." },
        { status: 400 },
      );
    }
    fields.originalArtworkUrl = file;
    fields.logoDataUrl = "";
  } else {
    const issues = validateSign(fields);
    if (issues.length) {
      return NextResponse.json({ error: issues[0] }, { status: 400 });
    }
  }

  const source: OrderSource = input.source === "telegram" ? "telegram" : "web";
  const telegramChatId =
    typeof input.telegramChatId === "number" &&
    Number.isFinite(input.telegramChatId)
      ? input.telegramChatId
      : undefined;
  const order: SignOrder = {
    ...fields,
    id: input.id?.startsWith("JS-") ? input.id : createOrderId(),
    username,
    source,
    language: input.language,
    telegramChatId,
    createdAt: input.createdAt ?? new Date().toISOString(),
    status: "received",
    service,
    printExact: service === "PRINT_ONLY" ? input.printExact !== false : undefined,
    printNotes:
      service === "PRINT_ONLY"
        ? String(input.printNotes ?? "").trim() || undefined
        : undefined,
    originalFileName:
      service === "PRINT_ONLY"
        ? String(input.originalFileName ?? "").trim() || undefined
        : undefined,
    originalMime:
      service === "PRINT_ONLY"
        ? String(input.originalMime ?? "").trim() || undefined
        : undefined,
  };

  const saved = saveOrder(stampNewOrder(order));
  void notifyShop(saved);
  return NextResponse.json(saved);
}
