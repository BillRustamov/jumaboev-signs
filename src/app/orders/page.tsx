import type { Metadata } from "next";
import { OrdersBoard } from "@/components/orders-board";

export const metadata: Metadata = {
  title: "Shop orders",
};

export default function OrdersPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
          Queue
        </p>
        <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]">
          Shop orders
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tickets from print-existing uploads, the designer checkout, and
          Telegram. Custom designs still go through the cart and a white-cab
          preview.
        </p>
      </div>
      <OrdersBoard />
    </main>
  );
}
