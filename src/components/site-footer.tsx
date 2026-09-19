"use client";

import Link from "next/link";
import { shopT } from "@/lib/shop-entry";
import { useShopLang } from "@/lib/shop-lang";
import { TELEGRAM_BOT_URL } from "@/lib/telegram";

export function SiteFooter() {
  const lang = useShopLang();

  return (
    <footer className="mt-auto border-t bg-[var(--navy)] text-white print:hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-heading text-sm font-semibold tracking-wide">
            usprint
          </p>
          <p className="mt-1 max-w-sm text-sm text-white/75">
            {shopT(lang, "lead")}
          </p>
        </div>
        <div className="text-sm text-white/80">
          <p>
            <Link className="underline-offset-4 hover:underline" href="/print">
              {shopT(lang, "printExisting")}
            </Link>
          </p>
          <p className="mt-1">
            <Link className="underline-offset-4 hover:underline" href="/order">
              {shopT(lang, "createDesign")}
            </Link>
          </p>
          <p className="mt-1">
            <Link className="underline-offset-4 hover:underline" href="/orders">
              {shopT(lang, "myOrders")}
            </Link>
          </p>
          <p className="mt-1">
            <Link className="underline-offset-4 hover:underline" href="/contact">
              {shopT(lang, "contactShop")}
            </Link>
          </p>
          <p className="mt-1">
            <a
              className="underline-offset-4 hover:underline"
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noreferrer"
            >
              Telegram
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
