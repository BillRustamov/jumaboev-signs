import type { Metadata } from "next";
import { CheckoutDesk } from "@/components/checkout-desk";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
          Checkout
        </p>
        <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]">
          Vinyl on the sleeper door
        </h1>
        <p className="mt-2 text-muted-foreground">
          Each item is 20 × 12 in for each side of the cab.
          Checkout shows the vinyl on a white semi before you send it to the
          shop.
        </p>
      </div>
      <CheckoutDesk />
    </main>
  );
}
