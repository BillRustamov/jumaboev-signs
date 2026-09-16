import type { Metadata } from "next";
import { CartPage } from "@/components/cart-page";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartRoute() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
          Cart
        </p>
        <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]">
          What you are printing
        </h1>
        <p className="mt-2 text-muted-foreground">
          Each item is 20 × 12 in for each side of the cab.
          Checkout shows the vinyl on a white semi before you send it to the
          shop.
        </p>
      </div>
      <CartPage />
    </main>
  );
}
