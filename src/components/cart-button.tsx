"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartCount } from "@/lib/cart";

export function CartButton() {
  const count = useCartCount();
  return (
    <Button variant="ghost" size="sm" className="relative px-2.5" asChild>
      <Link href="/cart" aria-label={count ? `Cart, ${count} items` : "Cart"}>
        <ShoppingCart className="size-4" />
        <span className="hidden sm:inline">Cart</span>
        {count > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] font-semibold text-[var(--navy)]">
            {count}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
