"use client";

import { useState, type ReactNode } from "react";
import type { SignFields } from "@/lib/order";
import { cn } from "@/lib/utils";
import { TruckSign } from "@/components/truck-sign";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

/** Customer mockup: white Volvo sleeper with a 20×12 in door plaque. */
const SRC = { w: 1312, h: 928 };

/** Close-up frame on the photo, filled with the 20×12 plaque. */
const INSET = { left: 22.2, top: 26.83, width: 22.4, height: 15.52 };
/** 20×12 plaque on the sleeper door the green arrow points to. */
const DOOR = { left: 48.2, top: 63.4, width: 11.6, height: 9.85 };

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
            alt="White sleeper cab with a 20 by 12 inch USDOT plaque on the door"
            className="absolute inset-0 h-full w-full object-contain"
          />
          <Hotspot
            interactive={interactive}
            onOpen={() => setOpen(true)}
            box={DOOR}
            label="Open door plaque"
          >
            <TruckSign fields={fields} className="h-full w-full [aspect-ratio:auto]" />
          </Hotspot>
          <Hotspot
            interactive={interactive}
            onOpen={() => setOpen(true)}
            box={INSET}
            label="Open plaque close-up"
          >
            <TruckSign fields={fields} className="h-full w-full [aspect-ratio:auto]" />
          </Hotspot>
        </div>
      </div>

      {interactive ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className="max-w-[min(52rem,calc(100%-1.5rem))] overflow-hidden border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-[min(52rem,calc(100%-2rem))]"
            showCloseButton
          >
            <DialogTitle className="sr-only">Door plaque</DialogTitle>
            <DialogDescription className="sr-only">
              20 by 12 inch door vinyl: logo, company name, city and state,
              USDOT, and MC.
            </DialogDescription>
            <TruckSign fields={fields} className="shadow-2xl" />
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}

function Hotspot({
  box,
  interactive,
  onOpen,
  className,
  label,
  children,
}: {
  box: { left: number; top: number; width: number; height: number };
  interactive: boolean;
  onOpen: () => void;
  className?: string;
  label: string;
  children: ReactNode;
}) {
  const style = {
    left: `${box.left}%`,
    top: `${box.top}%`,
    width: `${box.width}%`,
    height: `${box.height}%`,
  };

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "absolute z-10 flex cursor-zoom-in overflow-hidden p-0",
          className,
        )}
        style={style}
        aria-label={label}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={cn("absolute z-10 flex overflow-hidden p-0", className)}
      style={style}
    >
      {children}
    </div>
  );
}
