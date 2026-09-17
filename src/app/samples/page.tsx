import type { Metadata } from "next";
import { SamplesCatalog } from "@/components/samples-catalog";
import { VINYL } from "@/lib/vinyl-spec";

export const metadata: Metadata = {
  title: "Door samples",
};

export default function SamplesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
          Samples
        </p>
        <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]">
          Five layouts. Your numbers.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Each card is a {VINYL.size} door — the sign first, truck second.
          White vinyl, logo-led, cut lettering, or a printed plaque. Open{" "}
          <span className="font-medium text-[var(--navy)]">
            Customize this design
          </span>{" "}
          to put your MCS-150 name, USDOT, and MC on the print ticket.
        </p>
      </div>
      <SamplesCatalog />
    </main>
  );
}
