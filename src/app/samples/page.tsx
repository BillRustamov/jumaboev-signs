import type { Metadata } from "next";
import { Localized } from "@/components/localized";
import { SamplesCatalog } from "@/components/samples-catalog";

export const metadata: Metadata = {
  title: "Door samples",
};

export default function SamplesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <Localized
          k="samplesKicker"
          as="p"
          className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase"
        />
        <Localized
          k="samplesTitle"
          as="h1"
          className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]"
        />
        <Localized k="samplesLead" as="p" className="mt-2 text-muted-foreground" />
      </div>
      <SamplesCatalog />
    </main>
  );
}
