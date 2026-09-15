# Jumaboev Signs

Khurshid Jumaboev’s first shop slice: **24×24 inch vinyl US DOT truck door decals**. Typical job is a matched pair — company name, legal name, DOT, MC, optional fleet number and logo — in the gold-and-navy door layout used on prints like ELBRUS / ELBRUS FREIGHTLINES LLC.

This repo is the web designer plus a Telegram bot. Instagram is out of scope for this slice. Telegram is the main customer channel.

## What you can do

- Land on the shop site, read the real print offer, and open the door designer.
- Create a username (no password). It only tags the ticket.
- Type lettering and watch a live 24×24 preview (forest-green serif name, gold/red rules, navy DOT/MC plates, gold chevrons).
- Upload an optional logo. Empty, loading, and error states are wired on the designer and the order list.
- Place the order. Tickets sit in memory on the server while it is running, and a copy stays in the browser.
- Run the same questions in Telegram in English, Uzbek, Tajik, Russian, Kazakh, Kyrgyz, or Ukrainian.

## Web app

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147). The app binds on `0.0.0.0:43147`.

- `/` — shop landing and ELBRUS sample pair
- `/order` — username + live designer
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

The live sign follows the physical ELBRUS pair: gold outer border, navy inner border, large forest-green serif company name, legal line in navy, gold/red underlines, navy plates for `DOT:` and `MC:`, optional `FLEET:`, and three gold/red chevrons at the bottom. Default sample numbers are DOT `20179229` and MC `796405`.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui. The bot is [grammY](https://grammy.dev/) via `tsx`.
