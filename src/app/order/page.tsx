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
          This desk follows 49 CFR 390.21: MCS-150 name and USDOT on both doors.
          Recolor the Elbrus layout, skip MC if you do not run authority, then
          send the pair to the shop.
        </p>
      </div>
      <OrderStudio />
    </main>
  );
}
