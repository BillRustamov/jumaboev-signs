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
          Orders on this machine
        </h1>
        <p className="mt-2 text-muted-foreground">
          Web and Telegram tickets share an in-memory shop list while the
          server is running, plus a copy in this browser. Restarting the app
          clears the server list; browser copies stay.
        </p>
      </div>
      <OrdersBoard />
    </main>
  );
}
