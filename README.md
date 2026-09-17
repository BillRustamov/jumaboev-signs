# Jumaboev Signs

Khurshid Jumaboev’s shop slice: vinyl USDOT truck door decals that follow FMCSA 49 CFR § 390.21. The customer product is a **20 × 12 in** door (never 24×24, never 20×10). Default look is **white vinyl with black lettering** — large company name, USDOT, then MC. Dark printed plaques are an option.

FMCSA requires company name and USDOT on both sides of the power unit, readable from 50 feet, in strong contrast. There is no fixed federal letter height. **MC is not required on the truck**; this shop still prints MC on the plaque and requires it on the ticket. Logo is optional. **Unit numbers are a separate small print** and do not go on this vinyl.

Drivers start from a visual sample, fill the print ticket, add the pair to the cart, then check the vinyl on a white Volvo sleeper at checkout. Click any door sign to preview it larger.

This repo is the web designer plus a Telegram bot. Instagram is out of scope for this slice. Telegram is the main customer channel.

## What you can do

- Browse samples, open the print desk, and keep a live door on screen on a phone.
- Fill required lettering, colors, and layout. Click the live door to preview. Add the pair to the cart.
- Open the cart, click a sign to preview, then checkout to see the vinyl on a white sleeper before sending it to the shop.
- Run the same questions in Telegram in English, Uzbek, Tajik, Russian, Kazakh, Kyrgyz, or Ukrainian. Color picks send photos of the filled plaque on a white cab. Confirmed tickets POST to the shop list.

## Web app

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147). The app binds on `0.0.0.0:43147`.

- `/` — shop landing, 20 × 12 in sizes, and FMCSA table
- `/samples` — sign-first gallery with categories and filters; Customize this design opens the print desk
- `/order` — live designer (`/order?sample=clean-white` loads the default plaque)
- `/preview/signs` — five template compositions at print proportion (visual QA)
- `/preview/truck` — cab-door mockup (sign close-up vs on the door)
- `/cart` — shopping cart (click the sign to preview)
- `/checkout` — white sleeper-door preview and send to the shop
- `/orders` — tickets from this server and this browser
- `/admin` — shop print desk. Download a 24 in roll sheet with two **20 × 12 in** plaques, left then right. `/admin/print/sample` opens a sample sheet without an order.
- `/api/health` — `{ ok: true }` for the Telegram bot to ping
- `/api/orders` — GET the shop list, POST a confirmed ticket

Tickets persist in `data/orders.json` so a restart does not wipe the print desk. That file is gitignored. There is no login.

## Telegram bot

```bash
npm run bot
```

If `TELEGRAM_BOT_TOKEN` is **unset**, the command starts a **mock chat in the terminal**. Pick a language with `1`, `2`, … then answer like a driver. Type `Skip` on optional fields (city and state, logo) instead of tapping the button. MC is required. `/start` resets, `/quit` exits. `npm run bot:demo` walks a sample order without typing and POSTs it to `/api/orders` when the site is up.

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

The customer sample is a 20 × 12 in filled plaque: logo box, company name, a rule, city and state, then `USDOT` plus the digits, then `MC` plus the digits. Company name is required; USDOT is required; MC is required on the shop ticket even though 390.21 does not require it on the truck. Recolor face, name, and number lines in the designer. Logo size is a 1–5 scale on the vinyl. Navy-gold example: USDOT `3311300`, MC `1051891`.

Admin download: two **20 × 12 in** doors laid out along a **24 in** roll (about 26.5 in long). Artwork is never squashed to 20×10. In the print dialog set 100% scale and turn off “fit to page”. Never tell customers the sheet is 24×24.

`npm run test` checks the shared design engine (logo scale, fonts, chevrons, templates, city/state migration). `npm run bot:profile` is the only command that calls Telegram setMyName / setMyDescription — not on every bot start.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui. The bot is [grammY](https://grammy.dev/) via `tsx`.
