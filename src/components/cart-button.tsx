"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TruckSign } from "@/components/truck-sign";
import { useCart } from "@/lib/cart";
import { uiT } from "@/lib/shop-copy";
import { useShopLang } from "@/lib/shop-lang";

export function CartButton() {
  const lang = useShopLang();
  const items = useCart();
  const count = items.length;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative px-2.5"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={
          count
            ? uiT(lang, "cartCount", { n: String(count) })
            : uiT(lang, "cartEmptyAria")
        }
        onClick={() => setOpen((current) => !current)}
      >
        <ShoppingCart className="size-4" />
        <span className="hidden sm:inline">{uiT(lang, "cartNav")}</span>
        {count > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] font-semibold text-[var(--navy)]">
            {count}
          </span>
        ) : null}
      </Button>
      {open ? (
        <div
          role="dialog"
          aria-label={uiT(lang, "shoppingCart")}
          className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-1.5rem))] rounded-xl border bg-white p-3 shadow-lg max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:mt-1 max-sm:w-auto"
        >
          {count === 0 ? (
            <p className="px-1 py-2 text-sm text-muted-foreground">
              {uiT(lang, "cartEmptyMini")}
            </p>
          ) : (
            <ul className="max-h-72 space-y-2 overflow-auto">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border p-2"
                >
                  <TruckSign
                    fields={item.fields}
                    className="w-24 shrink-0 shadow-none"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--navy)]">
                      {item.fields.companyName.trim().toUpperCase() ||
                        uiT(lang, "doorPair")}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {uiT(lang, "setOfTwoUsdot", {
                        dot: item.fields.dotNumber || "—",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/cart" onClick={() => setOpen(false)}>
                {uiT(lang, "openCart")}
              </Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link
                href={count ? "/checkout" : "/order"}
                onClick={() => setOpen(false)}
              >
                {count ? uiT(lang, "checkout") : uiT(lang, "printDesk")}
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
