"use client";

import Link from "next/link";
import { FileUp, MessageCircle, Palette } from "lucide-react";
import { ShopLangSwitch } from "@/components/shop-lang-switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { shopT } from "@/lib/shop-entry";
import { useShopLang } from "@/lib/shop-lang";
import { TELEGRAM_BOT_URL } from "@/lib/telegram";

export function HomeEntry() {
  const lang = useShopLang();

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
        Jumaboev Signs
      </p>
      <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-[var(--navy)] sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
        {shopT(lang, "howCanWeHelp")}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
        {shopT(lang, "lead")}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/print"
          className="group rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Card className="h-full border-2 border-[var(--navy)]/15 transition-colors group-hover:border-[var(--navy)]">
            <CardHeader>
              <CardTitle className="flex items-start gap-3 text-xl text-[var(--navy)]">
                <span className="mt-0.5 rounded-lg bg-[var(--navy)] p-2 text-white">
                  <FileUp className="size-5" />
                </span>
                {shopT(lang, "printExisting")}
              </CardTitle>
              <CardDescription className="text-base leading-6">
                {shopT(lang, "printExistingHint")}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href="/order"
          className="group rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Card className="h-full border-2 border-[var(--gold)]/40 bg-[color-mix(in_oklch,var(--gold),white_88%)] transition-colors group-hover:border-[var(--gold)]">
            <CardHeader>
              <CardTitle className="flex items-start gap-3 text-xl text-[var(--navy)]">
                <span className="mt-0.5 rounded-lg bg-[var(--gold)] p-2 text-[var(--navy)]">
                  <Palette className="size-5" />
                </span>
                {shopT(lang, "createDesign")}
              </CardTitle>
              <CardDescription className="text-base leading-6">
                {shopT(lang, "createDesignHint")}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button variant="outline" asChild>
          <Link href="/orders">{shopT(lang, "myOrders")}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">{shopT(lang, "contactShop")}</Link>
        </Button>
        <ShopLangSwitch variant="outline" />
        <Button variant="ghost" asChild>
          <a href={TELEGRAM_BOT_URL} target="_blank" rel="noreferrer">
            <MessageCircle className="size-4" />
            Telegram
          </a>
        </Button>
      </div>
    </div>
  );
}
