"use client";

import Link from "next/link";
import { CartButton } from "@/components/cart-button";
import { ShopLangSwitch } from "@/components/shop-lang-switch";
import { Button } from "@/components/ui/button";
import { shopT } from "@/lib/shop-entry";
import { uiT } from "@/lib/shop-copy";
import { useAccount } from "@/lib/use-account";
import { useShopLang } from "@/lib/shop-lang";

export function SiteHeader() {
  const lang = useShopLang();
  const { user, loading } = useAccount();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur print:hidden">
      <div className="h-0.5 bg-[var(--gold)]" />
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-2 px-3 sm:h-12 sm:px-6">
        <Link href="/" className="min-w-0">
          <p className="font-heading text-[12px] font-semibold tracking-[0.12em] text-[var(--navy)] uppercase sm:text-sm">
            usprint
          </p>
          <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
            {uiT(lang, "headerTagline")}
          </p>
        </Link>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/samples">{shopT(lang, "samplesNav")}</Link>
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
            <Link href="/print">{shopT(lang, "printNav")}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders">{shopT(lang, "myOrders")}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account">
              {loading ? uiT(lang, "accountNav") : user ? user.email : uiT(lang, "signIn")}
            </Link>
          </Button>
          <ShopLangSwitch compact />
          <CartButton />
          <Button size="sm" asChild>
            <Link href="/order">{shopT(lang, "createNav")}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
