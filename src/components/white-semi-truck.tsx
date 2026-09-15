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
          alt="White Freightliner Cascadia with vinyl in the lower sleeper hatch"
          className="absolute max-w-none"
          style={{
            width: `${(SRC.w / CROP.w) * 100}%`,
            left: `${(-CROP.x / CROP.w) * 100}%`,
            top: `${(-CROP.y / CROP.h) * 100}%`,
          }}
        />
        {/* Lower rounded hatch, not the handle door above it. */}
        <div
          className="absolute"
          style={{ left: "76.6%", top: "57.4%", width: "6.05%" }}
        >
          <TruckSign
            fields={fields}
            className="shadow-[0_4px_10px_rgba(20,24,28,0.22)] ring-1 ring-black/10"
          />
        </div>
        <div className="absolute right-2 top-2 z-10 hidden w-[min(24%,14rem)] sm:block">
          <div className="rounded-md border-[3px] border-[var(--navy)] bg-white p-1 shadow-lg">
            <TruckSign fields={fields} className="shadow-none" />
          </div>
        </div>
      </div>
      <div className="border-t border-black/10 bg-white p-3 sm:hidden">
        <div className="mx-auto max-w-xs">
          <div className="rounded-md border-[3px] border-[var(--navy)] bg-white p-1">
            <TruckSign fields={fields} className="shadow-none" />
          </div>
          <p className="pt-2 text-center text-[11px] font-medium text-[var(--navy)]">
            24×24 pair · 11×20 each on the print sheet
          </p>
        </div>
      </div>
    </div>
  );
}
