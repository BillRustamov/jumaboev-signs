import { createInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Bot, InlineKeyboard, type Context } from "grammy";
import {
  COPY,
  LANG_LABELS,
  LANGS,
  isLang,
  isSkipText,
  t,
  type Lang,
} from "./i18n";
import {
  createOrderId,
  emptySign,
  validateUsername,
  type SignFields,
  type SignOrder,
} from "../src/lib/order";
import { STYLE_PRESETS, applyPreset } from "../src/lib/sign-style";

type Step =
  | "lang"
  | "username"
  | "company"
  | "legal"
  | "dot"
  | "mc"
  | "logo"
  | "style"
  | "confirm";

type Draft = {
  lang: Lang;
  step: Step;
  fields: SignFields;
  username: string;
  telegramChatId?: number;
};

function loadDotEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  for (const raw of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadDotEnv();

const APP_URL = (process.env.APP_URL ?? "http://127.0.0.1:43147").replace(
  /\/$/,
  "",
);
const TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim();

type Button = { id: string; label: string };

function keyboardFrom(buttons: Button[], columns = 2) {
  const keyboard = new InlineKeyboard();
  buttons.forEach((button, index) => {
    keyboard.text(button.label, button.id);
    if ((index + 1) % columns === 0) keyboard.row();
  });
  return { keyboard, buttons };
}

function languageKeyboard() {
  return keyboardFrom(
    LANGS.map((lang) => ({ id: `lang:${lang}`, label: LANG_LABELS[lang] })),
  );
}

function skipKeyboard(lang: Lang) {
  return keyboardFrom([{ id: "skip", label: t(lang, "skip") }], 1);
}

function styleKeyboard() {
  return keyboardFrom(
    STYLE_PRESETS.map((preset) => ({
      id: `style:${preset.id}`,
      label: preset.label,
    })),
    2,
  );
}

function confirmKeyboard(lang: Lang) {
  return keyboardFrom(
    [
      { id: "confirm", label: t(lang, "yes") },
      { id: "restart", label: t(lang, "no") },
    ],
    2,
  );
}

function newDraft(): Draft {
  return {
    lang: "en",
    step: "lang",
    fields: emptySign(),
    username: "",
  };
}

function summary(draft: Draft): string {
  return [
    t(draft.lang, "confirmTitle"),
    t(draft.lang, "confirmBody", {
      username: draft.username,
      company: draft.fields.companyName,
      legal: draft.fields.legalName || "—",
      dot: draft.fields.dotNumber,
      mc: draft.fields.showMc && draft.fields.mcNumber ? draft.fields.mcNumber : "—",
      logo: draft.fields.logoDataUrl ? "yes" : "—",
      style: draft.fields.paletteId,
    }),
  ].join("\n");
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pingShop(): Promise<boolean> {
  try {
    const response = await fetch(`${APP_URL}/api/health`, { cache: "no-store" });
    if (!response.ok) return false;
    const body = (await response.json()) as { ok?: boolean };
    return body.ok === true;
  } catch {
    return false;
  }
}

async function postOrder(
  draft: Draft,
): Promise<{ order: SignOrder; shopOk: boolean }> {
  const order: SignOrder = {
    ...draft.fields,
    id: createOrderId(),
    username: draft.username,
    source: "telegram",
    language: draft.lang,
    telegramChatId: draft.telegramChatId,
    createdAt: new Date().toISOString(),
    status: "received",
  };
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(`${APP_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (response.ok) {
        const saved = (await response.json()) as SignOrder;
        return { order: saved, shopOk: true };
      }
    } catch {
      /* retry */
    }
    if (attempt < 3) await wait(400 * 2 ** attempt);
  }
  return { order, shopOk: false };
}

async function fileToDataUrl(filePath: string): Promise<string> {
  const buf = await readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
        ? "image/webp"
        : ext === ".gif"
          ? "image/gif"
          : "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

type Markup = { keyboard: InlineKeyboard; buttons: Button[] };

type Chat = {
  send: (text: string, extra?: Markup) => Promise<void> | void;
};

async function handleText(
  draft: Draft,
  text: string,
  chat: Chat,
): Promise<Draft> {
  const trimmed = text.trim();
  if (trimmed === "/start") {
    const next = newDraft();
    await chat.send(COPY.en.chooseLanguage, languageKeyboard());
    return next;
  }
  if (trimmed === "/help") {
    await chat.send(t(draft.lang, "help"));
    return draft;
  }

  switch (draft.step) {
    case "lang": {
      await chat.send(COPY.en.chooseLanguage, languageKeyboard());
      return draft;
    }
    case "username": {
      const error = validateUsername(trimmed);
      if (error) {
        await chat.send(t(draft.lang, "badUsername"));
        return draft;
      }
      draft.username = trimmed;
      draft.step = "company";
      await chat.send(t(draft.lang, "askCompany"));
      return draft;
    }
    case "company": {
      if (!trimmed) {
        await chat.send(t(draft.lang, "askCompany"));
        return draft;
      }
      draft.fields.companyName = trimmed;
      draft.step = "legal";
      await chat.send(t(draft.lang, "askLegal"), skipKeyboard(draft.lang));
      return draft;
    }
    case "legal": {
      draft.fields.legalName = isSkipText(trimmed, draft.lang) ? "" : trimmed;
      draft.step = "dot";
      await chat.send(t(draft.lang, "askDot"));
      return draft;
    }
    case "dot": {
      if (!/^\d{4,12}$/.test(trimmed)) {
        await chat.send(t(draft.lang, "numbersOnly"));
        return draft;
      }
      draft.fields.dotNumber = trimmed;
      draft.step = "mc";
      await chat.send(t(draft.lang, "askMc"), skipKeyboard(draft.lang));
      return draft;
    }
    case "mc": {
      if (!trimmed || isSkipText(trimmed, draft.lang)) {
        draft.fields.mcNumber = "";
        draft.fields.showMc = false;
        draft.step = "logo";
        await chat.send(t(draft.lang, "askLogo"), skipKeyboard(draft.lang));
        return draft;
      }
      if (!/^\d{4,10}$/.test(trimmed)) {
        await chat.send(t(draft.lang, "numbersOnly"));
        return draft;
      }
      draft.fields.mcNumber = trimmed;
      draft.fields.showMc = true;
      draft.step = "logo";
      await chat.send(t(draft.lang, "askLogo"), skipKeyboard(draft.lang));
      return draft;
    }
    case "logo": {
      if (!trimmed || isSkipText(trimmed, draft.lang)) {
        draft.step = "style";
        await chat.send(t(draft.lang, "askStyle"), styleKeyboard());
        return draft;
      }
      if (
        trimmed.startsWith("/") ||
        trimmed.endsWith(".png") ||
        trimmed.endsWith(".jpg") ||
        trimmed.endsWith(".jpeg") ||
        trimmed.endsWith(".webp")
      ) {
        try {
          draft.fields.logoDataUrl = await fileToDataUrl(trimmed);
        } catch {
          await chat.send(t(draft.lang, "askLogo"), skipKeyboard(draft.lang));
          return draft;
        }
      }
      draft.step = "style";
      await chat.send(t(draft.lang, "askStyle"), styleKeyboard());
      return draft;
    }
    case "style": {
      await chat.send(t(draft.lang, "askStyle"), styleKeyboard());
      return draft;
    }
    case "confirm": {
      await chat.send(summary(draft), confirmKeyboard(draft.lang));
      return draft;
    }
  }
}

async function handleCallback(
  draft: Draft,
  data: string,
  chat: Chat,
): Promise<Draft> {
  if (data.startsWith("lang:")) {
    const code = data.slice(5);
    if (!isLang(code)) return draft;
    draft.lang = code;
    draft.step = "username";
    await chat.send(`${t(draft.lang, "languageSet")}\n\n${t(draft.lang, "askUsername")}`);
    return draft;
  }
  if (data === "skip" && draft.step === "legal") {
    draft.fields.legalName = "";
    draft.step = "dot";
    await chat.send(t(draft.lang, "askDot"));
    return draft;
  }
  if (data === "skip" && draft.step === "mc") {
    draft.fields.mcNumber = "";
    draft.fields.showMc = false;
    draft.step = "logo";
    await chat.send(t(draft.lang, "askLogo"), skipKeyboard(draft.lang));
    return draft;
  }
  if (data === "skip" && draft.step === "logo") {
    draft.step = "style";
    await chat.send(t(draft.lang, "askStyle"), styleKeyboard());
    return draft;
  }
  if (data.startsWith("style:")) {
    const preset = applyPreset(data.slice(6));
    draft.fields = {
      ...draft.fields,
      ...preset,
      showMc: draft.fields.showMc,
    };
    draft.step = "confirm";
    await chat.send(summary(draft), confirmKeyboard(draft.lang));
    return draft;
  }
  if (data === "restart") {
    const lang = draft.lang;
    const next = newDraft();
    next.lang = lang;
    next.telegramChatId = draft.telegramChatId;
    next.step = "username";
    await chat.send(`${t(lang, "cancelled")}\n\n${t(lang, "askUsername")}`);
    return next;
  }
  if (data === "confirm" && draft.step === "confirm") {
    const { order, shopOk } = await postOrder(draft);
    await chat.send(t(draft.lang, "placed", { id: order.id }));
    await chat.send(
      shopOk ? t(draft.lang, "shopPosted") : t(draft.lang, "shopUnreachable"),
    );
    const next = newDraft();
    next.lang = draft.lang;
    next.telegramChatId = draft.telegramChatId;
    next.step = "username";
    return next;
  }
  return draft;
}

async function telegramPhotoToDataUrl(
  ctx: Context,
  fileId: string,
  token: string,
): Promise<string> {
  const file = await ctx.api.getFile(fileId);
  if (!file.file_path) return "";
  const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
  const response = await fetch(url);
  const buf = Buffer.from(await response.arrayBuffer());
  const mime = response.headers.get("content-type") || "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

async function runTelegram(token: string) {
  const bot = new Bot(token);
  const sessions = new Map<number, Draft>();

  function draftFor(id: number): Draft {
    const existing = sessions.get(id);
    if (existing) return existing;
    const created = newDraft();
    created.telegramChatId = id;
    sessions.set(id, created);
    return created;
  }

  bot.command("start", async (ctx) => {
    const chatId = ctx.chat.id;
    const draft = newDraft();
    draft.telegramChatId = chatId;
    sessions.set(chatId, draft);
    await ctx.reply(COPY.en.chooseLanguage, {
      reply_markup: languageKeyboard().keyboard,
    });
  });

  bot.command("help", async (ctx) => {
    const draft = draftFor(ctx.chat.id);
    await ctx.reply(t(draft.lang, "help"));
  });

  bot.on("callback_query:data", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    const draft = draftFor(chatId);
    const next = await handleCallback(draft, ctx.callbackQuery.data, {
      send: async (text, extra) => {
        await ctx.reply(text, extra ? { reply_markup: extra.keyboard } : {});
      },
    });
    sessions.set(chatId, next);
    await ctx.answerCallbackQuery();
  });

  bot.on("message:photo", async (ctx) => {
    const draft = draftFor(ctx.chat.id);
    if (draft.step !== "logo") {
      await ctx.reply(t(draft.lang, "help"));
      return;
    }
    const photo = ctx.message.photo.at(-1);
    if (photo) {
      draft.fields.logoDataUrl = await telegramPhotoToDataUrl(ctx, photo.file_id, token);
    }
    draft.step = "style";
    sessions.set(ctx.chat.id, draft);
    await ctx.reply(t(draft.lang, "askStyle"), {
      reply_markup: styleKeyboard().keyboard,
    });
  });

  bot.on("message:text", async (ctx) => {
    const draft = draftFor(ctx.chat.id);
    const next = await handleText(draft, ctx.message.text, {
      send: async (text, extra) => {
        await ctx.reply(text, extra ? { reply_markup: extra.keyboard } : {});
      },
    });
    sessions.set(ctx.chat.id, next);
  });

  console.log("Jumaboev Signs Telegram bot is polling.");
  await bot.start();
}

async function readLines(): Promise<AsyncIterator<string>> {
  const rl = createInterface({
    input,
    output,
    terminal: Boolean(input.isTTY),
    crlfDelay: Infinity,
  });
  return rl[Symbol.asyncIterator]();
}

async function playTurns(script?: string[]) {
  console.log("");
  console.log("TELEGRAM_BOT_TOKEN is unset — mock Telegram conversation.");
  console.log("Type like a driver. Buttons are shown as [n] labels.");
  console.log("Commands: /start  /help  /quit");
  if (script) console.log("Running --demo scripted order.");
  console.log("");

  let draft = newDraft();
  let lastButtons: Button[] = [];
  const chat: Chat = {
    send: (text, extra) => {
      console.log(`\nbot: ${text}`);
      lastButtons = extra?.buttons ?? [];
      lastButtons.forEach((button, index) => {
        console.log(`  [${index + 1}] ${button.label}`);
      });
    },
  };

  await handleText(draft, "/start", chat);

  const iterator = script
    ? script[Symbol.iterator]()
    : await readLines();

  while (true) {
    let line: string | undefined;
    if (script) {
      const next = (iterator as Iterator<string>).next();
      if (next.done) break;
      line = next.value;
      console.log(`you> ${line}`);
    } else {
      process.stdout.write("you> ");
      const next = await (iterator as AsyncIterator<string>).next();
      if (next.done) break;
      line = next.value;
    }
    const trimmed = (line ?? "").trim();
    if (!trimmed) continue;
    if (trimmed === "/quit" || trimmed === "/exit") {
      console.log("mock session closed");
      break;
    }
    const asNumber = Number(trimmed);
    if (
      Number.isInteger(asNumber) &&
      asNumber >= 1 &&
      asNumber <= lastButtons.length
    ) {
      const button = lastButtons[asNumber - 1];
      if (button) {
        draft = await handleCallback(draft, button.id, chat);
        continue;
      }
    }
    draft = await handleText(draft, trimmed, chat);
  }
}

async function main() {
  const shopUp = await pingShop();
  console.log(
    shopUp
      ? `Shop API is up at ${APP_URL}`
      : `Shop API at ${APP_URL} is not reachable. Confirmed tickets retry, then stay in this chat if the site is down.`,
  );

  if (TOKEN) {
    await runTelegram(TOKEN);
    return;
  }
  const demo = process.argv.includes("--demo");
  await playTurns(
    demo
      ? [
          "1",
          "elbrus_dispatch",
          "ELBRUS",
          "ELBRUS FREIGHTLINES LLC",
          "20179229",
          "796405",
          "1",
          "1",
          "1",
          "/quit",
        ]
      : undefined,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
