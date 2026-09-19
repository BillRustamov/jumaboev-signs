import type { Metadata } from "next";
import { Suspense } from "react";
import { Localized } from "@/components/localized";
import { OrderStudio } from "@/components/order-studio";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Design door vinyl",
};

export default function OrderPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-0 sm:px-6 lg:py-10">
      <div className="mb-8 hidden max-w-2xl lg:block">
        <Localized
          k="printDeskKicker"
          as="p"
          className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase"
        />
        <Localized
          k="pickLookTitle"
          as="h1"
          className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]"
        />
        <Localized k="pickLookLead" as="p" className="mt-1 text-muted-foreground" />
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
