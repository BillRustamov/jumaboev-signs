import type { Metadata } from "next";
import { OrderStudio } from "@/components/order-studio";

export const metadata: Metadata = {
  title: "Design 24×24 door vinyl",
};

export default function OrderPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-medium text-[var(--gold)]">Print desk</p>
        <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]">
          Build the door, then send it to the shop
        </h1>
        <p className="mt-2 text-muted-foreground">
          This is the same gold-and-navy 24×24 layout Khurshid prints as a pair.
          Username first, then lettering and an optional logo.
        </p>
      </div>
      <OrderStudio />
    </main>
  );
}
