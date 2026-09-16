import type { Metadata } from "next";
import { HomeSampleGrid } from "@/components/home-sample-grid";

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
          Tap a shop door
        </h1>
        <p className="mt-2 text-muted-foreground">
          These are looks only. Each one is on a white sleeper, stacked as
          company name, USDOT, then MC. Open it on the print desk, put your
          numbers on it, then add the pair to your cart. Recommended cut is
          20–24 × 10–12 in each cab side.
        </p>
      </div>
      <HomeSampleGrid />
    </main>
  );
}
