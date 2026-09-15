import { TruckSign } from "@/components/truck-sign";
import type { SignFields } from "@/lib/order";
import { cn } from "@/lib/utils";

/** Visible crop of the studio Cascadia, in source-image pixels. */
const CROP = { x: 50, y: 90, w: 760, h: 540 };
const SRC = { w: 1280, h: 720 };

export function WhiteSemiTruck({
  fields,
  className,
}: {
  fields: SignFields;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-[#eceff2] ring-1 ring-black/10",
        className,
      )}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: `${CROP.w} / ${CROP.h}` }}
      >
        {/* Studio photo; CSS crop keeps the original file sharp. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/white-cascadia-side.jpg"
          alt="White Freightliner Cascadia with 24 by 24 vinyl on the sleeper door"
          className="absolute max-w-none"
          style={{
            width: `${(SRC.w / CROP.w) * 100}%`,
            left: `${(-CROP.x / CROP.w) * 100}%`,
            top: `${(-CROP.y / CROP.h) * 100}%`,
          }}
        />
        <div
          className="absolute"
          style={{ left: "74.2%", top: "37.2%", width: "9.2%" }}
        >
          <TruckSign
            fields={fields}
            className="shadow-[0_4px_10px_rgba(20,24,28,0.22)] ring-1 ring-black/10"
          />
        </div>
        <div className="absolute right-2 top-2 z-10 hidden w-[min(32%,18rem)] sm:block">
          <VinylCallout fields={fields} />
        </div>
      </div>
      <div className="border-t border-black/10 bg-white p-3 sm:hidden">
        <VinylCallout fields={fields} />
      </div>
    </div>
  );
}

function VinylCallout({ fields }: { fields: SignFields }) {
  return (
    <div className="rounded-lg border-2 border-[var(--navy)] bg-white p-1.5 shadow-lg">
      <TruckSign fields={fields} className="shadow-none" />
      <p className="px-1 pb-0.5 pt-1.5 text-center text-[11px] font-medium text-[var(--navy)]">
        24×24 sleeper door · set of two
      </p>
    </div>
  );
}
