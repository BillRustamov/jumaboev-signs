# Jumaboev Signs

Khurshid Jumaboev’s shop slice: vinyl USDOT truck door decals that follow FMCSA 49 CFR 390.21. Each item is approximately **10×20 in for each side of the cab** — MCS-150 name, USDOT number, and MC (FMCSA) required; logo optional. **Unit numbers are a separate small print** and do not go on this vinyl.

Drivers start from a visual sample, fill the print ticket, add the pair to the cart, then check the vinyl on a white semi at checkout. Click any door sign to preview it larger.

This repo is the web designer plus a Telegram bot. Instagram is out of scope for this slice. Telegram is the main customer channel.

## What you can do

- Browse samples, open the print desk, and keep a live door on screen on a phone.
- Fill required lettering, colors, and layout. Click the live door to preview. Add the pair to the cart.
- Open the cart, click a sign to preview, then checkout to see the logo on a white Cascadia sleeper before sending it to the shop.
- Run the same questions in Telegram in English, Uzbek, Tajik, Russian, Kazakh, Kyrgyz, or Ukrainian. Confirmed tickets POST to the shop list.

## Web app

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147). The app binds on `0.0.0.0:43147`.

- `/` — shop landing
- `/samples` — door samples
- `/order` — live designer (`/order?sample=elbrus` loads a look)
- `/cart` — shopping cart (click the sign to preview)
- `/checkout` — white Cascadia sleeper-door preview and send to the shop
- `/orders` — tickets from this server and this browser
- `/admin` — shop print desk. Download a cutter sheet with two ~10×20 in logos, left and right. `/admin/print/sample` opens a sample sheet without an order.
- `/api/health` — `{ ok: true }` for the Telegram bot to ping
- `/api/orders` — GET the shop list, POST a confirmed ticket

Tickets persist in `data/orders.json` so a restart does not wipe the print desk. That file is gitignored. There is no login.

## Telegram bot

```bash
npm run bot
```

If `TELEGRAM_BOT_TOKEN` is **unset**, the command starts a **mock chat in the terminal**. Pick a language with `1`, `2`, … then answer like a driver. Type `Skip` on optional fields (MC, logo) instead of tapping the button. `/start` resets, `/quit` exits. `npm run bot:demo` walks an ELBRUS sample order without typing and POSTs it to `/api/orders` when the site is up.

To talk to real Telegram:

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy the token.
2. Copy `.env.example` to `.env` and set:

```bash
TELEGRAM_BOT_TOKEN=your-bot-token
APP_URL=http://127.0.0.1:43147
TELEGRAM_SHOP_CHAT_ID=           # optional: shop ping for every ticket
```

3. Keep `npm run dev` running so confirmed tickets can POST to `/api/orders`.
4. Run `npm run bot` in a second terminal.

The bot loads `.env` itself, pings `/api/health` on start, and retries the shop POST a few times. The mock path is the default. Missing credentials never block local work.

## Print layout

The live sign starts from the physical ELBRUS pair and prints **USDOT** (not `DOT:`) per 390.21. MCS-150 name is required; MC is optional. Recolor face, name, plates, and borders in the designer. Logo size is a 1–5 scale on the vinyl. Sample numbers: USDOT `20179229`, MC `796405`.

Admin download: two doors on one sheet, each approximately **10×20 in** (left and right). In the print dialog set 100% scale and turn off “fit to page”.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui. The bot is [grammY](https://grammy.dev/) via `tsx`.
