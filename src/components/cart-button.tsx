"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TruckSign } from "@/components/truck-sign";
import { useCart } from "@/lib/cart";

export function CartButton() {
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
        aria-label={count ? `Cart, ${count} items` : "Cart"}
        onClick={() => setOpen((current) => !current)}
      >
        <ShoppingCart className="size-4" />
        <span className="hidden sm:inline">Cart</span>
        {count > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] font-semibold text-[var(--navy)]">
            {count}
          </span>
        ) : null}
      </Button>
      {open ? (
        <div
          role="dialog"
          aria-label="Shopping cart"
          className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-1.5rem))] rounded-xl border bg-white p-3 shadow-lg max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:mt-1 max-sm:w-auto"
        >
          {count === 0 ? (
            <p className="px-1 py-2 text-sm text-muted-foreground">
              Cart is empty. Add a 24×24 pair from the print desk.
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
                    className="w-14 shrink-0 shadow-none"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--navy)]">
                      {item.fields.companyName.trim().toUpperCase() ||
                        "Door pair"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      Set of two · USDOT {item.fields.dotNumber || "—"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/cart" onClick={() => setOpen(false)}>
                Open cart
              </Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link
                href={count ? "/checkout" : "/order"}
                onClick={() => setOpen(false)}
              >
                {count ? "Checkout" : "Print desk"}
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
