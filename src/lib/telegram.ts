import type { SignOrder } from "@/lib/order";

export function shopTicketText(order: SignOrder): string {
  const lines = [
    `New ${order.source} ticket ${order.id}`,
    `@${order.username}`,
    `${order.companyName} · USDOT ${order.dotNumber}`,
  ];
  if (order.showMc && order.mcNumber) {
    lines.push(`MC ${order.mcNumber}`);
  }
  lines.push("Approximately 10×20 in for each side of the cab.");
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
