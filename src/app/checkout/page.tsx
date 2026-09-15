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
          Vinyl on a white semi
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your 24×24 is on the sleeper door of a white Cascadia. Confirm the
          look, tag the ticket, and send the pair to the shop.
        </p>
      </div>
      <CheckoutDesk />
    </main>
  );
}
