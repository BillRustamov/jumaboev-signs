import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderStudio } from "@/components/order-studio";
import { Skeleton } from "@/components/ui/skeleton";

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
          Pick a look, then fill the ticket
        </h1>
        <p className="mt-2 text-muted-foreground">
          A sample is only the style. Before vinyl is cut you must set
          lettering, colors, and layout on the print ticket — your MCS-150 name
          and USDOT, not the shop demo.
        </p>
      </div>
      <Suspense fallback={<DeskFallback />}>
        <OrderStudio />
      </Suspense>
    </main>
  );
}

function DeskFallback() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="aspect-square rounded-xl" />
    </div>
  );
}
