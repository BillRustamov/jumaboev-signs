# Jumaboev Signs

Khurshid Jumaboev’s shop slice: vinyl USDOT truck door decals that follow FMCSA 49 CFR § 390.21. The customer product is a **20 × 12 in** door (never 24×24, never 20×10). Default look is **white vinyl with black lettering** — large company name, USDOT, then MC. Dark printed plaques are an option.

FMCSA requires company name and USDOT on both sides of the power unit, readable from 50 feet, in strong contrast. There is no fixed federal letter height. **MC is not required on the truck**; this shop still prints MC on the plaque and requires it on the ticket. Logo is optional. **Unit numbers are a separate small print** and do not go on this vinyl.

The first screen asks **How can we help you today?** — print a file you already have, or create a new USDOT door. Custom designs still start from a sample, fill the ticket, add the pair to the cart, then check the vinyl on a white sleeper. Print-existing uploads skip the designer.

This repo is the web shop plus a Telegram bot. Instagram is out of scope for this slice. Telegram is the main customer channel. Mini App needs HTTPS; this environment stays bot + website.

## What you can do

- Pick a service on the homepage: **I already have a design** (`/print`) or **Create a new design** (`/order`).
- Upload PDF, SVG, PNG, JPEG, or WebP for print-existing. The shop keeps the original and does not run it. Default is 20 × 12 in, one pair.
- Browse samples, open the designer, and keep a live door on screen on a phone.
- Fill required lettering, colors, and layout. Click the live door to preview. Add the pair to the cart.
- Open the cart, click a sign to preview, then checkout to see the vinyl on a white sleeper before sending it to the shop.
- Use the same two services in Telegram. The Start **button** opens the shop menu — customers do not type commands. English, Uzbek, Tajik, Russian, Kazakh, Kyrgyz, and Ukrainian.

## Web app

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147). The app binds on `0.0.0.0:43147`.

Live shop: [https://www.usprint.app](https://www.usprint.app) (Cloudflare Worker + OpenNext). Apex `usprint.app` redirects to `www`. Tickets on the live origin persist in Cloudflare D1 (`jumaboev-shop`). Local `npm run dev` still uses `data/shop.sqlite`.

- `/` — two-service shop menu (print existing vs create new), samples, FMCSA table
- `/print` — print-existing upload (file first, then username and exact/notes)
- `/contact` — how to reach Khurshid
- `/samples` — sign-first gallery with categories and filters; Customize this design opens the designer
- `/order` — live designer (`/order?sample=clean-white` loads the default plaque)
- `/preview/signs` — five template compositions at print proportion (visual QA)
- `/preview/truck` — cab-door mockup with a calibrated door zone (`?calibrate=1` in development)
- `/cart` — shopping cart (click the sign to preview)
- `/checkout` — white sleeper-door preview and send to the shop
- `/orders` — tickets from this server and this browser
- `/admin` — shop print desk. Download a 24 in roll sheet with two **20 × 12 in** plaques, left then right. `/admin/print/sample` opens a sample sheet without an order.
- `/api/health` — `{ ok: true }` for the Telegram bot to ping
- `/api/orders` — GET the shop list, POST a confirmed ticket

Tickets persist in SQLite at `data/shop.sqlite`. The first open migrates `data/orders.json` after a dated backup (`data/orders.json.bak-2026-09-18`). New writes also snapshot `data/orders.snapshot.json`. Those files are gitignored. There is no login.

Each ticket has a **production** status and a separate **payment** status. Ready for payment needs an approved price in cents (never a fake $0). The customer pay page is `/orders/[id]/pay?token=…` with a hashed token. Admin cannot mark a ticket paid.

Website `/orders`, `/admin`, the pay page, and Telegram **My orders** read the same SQLite row. They poll or refetch; a stale browser copy cannot invent `PAID`. Telegram is notified when payment actually changes (pending / paid / failed / unpaid / refunded) using that stored status.

Card checkout is Stripe Checkout in **test mode only**. The amount comes from the approved ticket on the server. Live keys (`sk_live` / `rk_live`) are refused. If `STRIPE_SECRET_KEY` is unset, the pay page stays honest and disabled — the ticket stays unpaid. `PAID` is set only by `POST /api/stripe/webhook` after signature verification and an amount match. The Stripe success URL (`/orders/[id]/pay/return`) never writes payment status.

## Telegram bot

```bash
npm run bot
```

If `TELEGRAM_BOT_TOKEN` is **unset**, the command starts a **mock chat in the terminal**. The first screen is the shop menu. Type `2` for Create a new design, then answer like a driver. Type `Skip` on optional fields (city and state, logo) instead of tapping the button. MC is required on custom designs. `/start` (internal) resets to the menu, `/quit` exits. `npm run bot:demo` walks a sample custom-design order without typing and POSTs it to `/api/orders` when the site is up.

To talk to real Telegram:

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy the token.
2. Copy `.env.example` to `.env` and set:

```bash
TELEGRAM_BOT_TOKEN=your-bot-token
APP_URL=https://www.usprint.app
TELEGRAM_SHOP_CHAT_ID=           # optional: shop ping for every ticket
STRIPE_SECRET_KEY=              # optional test key only; unset keeps checkout closed
STRIPE_WEBHOOK_SECRET=          # required to mark tickets paid
```

3. Keep `npm run dev` running so confirmed tickets can POST to `/api/orders`.
4. Run `npm run bot` in a second terminal.

The bot loads `.env` itself, pings `/api/health` on start, and retries the shop POST a few times. The mock path is the default. Missing credentials never block local work.

## Print layout

The customer sample is a 20 × 12 in filled plaque: logo box, company name, a rule, city and state, then `USDOT` plus the digits, then `MC` plus the digits. Company name is required; USDOT is required; MC is required on the shop ticket even though 390.21 does not require it on the truck. Recolor face, name, and number lines in the designer. Logo size is a 1–5 scale on the vinyl. Navy-gold example: USDOT `3311300`, MC `1051891`.

Admin download: two **20 × 12 in** doors laid out along a **24 in** roll (about 26.5 in long). Artwork is never squashed to 20×10. In the print dialog set 100% scale and turn off “fit to page”. Never tell customers the sheet is 24×24.

`npm run test` checks the shared design engine (logo scale, fonts, chevrons, templates, city/state migration). `npm run bot:profile` is the only command that calls Telegram setMyName / setMyDescription — not on every bot start.

## Cloudflare

The shop deploys as a Worker (`jumaboev-signs`) on `www.usprint.app`.

```bash
npm install
npx wrangler d1 migrations apply jumaboev-shop --remote
npm run deploy
```

Set `TELEGRAM_BOT_TOKEN` (and optional `TELEGRAM_SHOP_CHAT_ID`) with `npx wrangler secret put`. Do not put live Stripe keys. Zone SSL should be Full (strict) with Always Use HTTPS. Telegram `APP_URL` must be `https://www.usprint.app` so Mini App and pay links leave localhost. The bot itself still polls (`npm run bot`); it does not run on the Worker.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui. The bot is [grammY](https://grammy.dev/) via `tsx`. Live hosting is Cloudflare Workers via `@opennextjs/cloudflare`.
