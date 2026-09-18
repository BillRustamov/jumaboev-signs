import type { SignOrder } from "@/lib/order";
import { paymentChangeMessage } from "@/lib/payment-sync";
import { stripeConfig } from "@/lib/stripe-config";

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
  lines.push(
    `Production: ${order.productionStatus ?? "RECEIVED"} · Payment: ${order.paymentStatus ?? "UNPAID"}`,
  );
  lines.push("Example cut is 20 × 12 in for each side of the cab.");
  if (order.telegramChatId) {
    lines.push(`Telegram chat ${order.telegramChatId}`);
  }
  return lines.join("\n");
}

export function shopPayMessage(order: SignOrder, payUrl: string): string {
  return [
    `Ticket ${order.id} is ready for payment.`,
    `20 × 12 in · 1 pair`,
    order.amountMinor
      ? `Amount: ${(order.amountMinor / 100).toFixed(2)} USD`
      : "Amount: set by the shop",
    stripeConfig().enabled
      ? "Open this link to pay the approved amount. Paid is set only after Stripe confirms — never from the success page."
      : "Open this link to review the ticket. Card checkout is not configured — the ticket stays unpaid.",
    payUrl,
  ].join("\n");
}

export async function notifyCustomerPay(
  order: SignOrder,
  payPath: string,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = order.telegramChatId;
  if (!token || !chatId) return;
  const base = (process.env.APP_URL ?? "http://127.0.0.1:43147").replace(/\/$/, "");
  const payUrl = `${base}${payPath}`;
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: shopPayMessage(order, payUrl),
        }),
      },
    );
    if (!response.ok) {
      console.error("Customer pay notify failed.", response.status, await response.text());
    }
  } catch (error) {
    console.error("Could not notify customer Telegram.", error);
  }
}

async function sendTelegram(chatId: string | number, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return;
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      },
    );
    if (!response.ok) {
      console.error("Telegram notify failed.", response.status, await response.text());
    }
  } catch (error) {
    console.error("Could not notify Telegram.", error);
  }
}

/** Push the stored payment status. Never invents PAID. */
export async function notifyPaymentChange(order: SignOrder): Promise<void> {
  const text = paymentChangeMessage(order);
  if (order.telegramChatId) {
    await sendTelegram(order.telegramChatId, text);
  }
  const shopChat = process.env.TELEGRAM_SHOP_CHAT_ID?.trim();
  if (shopChat) {
    await sendTelegram(shopChat, text);
  }
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
