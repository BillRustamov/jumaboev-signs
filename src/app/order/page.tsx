import type { Metadata } from "next";
import { OrderStudio } from "@/components/order-studio";

export const metadata: Metadata = {
  title: "Design 24×24 door vinyl",
};

export default function OrderPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
          Print desk
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-[var(--navy)]">
          Pick a sample, then send the pair
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tap a shop door, drop in the MCS-150 name and USDOT, and set how large
          the logo prints on the 24×24 vinyl. MC is optional. Shop handle is
          asked only when you place the order.
        </p>
      </div>
      <OrderStudio />
    </main>
  );
}
