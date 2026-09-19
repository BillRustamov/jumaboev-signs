import type { Metadata } from "next";
import { OrdersBoard } from "@/components/orders-board";

export const metadata: Metadata = {
  title: "Shop orders",
};

export default function OrdersPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <OrdersBoard />
    </main>
  );
}
