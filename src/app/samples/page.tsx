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
          These are looks only. Open one on the print desk, put your MCS-150
          name and USDOT on it, then add the pair to your cart. Unit numbers
          are a separate small print — they do not go on this 24×24 door.
        </p>
      </div>
      <HomeSampleGrid />
    </main>
  );
}
