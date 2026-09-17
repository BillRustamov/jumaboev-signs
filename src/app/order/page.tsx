import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderStudio } from "@/components/order-studio";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Design door vinyl",
};

export default function OrderPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-0 sm:px-6 lg:py-10">
      <div className="mb-8 hidden max-w-2xl lg:block">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
          Print desk
        </p>
        <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]">
          Pick a look, then fill the ticket
        </h1>
        <p className="mt-1 text-muted-foreground">
          A sample is only the style. Before vinyl is cut you must set
          lettering, colors, and layout on the print ticket — your company
          name, city and state, USDOT, and MC, not the shop demo. Example
          cut is 20 × 12 in.
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
      <Skeleton className="h-28 rounded-xl lg:h-80" />
      <Skeleton className="h-28 rounded-xl lg:aspect-[20/12]" />
    </div>
  );
}
