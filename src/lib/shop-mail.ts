import type { ShopAccount } from "@/lib/account";
import { getUserById } from "@/lib/auth";
import { mailConfig, sendShopEmail } from "@/lib/mail";
import type { SignOrder } from "@/lib/order";
import { shopAppUrl } from "@/lib/stripe-config";
import { shopPayMessage, shopTicketText } from "@/lib/telegram";

async function emailForOrder(order: SignOrder, known?: string): Promise<string | undefined> {
  const direct = known?.trim();
  if (direct) return direct;
  if (!order.userId) return undefined;
  return (await getUserById(order.userId))?.email;
}

export function accountWelcomeText(user: ShopAccount): string {
  const base = shopAppUrl();
  return [
    `usprint account for ${user.email}.`,
    `Shop name @${user.username}.`,
    `Sign in at ${base}/account. Confirmed door tickets stay on ${base}/orders.`,
  ].join("\n");
}

export function orderReceivedText(order: SignOrder): string {
  const base = shopAppUrl();
  return [
    shopTicketText(order),
    "",
    `My orders: ${base}/orders`,
    `Account: ${base}/account`,
  ].join("\n");
}

export async function notifyAccountWelcome(user: ShopAccount): Promise<void> {
  await sendShopEmail({
    to: user.email,
    subject: "usprint account saved",
    text: accountWelcomeText(user),
  });
}

export async function notifyOrderReceived(
  order: SignOrder,
  email?: string,
): Promise<void> {
  const to = await emailForOrder(order, email);
  if (to) {
    await sendShopEmail({
      to,
      subject: `Ticket ${order.id} received`,
      text: orderReceivedText(order),
    });
  }
  const shopTo = mailConfig().shopTo;
  if (shopTo && shopTo.toLowerCase() !== to?.toLowerCase()) {
    await sendShopEmail({
      to: shopTo,
      subject: `New ${order.source} ticket ${order.id}`,
      text: shopTicketText(order),
    });
  }
}

export async function notifyPayReadyEmail(
  order: SignOrder,
  payPath: string,
): Promise<void> {
  const to = await emailForOrder(order);
  if (!to) return;
  const payUrl = `${shopAppUrl()}${payPath}`;
  await sendShopEmail({
    to,
    subject: `Ticket ${order.id} is ready for payment`,
    text: shopPayMessage(order, payUrl),
  });
}

export async function notifyPaymentEmail(order: SignOrder): Promise<void> {
  const to = await emailForOrder(order);
  if (!to) return;
  await sendShopEmail({
    to,
    subject: `Ticket ${order.id} payment ${order.paymentStatus ?? "UNPAID"}`,
    text: [
      `Ticket ${order.id}`,
      `Payment: ${order.paymentStatus ?? "UNPAID"}`,
      `Production: ${order.productionStatus ?? "RECEIVED"}`,
      `My orders: ${shopAppUrl()}/orders`,
    ].join("\n"),
  });
}
