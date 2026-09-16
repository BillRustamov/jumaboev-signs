import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderStudio } from "@/components/order-studio";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Design door vinyl",
};

export default function OrderPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-8 lg:py-10">
      <div className="h-[6.75rem] lg:hidden" aria-hidden />
      <div className="mb-4 max-w-2xl lg:mb-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
          Print desk
        </p>
        <h1 className="font-heading mt-1 text-2xl font-semibold tracking-tight text-[var(--navy)] sm:text-3xl">
          Pick a look, then fill the ticket
        </h1>
        <p className="mt-1 hidden text-muted-foreground sm:block">
          A sample is only the style. Before vinyl is cut you must set
          lettering, colors, and layout on the print ticket — your MCS-150 name
          and USDOT, not the shop demo.
        </p>
        <p className="mt-1 text-sm text-muted-foreground sm:hidden">
          The live door stays on screen. Put your name and USDOT on the ticket.
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
      <Skeleton className="h-28 rounded-xl lg:aspect-[20/10]" />
    </div>
  );
}
