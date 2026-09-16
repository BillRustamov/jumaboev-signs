import puppeteer, { type Browser } from "puppeteer-core";
import { InputFile } from "grammy";
import type { Context } from "grammy";
import type { SignFields } from "../src/lib/order";
import { applyPreset, STYLE_PRESETS } from "../src/lib/sign-style";

function shopUrl() {
  return (process.env.APP_URL ?? "http://127.0.0.1:43147").replace(/\/$/, "");
}

function chromePath() {
  return process.env.CHROME_PATH ?? "/usr/local/bin/google-chrome";
}

let browserPromise: Promise<Browser> | null = null;

function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      executablePath: chromePath(),
      headless: true,
      args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
    });
  }
  return browserPromise;
}

export async function screenshotTruck(
  fields: SignFields,
): Promise<Buffer | null> {
  const id = `pv-${Math.floor(100000 + Math.random() * 900000)}`;
  try {
    const saved = await fetch(`${shopUrl()}/api/preview-draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, fields }),
    });
    if (!saved.ok) return null;
    const chrome = await getBrowser();
    const page = await chrome.newPage();
    await page.setViewport({ width: 1340, height: 828, deviceScaleFactor: 1 });
    await page.goto(`${shopUrl()}/preview/bot?draft=${id}`, {
      waitUntil: "networkidle0",
      timeout: 20000,
    });
    const buf = await page.screenshot({ type: "png" });
    await page.close();
    return Buffer.from(buf);
  } catch (error) {
    console.error("Could not screenshot cab mockup.", error);
    return null;
  }
}

export function styledFields(base: SignFields, presetId: string): SignFields {
  return {
    ...base,
    ...applyPreset(presetId),
    showMc: base.showMc,
    logoDataUrl: base.logoDataUrl,
    logoSize: base.logoSize,
    companyName: base.companyName,
    legalName: base.legalName,
    dotNumber: base.dotNumber,
    mcNumber: base.mcNumber,
  };
}

export async function telegramSendPhoto(
  ctx: Context,
  image: Buffer,
  caption: string,
): Promise<void> {
  await ctx.replyWithPhoto(new InputFile(image, "cab.png"), {
    caption: caption.slice(0, 1024),
  });
}

export { STYLE_PRESETS };
