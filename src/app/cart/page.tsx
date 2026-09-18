import type { Metadata } from "next";
import { CartPage } from "@/components/cart-page";
import { Localized } from "@/components/localized";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartRoute() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <Localized
          k="cartKicker"
          as="p"
          className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase"
        />
        <Localized
          k="cartTitle"
          as="h1"
          className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]"
        />
        <Localized k="cartLead" as="p" className="mt-2 text-muted-foreground" />
      </div>
      <CartPage />
    </main>
  );
}
