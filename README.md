# Jumaboev Signs

Khurshid Jumaboev’s shop slice: **24×24 inch vinyl USDOT truck door decals** that follow FMCSA 49 CFR 390.21. Typical job is a matched pair for both cab sides — MCS-150 name, USDOT number, optional MC/fleet/logo.

Drivers start from a **visual sample** (Elbrus, USDOT-only, Gold plates, Red line), put their numbers on it, and set **how large the logo prints** on the vinyl.

This repo is the web designer plus a Telegram bot. Instagram is out of scope for this slice. Telegram is the main customer channel.

## What you can do

- Land on the shop, tap a sample door, and open the print desk with that layout loaded.
- Type lettering and recut colors while a live 24×24 preview updates.
- Upload a logo and choose size: Small, Medium, Large, Extra large, or Full face.
- Place the order. A shop handle is asked only at submit (no password). Tickets sit in memory on the server while it is running, and a copy stays in the browser.
- Run the same questions in Telegram in English, Uzbek, Tajik, Russian, Kazakh, Kyrgyz, or Ukrainian.

## Web app

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147). The app binds on `0.0.0.0:43147`.

- `/` — shop landing and sample doors
- `/order` — live designer (`/order?sample=elbrus` loads a sample)
- `/orders` — tickets from this server and this browser

There is no database and no login. Restarting the Next.js process clears the in-memory shop list; local browser copies remain.

## Telegram bot

```bash
npm run bot
```

If `TELEGRAM_BOT_TOKEN` is **unset**, the command starts a **mock chat in the terminal**. Pick a language with `1`, `2`, … then answer like a driver. `/start` resets, `/quit` exits. `npm run bot:demo` walks an ELBRUS sample order without typing.

To talk to real Telegram:

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy the token.
2. Copy `.env.example` to `.env` and set:

```bash
TELEGRAM_BOT_TOKEN=your-bot-token
APP_URL=http://127.0.0.1:43147
```

3. Keep `npm run dev` running so confirmed tickets can POST to `/api/orders`.
4. Run `npm run bot` in a second terminal.

The mock path is the default. Missing credentials never block local work.

## Print layout

The live sign starts from the physical ELBRUS pair and prints **USDOT** (not `DOT:`) per 390.21. MCS-150 name is required; MC is optional. Recolor face, name, plates, and borders in the designer. Logo size is a 1–5 scale on the 24×24 face. Sample numbers: USDOT `20179229`, MC `796405`.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui. The bot is [grammY](https://grammy.dev/) via `tsx`.
