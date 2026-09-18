import type { Metadata } from "next";
import { CheckoutDesk } from "@/components/checkout-desk";
import { Localized } from "@/components/localized";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <Localized
          k="checkoutKicker"
          as="p"
          className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase"
        />
        <Localized
          k="checkoutTitle"
          as="h1"
          className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]"
        />
        <Localized k="checkoutLead" as="p" className="mt-2 text-muted-foreground" />
      </div>
      <CheckoutDesk />
    </main>
  );
}
