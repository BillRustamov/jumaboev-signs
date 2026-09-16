import Link from "next/link";
import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { DRIVER_SAMPLES } from "@/lib/samples";

export function HomeSampleGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {DRIVER_SAMPLES.map((sample) => (
        <Link
          key={sample.id}
          href={`/order?sample=${sample.id}`}
          className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:border-[var(--navy)]/35 hover:shadow-md"
        >
          <WhiteSemiTruck fields={sample.fields} interactive={false} />
          <div className="px-3 pb-3 pt-2.5">
            <p className="font-heading text-sm font-semibold text-[var(--navy)]">
              {sample.label}
            </p>
            <p className="text-xs text-muted-foreground">{sample.hint}</p>
            <p className="mt-2 text-xs font-medium text-[var(--navy)] group-hover:underline">
              Use this door
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
