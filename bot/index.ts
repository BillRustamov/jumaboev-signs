import { createInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Bot, InlineKeyboard, type Context } from "grammy";
import {
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
  type ShopService,
  type SignFields,
  type SignOrder,
} from "../src/lib/order";
import {
  PRINT_FILE_MAX_BYTES,
  canPreviewAsImage,
  isPrintFile,
  resolvePrintMime,
  telegramPrintUsername,
} from "../src/lib/print-file";
import { shopT } from "../src/lib/shop-entry";
import { STYLE_PRESETS, applyPreset } from "../src/lib/sign-style";
import { screenshotTruck, styledFields, telegramSendPhoto } from "./previews";
import { formatPlace, parsePlace } from "../src/lib/design/migrate";

type Step =
  | "menu"
  | "lang"
  | "print_file"
  | "print_notes"
  | "print_confirm"
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
  service?: ShopService;
  printFileName?: string;
  printMime?: string;
  printExact?: boolean;
  printNotes?: string;
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

function serviceKeyboard(lang: Lang) {
  return keyboardFrom(
    [
      { id: "service:print", label: shopT(lang, "printExisting") },
      { id: "service:design", label: shopT(lang, "createDesign") },
      { id: "service:orders", label: shopT(lang, "myOrders") },
      { id: "service:contact", label: shopT(lang, "contactShop") },
      { id: "service:lang", label: shopT(lang, "language") },
    ],
    1,
  );
}

function printModeKeyboard(lang: Lang) {
  return keyboardFrom(
    [
      { id: "print:exact", label: shopT(lang, "printOnlyExact") },
      { id: "print:notes", label: shopT(lang, "printOnlyNotes") },
      { id: "service:menu", label: shopT(lang, "backToMenu") },
    ],
    1,
  );
}

function menuKeyboard(lang: Lang) {
  return keyboardFrom(
    [{ id: "service:menu", label: shopT(lang, "backToMenu") }],
    1,
  );
}

function welcomeText(lang: Lang): string {
  return `${shopT(lang, "howCanWeHelp")}\n\n${shopT(lang, "lead")}`;
}

function newDraft(): Draft {
  return {
    lang: "en",
    step: "menu",
    fields: emptySign(),
    username: "",
    service: undefined,
  };
}

function resetToMenu(draft: Draft): Draft {
  const next = newDraft();
  next.lang = draft.lang;
  next.telegramChatId = draft.telegramChatId;
  return next;
}

