"use client";

import { useState } from "react";
import type { SignFields } from "@/lib/order";
import { cn } from "@/lib/utils";
import { TruckSign } from "@/components/truck-sign";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

/** Cropped Roadway-style Cascadia template (carousel arrows removed). */
const SRC = { w: 1340, h: 828 };

/** Landscape close-up of the 20×10 in vinyl. */
const INSET = { left: 45.6, top: 3.2, width: 52.2, height: 26.1 };
/** Horizontal plaque on the sleeper door, 20×10 in proportion. */
const DOOR = { left: 39.6, top: 62.1, width: 22.4, height: 11.2 };

export function WhiteSemiTruck({
  fields,
  className,
  interactive = true,
}: {
  fields: SignFields;
  className?: string;
  interactive?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "overflow-hidden rounded-xl bg-[#eceff2] ring-1 ring-black/10",
          className,
        )}
      >
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: `${SRC.w} / ${SRC.h}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cascadia-template.jpg"
            alt="Cascadia sleeper door with USDOT vinyl"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <DoorChip
            fields={fields}
            interactive={interactive}
            onOpen={() => setOpen(true)}
            box={DOOR}
            className="shadow-[0_4px_14px_rgba(20,24,28,0.28)]"
            label="Open door lettering"
          />
          <DoorChip
            fields={fields}
            interactive={interactive}
            onOpen={() => setOpen(true)}
            box={INSET}
            padded
            className="border-[6px] border-[#2f7dff] bg-white shadow-md"
            label="Open lettering close-up"
          />
        </div>
      </div>

      {interactive ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className="max-w-[min(52rem,calc(100%-1.5rem))] overflow-hidden border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-[min(52rem,calc(100%-2rem))]"
            showCloseButton
          >
            <DialogTitle className="sr-only">Door lettering</DialogTitle>
            <DialogDescription className="sr-only">
              Close-up of the sleeper-door vinyl, landscape ~10×20 in.
            </DialogDescription>
            <div className="overflow-hidden rounded-[1.2rem] border-[6px] border-[#2f7dff] bg-white p-[2%] shadow-2xl">
              <TruckSign fields={fields} />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}

function DoorChip({
  fields,
  box,
  interactive,
  onOpen,
  padded,
  className,
  label,
}: {
  fields: SignFields;
  box: { left: number; top: number; width: number; height: number };
  interactive: boolean;
  onOpen: () => void;
  padded?: boolean;
  className?: string;
  label: string;
}) {
  const style = {
    left: `${box.left}%`,
    top: `${box.top}%`,
    width: `${box.width}%`,
    height: `${box.height}%`,
  };
  const inner = (
    <div className={cn("h-full w-full", padded && "p-[3.2%]")}>
      <TruckSign
        fields={fields}
        className="h-full w-full [aspect-ratio:auto]"
      />
    </div>
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "absolute z-10 cursor-zoom-in overflow-hidden p-0",
          className,
        )}
        style={style}
        aria-label={label}
      >
        {inner}
      </button>
    );
  }

  return (
    <div
      className={cn("absolute z-10 overflow-hidden p-0", className)}
      style={style}
    >
      {inner}
    </div>
  );
}
