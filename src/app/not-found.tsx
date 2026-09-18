"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { uiT } from "@/lib/shop-copy";
import { useShopLang } from "@/lib/shop-lang";

export default function NotFound() {
  const lang = useShopLang();
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold text-[var(--navy)]">
        {uiT(lang, "pageNotInShop")}
      </h1>
      <p className="mt-2 text-muted-foreground">{uiT(lang, "pageNotInShopLead")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/samples">{uiT(lang, "samplesKicker")}</Link>
        </Button>
        <Button asChild>
          <Link href="/order">{uiT(lang, "printDesk")}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/cart">{uiT(lang, "cartNav")}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">{uiT(lang, "home")}</Link>
        </Button>
      </div>
    </main>
  );
}
