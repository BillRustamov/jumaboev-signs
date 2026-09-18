import type { SignOrder } from "@/lib/order";

/** Public Telegram handle for this shop. The token stays in `.env`. */
export const TELEGRAM_BOT_USERNAME = "usprinter_bot";
export const TELEGRAM_BOT_URL = `https://t.me/${TELEGRAM_BOT_USERNAME}`;

export function shopTicketText(order: SignOrder): string {
  const service = order.service === "PRINT_ONLY" ? "PRINT_ONLY" : "CUSTOM_DESIGN";
  const lines = [
    `New ${order.source} ${service} ticket ${order.id}`,
    `@${order.username}`,
  ];
  if (service === "PRINT_ONLY") {
    lines.push(
      `File: ${order.originalFileName || "upload"}`,
      order.printExact === false && order.printNotes
        ? `Change note: ${order.printNotes}`
        : "Print exactly as sent",
    );
  } else {
    lines.push(
      `${order.companyName} · USDOT ${order.dotNumber} · MC ${order.mcNumber}`,
    );
  }
  lines.push("Size: 20 × 12 in · quantity: 1 pair (2 decals)");
  lines.push("Example cut is 20 × 12 in for each side of the cab.");
  if (order.telegramChatId) {
    lines.push(`Telegram chat ${order.telegramChatId}`);
  }
  return lines.join("\n");
}

/** Ping Telegram Bot API. Missing credentials are a no-op, not an error. */
export async function notifyShop(order: SignOrder): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_SHOP_CHAT_ID?.trim();
  if (!token || !chatId) return;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: shopTicketText(order),
        }),
      },
    );
    if (!response.ok) {
      const detail = await response.text();
      console.error("Shop Telegram notify failed.", response.status, detail);
    }
  } catch (error) {
    console.error("Could not notify shop Telegram.", error);
  }
}
