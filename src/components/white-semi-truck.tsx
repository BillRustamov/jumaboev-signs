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

/** Customer mockup: white Volvo sleeper, landscape vinyl on the door. */
const SRC = { w: 1312, h: 928 };

/** Black frame on the mockup — close-up of the 20×10 in vinyl. */
const INSET = { left: 20.05, top: 26.72, width: 26.75, height: 15.84 };
/** Horizontal plaque on the sleeper door the green arrow points to. */
const DOOR = { left: 48.15, top: 64.7, width: 11.5, height: 5.75 };

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
          "overflow-hidden rounded-xl bg-white ring-1 ring-black/10",
          className,
        )}
      >
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: `${SRC.w} / ${SRC.h}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/white-volvo-door.png"
            alt="White sleeper cab with USDOT vinyl on the door"
            className="absolute inset-0 h-full w-full object-contain"
          />
          <DoorChip
            fields={fields}
            interactive={interactive}
            onOpen={() => setOpen(true)}
            box={DOOR}
            className="shadow-[0_3px_10px_rgba(20,24,28,0.22)]"
            label="Open door lettering"
          />
          <DoorChip
            fields={fields}
            interactive={interactive}
            onOpen={() => setOpen(true)}
            box={INSET}
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
            <div className="overflow-hidden rounded-[1.2rem] border-[5px] border-black bg-white p-[2%] shadow-2xl">
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
  className,
  label,
}: {
  fields: SignFields;
  box: { left: number; top: number; width: number; height: number };
  interactive: boolean;
  onOpen: () => void;
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
    <div className="h-full w-full">
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
