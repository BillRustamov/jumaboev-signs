export type MailConfig =
  | { enabled: true; apiKey: string; from: string; shopTo: string | null }
  | { enabled: false; apiKey: null; from: string; shopTo: string | null };

function readKey(): string {
  return (process.env.RESEND_API_KEY ?? process.env.RESEND_KEY ?? "").trim();
}

export function mailFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "usprint <orders@usprint.app>"
  );
}

export function mailConfig(): MailConfig {
  const apiKey = readKey();
  const from = mailFromAddress();
  const shopTo = process.env.RESEND_SHOP_TO?.trim() || null;
  if (!apiKey) {
    return { enabled: false, apiKey: null, from, shopTo };
  }
  return { enabled: true, apiKey, from, shopTo };
}

export async function sendShopEmail(input: {
  to: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  const config = mailConfig();
  const to = input.to.trim();
  if (!config.enabled || !to) return false;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [to],
        subject: input.subject,
        text: input.text,
      }),
    });
    if (!response.ok) {
      console.error("Resend send failed.", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Could not send shop email.", error);
    return false;
  }
}
