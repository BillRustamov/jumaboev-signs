import Link from "next/link";
import { TruckSign } from "@/components/truck-sign";
import { DRIVER_SAMPLES } from "@/lib/samples";

export function HomeSampleGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {DRIVER_SAMPLES.map((sample) => (
        <Link
          key={sample.id}
          href={`/order?sample=${sample.id}`}
          className="group rounded-xl border border-border bg-white p-3 shadow-sm transition hover:border-[var(--navy)]/35 hover:shadow-md"
        >
          <TruckSign fields={sample.fields} />
          <p className="mt-3 font-heading text-sm font-semibold text-[var(--navy)]">
            {sample.label}
          </p>
          <p className="text-xs text-muted-foreground">{sample.hint}</p>
          <p className="mt-2 text-xs font-medium text-[var(--navy)] group-hover:underline">
            Use this door
          </p>
        </Link>
      ))}
    </div>
  );
}