async function presentMenu(draft: Draft, chat: Chat): Promise<Draft> {
  const next = resetToMenu(draft);
  await chat.send(welcomeText(next.lang), serviceKeyboard(next.lang));
  return next;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function summary(draft: Draft): string {
  const mc = draft.fields.mcNumber || "—";
  const body = t(draft.lang, "confirmBody", {
    username: draft.username,
    company: draft.fields.companyName,
    legal: formatPlace(draft.fields.city, draft.fields.state) || "—",
    dot: draft.fields.dotNumber,
    mc,
    logo: draft.fields.logoDataUrl ? "yes" : "—",
    style: draft.fields.paletteId,
  });
  return `<b>${escapeHtml(t(draft.lang, "confirmTitle"))}</b>\n\n${escapeHtml(body)}`;
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
  const printOnly = draft.service === "PRINT_ONLY";
  const order: SignOrder = {
    ...draft.fields,
    id: createOrderId(),
    username: printOnly
      ? telegramPrintUsername(draft.telegramChatId ?? 0)
      : draft.username,
    source: "telegram",
    language: draft.lang,
    telegramChatId: draft.telegramChatId,
    createdAt: new Date().toISOString(),
    status: "received",
    service: printOnly ? "PRINT_ONLY" : "CUSTOM_DESIGN",
    printExact: printOnly ? draft.printExact !== false : undefined,
    printNotes: printOnly ? draft.printNotes : undefined,
    originalFileName: printOnly ? draft.printFileName : undefined,
    originalMime: printOnly ? draft.printMime : undefined,
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
  sendPhoto?: (image: Buffer, caption: string) => Promise<void> | void;
};

async function presentStyles(draft: Draft, chat: Chat): Promise<void> {
  draft.step = "style";
  await chat.send(t(draft.lang, "askStylePhotos"));
  try {
    const sendPhoto = chat.sendPhoto;
    if (sendPhoto) {
      await Promise.race([
        (async () => {
          for (const preset of STYLE_PRESETS) {
            const png = await screenshotTruck(
              styledFields(draft.fields, preset.id),
            );
            if (png) {
              await sendPhoto(png, `${preset.label} — ${preset.hint}`);
            }
          }
        })(),
        wait(50000),
      ]);
    }
  } catch (error) {
    console.error("Could not send style photos.", error);
  }
  await chat.send(t(draft.lang, "askStyle"), styleKeyboard());
}

async function presentConfirm(draft: Draft, chat: Chat): Promise<void> {
  draft.step = "confirm";
  try {
    if (chat.sendPhoto) {
      const png = await screenshotTruck(draft.fields);
      if (png) await chat.sendPhoto(png, t(draft.lang, "confirmTitle"));
    }
  } catch (error) {
    console.error("Could not send confirm photo.", error);
  }
  await chat.send(summary(draft), confirmKeyboard(draft.lang));
}

async function presentPrintConfirm(draft: Draft, chat: Chat): Promise<Draft> {
  draft.step = "print_confirm";
  const mode =
    draft.printExact === false
      ? shopT(draft.lang, "printNotesMode", {
          notes: draft.printNotes || "—",
        })
      : shopT(draft.lang, "printExactMode");
  await chat.send(
    shopT(draft.lang, "printOnlyConfirm", {
      file: draft.printFileName || "file",
      mode,
    }),
    confirmKeyboard(draft.lang),
  );
  return draft;
}

async function handleText(
  draft: Draft,
  text: string,
  chat: Chat,
): Promise<Draft> {
  const trimmed = text.trim();
  if (trimmed === "/start") {
    return presentMenu(draft, chat);
  }
  if (trimmed === "/help") {
    await chat.send(shopT(draft.lang, "helpMenu"), menuKeyboard(draft.lang));
    return draft;
  }

  switch (draft.step) {
    case "menu": {
      await chat.send(welcomeText(draft.lang), serviceKeyboard(draft.lang));
      return draft;
    }
    case "lang": {
      await chat.send(shopT(draft.lang, "chooseLanguage"), languageKeyboard());
      return draft;
    }
    case "print_file": {
      await chat.send(shopT(draft.lang, "printOnlyAsk"));
      return draft;
    }
    case "print_notes": {
      if (!trimmed) {
        await chat.send(
          shopT(draft.lang, "printOnlyGot"),
          printModeKeyboard(draft.lang),
        );
        return draft;
      }
      draft.printExact = false;
      draft.printNotes = trimmed;
      return presentPrintConfirm(draft, chat);
    }
    case "print_confirm": {
      return presentPrintConfirm(draft, chat);
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
      if (isSkipText(trimmed, draft.lang)) {
        draft.fields.city = "";
        draft.fields.state = "";
        draft.fields.legalName = "";
      } else {
        const parsed = parsePlace(trimmed);
        draft.fields.city = parsed?.city ?? trimmed;
        draft.fields.state = parsed?.state ?? "";
        draft.fields.legalName = "";
      }
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
      await chat.send(t(draft.lang, "askMc"));
      return draft;
    }
    case "mc": {
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
        await presentStyles(draft, chat);
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
      await presentStyles(draft, chat);
      return draft;
    }
    case "style": {
      await presentStyles(draft, chat);
      return draft;
    }
    case "confirm": {
      await presentConfirm(draft, chat);
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
    await chat.send(shopT(draft.lang, "languageSet"));
    return presentMenu(draft, chat);
  }
  if (data === "service:menu") {
    return presentMenu(draft, chat);
  }
  if (data === "service:lang") {
    draft.step = "lang";
    await chat.send(shopT(draft.lang, "chooseLanguage"), languageKeyboard());
    return draft;
  }
  if (data === "service:orders") {
    await chat.send(shopT(draft.lang, "ordersBody"), menuKeyboard(draft.lang));
    return draft;
  }
  if (data === "service:contact") {
    await chat.send(shopT(draft.lang, "contactBody"), menuKeyboard(draft.lang));
    return draft;
  }
  if (data === "service:print") {
    draft.service = "PRINT_ONLY";
    draft.step = "print_file";
    draft.fields = emptySign();
    draft.printFileName = undefined;
    draft.printMime = undefined;
    draft.printNotes = undefined;
    draft.printExact = true;
    await chat.send(shopT(draft.lang, "printOnlyAsk"), menuKeyboard(draft.lang));
    return draft;
  }
  if (data === "service:design") {
    draft.service = "CUSTOM_DESIGN";
    draft.step = "username";
    draft.fields = emptySign();
    await chat.send(t(draft.lang, "askUsername"));
    return draft;
  }
  if (data === "print:exact") {
    draft.printExact = true;
    draft.printNotes = undefined;
    return presentPrintConfirm(draft, chat);
  }
  if (data === "print:notes") {
    draft.step = "print_notes";
    draft.printExact = false;
    await chat.send(shopT(draft.lang, "printOnlyNotes"));
    return draft;
  }
  if (data === "skip" && draft.step === "legal") {
    draft.fields.legalName = "";
    draft.fields.city = "";
    draft.fields.state = "";
    draft.step = "dot";
    await chat.send(t(draft.lang, "askDot"));
    return draft;
  }
  if (data === "skip" && draft.step === "logo") {
    await presentStyles(draft, chat);
    return draft;
  }
  if (data.startsWith("style:")) {
    const preset = applyPreset(data.slice(6));
    draft.fields = {
      ...draft.fields,
      ...preset,
      showMc: true,
    };
    await presentConfirm(draft, chat);
    return draft;
  }
  if (data === "restart") {
    await chat.send(t(draft.lang, "cancelled"));
    return presentMenu(draft, chat);
  }
  if (
    data === "confirm" &&
    (draft.step === "confirm" || draft.step === "print_confirm")
  ) {
    const { order, shopOk } = await postOrder(draft);
    if (draft.step === "print_confirm") {
      await chat.send(shopT(draft.lang, "printOnlyPlaced", { id: order.id }));
    } else {
      await chat.send(t(draft.lang, "placed", { id: order.id }));
    }
    await chat.send(
      shopOk ? t(draft.lang, "shopPosted") : t(draft.lang, "shopUnreachable"),
    );
    return presentMenu(draft, chat);
  }
  return draft;
}

async function telegramFileToDataUrl(
  ctx: Context,
  fileId: string,
  token: string,
): Promise<string> {
  const file = await ctx.api.getFile(fileId);
  if (!file.file_path) return "";
  const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
  const response = await fetch(url);
  const buf = Buffer.from(await response.arrayBuffer());
  const headerType = response.headers.get("content-type") || "";
  const fromPath = file.file_path.toLowerCase();
  const resolved =
    resolvePrintMime(headerType.split(";")[0], fromPath) ??
    (headerType.startsWith("image/")
      ? headerType.split(";")[0]
      : fromPath.endsWith(".png")
        ? "image/png"
        : fromPath.endsWith(".webp")
          ? "image/webp"
          : fromPath.endsWith(".gif")
            ? "image/gif"
            : fromPath.endsWith(".pdf")
              ? "application/pdf"
              : fromPath.endsWith(".svg")
                ? "image/svg+xml"
                : "image/jpeg");
  return `data:${resolved};base64,${buf.toString("base64")}`;
}

const IMAGE_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

function isImageDocument(
  mimeType: string | undefined,
  fileName: string | undefined,
): boolean {
  if (mimeType && IMAGE_MIMES.has(mimeType.toLowerCase())) return true;
  if (fileName && /\.(png|jpe?g|webp|gif)$/i.test(fileName)) return true;
  return false;
}

async function configureBot(bot: Bot) {
  await bot.api.setMyName("Jumaboev Signs");
  await bot.api.setMyShortDescription(
    "USDOT truck door vinyl · 20 × 12 in each cab side. Order a matched pair.",
  );
  await bot.api.setMyDescription(
    "Jumaboev Signs prints vinyl USDOT truck doors. Example cut is 20 × 12 in for each cab side. Tap Start for the shop menu: print a file you already have, or create a new design. Company name and USDOT required by FMCSA on custom designs; MC required on that shop ticket. Logo optional. Unit numbers are a separate small print.",
  );
  await bot.api.setMyCommands([
    { command: "start", description: "Open the shop menu" },
    { command: "help", description: "How Jumaboev Signs works" },
  ]);
}

function sessionPath() {
  return path.join(process.cwd(), "data", "bot-sessions.json");
}

function loadSessions(): Map<number, Draft> {
  try {
    const file = sessionPath();
    if (!existsSync(file)) return new Map();
    const raw = JSON.parse(readFileSync(file, "utf8")) as Record<string, Draft>;
    const map = new Map<number, Draft>();
    for (const [key, draft] of Object.entries(raw)) {
      const id = Number(key);
      if (!Number.isFinite(id) || !draft || typeof draft !== "object") continue;
      const merged: Draft = {
        ...newDraft(),
        ...draft,
        fields: { ...emptySign(), ...draft.fields },
      };
      if (merged.step === "lang" && !merged.service) merged.step = "menu";
      map.set(id, merged);
    }
    return map;
  } catch {
    return new Map();
  }
}

function persistSessions(sessions: Map<number, Draft>) {
  try {
    mkdirSync(path.dirname(sessionPath()), { recursive: true });
    writeFileSync(
      sessionPath(),
      JSON.stringify(Object.fromEntries(sessions)),
    );
  } catch (error) {
    console.error("Could not save bot sessions.", error);
  }
}

async function runTelegram(token: string) {
  const bot = new Bot(token);
  const sessions = loadSessions();

  function remember(id: number, draft: Draft) {
    sessions.set(id, draft);
    persistSessions(sessions);
  }

  // /start must not wait behind cab screenshots (25s) or style photos (50s).
  // grammY's built-in runner handles one update at a time; detach the heavy
  // paths so the next getUpdates can run while Chrome works.
  bot.use(async (ctx, next) => {
    const text = ctx.message?.text?.trim() ?? "";
    const isStart = /^\/start(?:@\w+)?(?:\s|$)/i.test(text);
    if (isStart) {
      await next();
      return;
    }
    void next().catch((error) => {
      console.error("Background Telegram update failed.", error);
    });
  });

  function draftFor(id: number): Draft {
    const existing = sessions.get(id);
    if (existing) return existing;
    const created = newDraft();
    created.telegramChatId = id;
    remember(id, created);
    return created;
  }

  async function sendWelcomeMenu(ctx: Context, lang: Lang): Promise<void> {
    const markup = serviceKeyboard(lang).keyboard;
    const text = welcomeText(lang);
    const chatId = ctx.chat?.id;
    const started = Date.now();
    const send = async () => {
      if (!chatId) {
        await ctx.reply(text, { reply_markup: markup });
        return;
      }
      const sent = await ctx.api.sendMessage(chatId, text, {
        reply_markup: markup,
      });
      console.log(
        `shop menu ${sent.message_id} to ${chatId} in ${Date.now() - started}ms`,
      );
    };
    try {
      await withTimeout(send(), 4_000, "sendMessage /start");
      return;
    } catch (error) {
      console.error("Could not send /start shop menu.", error);
    }
    if (!chatId) return;
    await withTimeout(
      ctx.api.sendMessage(chatId, text, { reply_markup: markup }),
      4_000,
      "sendMessage /start retry",
    );
    console.log(`shop menu retry to ${chatId} in ${Date.now() - started}ms`);
  }

  bot.command("start", async (ctx) => {
    const chatId = ctx.chat.id;
    console.log(`/start from chat ${chatId}`);
    const existing = sessions.get(chatId);
    const draft = newDraft();
    draft.telegramChatId = chatId;
    if (existing?.lang) draft.lang = existing.lang;
    await sendWelcomeMenu(ctx, draft.lang);
    remember(chatId, draft);
  });

  bot.command("help", async (ctx) => {
    const draft = draftFor(ctx.chat.id);
    await ctx.reply(shopT(draft.lang, "helpMenu"), {
      reply_markup: menuKeyboard(draft.lang).keyboard,
    });
  });

  bot.on("callback_query:data", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    const draft = draftFor(chatId);
    await ctx.answerCallbackQuery();
    const next = await handleCallback(draft, ctx.callbackQuery.data, {
      send: async (text, extra) => {
        await ctx.reply(text, extra ? { parse_mode: "HTML", reply_markup: extra.keyboard } : { parse_mode: "HTML" });
      },
      sendPhoto: async (image, caption) => {
        await telegramSendPhoto(ctx, image, caption);
      },
    });
    remember(chatId, next);
  });

  function telegramChatFor(ctx: Context): Chat {
    return {
      send: async (text, extra) => {
        await ctx.reply(
          text,
          extra
            ? { parse_mode: "HTML", reply_markup: extra.keyboard }
            : { parse_mode: "HTML" },
        );
      },
      sendPhoto: async (image, caption) => {
        await telegramSendPhoto(ctx, image, caption);
      },
    };
  }

  async function ingestLogo(
    ctx: Context,
    draft: Draft,
    fileId: string,
  ): Promise<void> {
    await ctx.reply(t(draft.lang, "gotLogo"), { parse_mode: "HTML" });
    try {
      const dataUrl = await telegramFileToDataUrl(ctx, fileId, token);
      if (dataUrl) draft.fields.logoDataUrl = dataUrl;
    } catch (error) {
      console.error("Could not download logo.", error);
      await ctx.reply(t(draft.lang, "badLogo"), {
        parse_mode: "HTML",
        reply_markup: skipKeyboard(draft.lang).keyboard,
      });
      return;
    }
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    remember(chatId, draft);
    try {
      await presentStyles(draft, telegramChatFor(ctx));
    } catch (error) {
      console.error("Could not continue after logo.", error);
      await ctx.reply(t(draft.lang, "askStyle"), {
        parse_mode: "HTML",
        reply_markup: styleKeyboard().keyboard,
      });
    }
    remember(chatId, draft);
  }

  async function ingestPrintFile(
    ctx: Context,
    draft: Draft,
    fileId: string,
    fileName: string,
    mimeHint: string | undefined,
    fileSize: number | undefined,
  ): Promise<void> {
    if (fileSize && fileSize > PRINT_FILE_MAX_BYTES) {
      await ctx.reply(shopT(draft.lang, "printOnlyBad"));
      return;
    }
    try {
      const dataUrl = await telegramFileToDataUrl(ctx, fileId, token);
      const parsedMime =
        resolvePrintMime(mimeHint, fileName) ??
        resolvePrintMime(dataUrl.split(";")[0]?.replace("data:", ""), fileName);
      if (!dataUrl || !parsedMime || !isPrintFile(parsedMime, fileName)) {
        await ctx.reply(shopT(draft.lang, "printOnlyBad"));
        return;
      }
      if (!canPreviewAsImage(parsedMime)) {
        // Keep the original bytes. Never send SVG/PDF back as a live preview.
      }
      draft.fields.originalArtworkUrl = dataUrl;
      draft.printFileName = fileName || `file.${parsedMime.split("/")[1]}`;
      draft.printMime = parsedMime;
      draft.step = "print_notes";
      const chatId = ctx.chat?.id;
      if (chatId) remember(chatId, draft);
      await ctx.reply(shopT(draft.lang, "printOnlyGot"), {
        reply_markup: printModeKeyboard(draft.lang).keyboard,
      });
    } catch (error) {
      console.error("Could not download print file.", error);
      await ctx.reply(shopT(draft.lang, "printOnlyBad"));
    }
  }

  bot.on("message:photo", async (ctx) => {
    const draft = draftFor(ctx.chat.id);
    const photo = ctx.message.photo.at(-1);
    if (draft.step === "print_file") {
      if (!photo) {
        await ctx.reply(shopT(draft.lang, "printOnlyBad"));
        return;
      }
      await ingestPrintFile(
        ctx,
        draft,
        photo.file_id,
        "door.png",
        "image/jpeg",
        photo.file_size,
      );
      return;
    }
    if (draft.step !== "logo") {
      await ctx.reply(t(draft.lang, "logoWrongStep"), { parse_mode: "HTML" });
      return;
    }
    if (!photo) {
      await ctx.reply(t(draft.lang, "badLogo"), {
        parse_mode: "HTML",
        reply_markup: skipKeyboard(draft.lang).keyboard,
      });
      return;
    }
    await ingestLogo(ctx, draft, photo.file_id);
  });

  bot.on("message:document", async (ctx) => {
    const draft = draftFor(ctx.chat.id);
    const document = ctx.message.document;
    if (draft.step === "print_file") {
      if (
        !isPrintFile(document.mime_type, document.file_name) ||
        (document.file_size && document.file_size > PRINT_FILE_MAX_BYTES)
      ) {
        await ctx.reply(shopT(draft.lang, "printOnlyBad"));
        return;
      }
      await ingestPrintFile(
        ctx,
        draft,
        document.file_id,
        document.file_name || "upload",
        document.mime_type,
        document.file_size,
      );
      return;
    }
    if (draft.step !== "logo") {
      await ctx.reply(t(draft.lang, "logoWrongStep"), { parse_mode: "HTML" });
      return;
    }
    if (!isImageDocument(document.mime_type, document.file_name)) {
      await ctx.reply(t(draft.lang, "badLogo"), {
        parse_mode: "HTML",
        reply_markup: skipKeyboard(draft.lang).keyboard,
      });
      return;
    }
    await ingestLogo(ctx, draft, document.file_id);
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text ?? "";
    if (text.startsWith("/")) return;
    const draft = draftFor(ctx.chat.id);
    const next = await handleText(draft, text, {
      send: async (text, extra) => {
        await ctx.reply(text, extra ? { parse_mode: "HTML", reply_markup: extra.keyboard } : { parse_mode: "HTML" });
      },
      sendPhoto: async (image, caption) => {
        await telegramSendPhoto(ctx, image, caption);
      },
    });
    remember(ctx.chat.id, next);
  });

  bot.catch((error) => {
    console.error("Telegram update failed.", error);
  });

  if (process.argv.includes("--configure-profile")) {
    try {
      await configureBot(bot);
      console.log("Telegram bot profile updated.");
    } catch (error) {
      console.error("Could not update Telegram bot profile.", error);
    }
  }
  console.log("Jumaboev Signs Telegram bot is polling.");
  for (;;) {
    try {
      await bot.api.deleteWebhook({ drop_pending_updates: false });
      await bot.start({
        drop_pending_updates: false,
        allowed_updates: ["message", "callback_query"],
        // Default is 30s. A half-dead long-poll then delays /start by up to
        // that full timeout. 2s is enough for Telegram to return immediately
        // when an update arrives, and recovers a stale socket in ~2s.
        timeout: 2,
        onStart: (me) => {
          console.log(`Polling @${me.username} (${me.id})`);
        },
      });
      console.error("Telegram poller stopped; restarting.");
    } catch (error) {
      console.error("Telegram poller crashed; restarting.", error);
    }
    await delay(2500);
  }
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`${label} timed out after ${ms}ms`)),
          ms,
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
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
    sendPhoto: async (_image, caption) => {
      console.log(`\nbot photo: ${caption}`);
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
          "2",
          "elbrus_dispatch",
          "ELBRUS",
          "DALLAS, TX",
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
