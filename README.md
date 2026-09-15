# Jumaboev Signs

Khurshid Jumaboev’s shop slice: **24×24 inch vinyl USDOT truck door decals** that follow FMCSA 49 CFR 390.21. Typical job is a matched pair for both cab sides — MCS-150 name, USDOT number, optional MC and logo. **Unit numbers are a separate small print** and do not go on the 24×24 door.

Drivers start from a **visual sample**, fill the print ticket, add the pair to the **cart**, then check the vinyl on a **white semi** at checkout.

This repo is the web designer plus a Telegram bot. Instagram is out of scope for this slice. Telegram is the main customer channel.

## What you can do

- Browse samples, open the print desk, and keep a live door on screen on a phone.
- Fill required lettering, colors, and layout. Add the pair to the cart.
- Open the cart, then checkout to see the logo on a full-size white semi before sending it to the shop.
- Run the same questions in Telegram in English, Uzbek, Tajik, Russian, Kazakh, Kyrgyz, or Ukrainian.

## Web app

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147). The app binds on `0.0.0.0:43147`.

- `/` — shop landing
- `/samples` — door samples
- `/order` — live designer (`/order?sample=elbrus` loads a look)
- `/cart` — shopping cart
- `/checkout` — white Cascadia sleeper-door preview and send to the shop
- `/orders` — tickets from this server and this browser

There is no database and no login. Restarting the Next.js process clears the in-memory shop list; local browser copies and the cart remain.

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
