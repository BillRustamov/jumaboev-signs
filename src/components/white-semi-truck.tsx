"use client";

import { useState, type ReactNode } from "react";
import type { SignFields } from "@/lib/order";
import { cn } from "@/lib/utils";
import { DotMcLines, NamePlate, TruckSign } from "@/components/truck-sign";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

/** Customer mockup: white Volvo sleeper, vinyl on the sleeper door. */
const SRC = { w: 1312, h: 928 };

/** Empty black callout on the photo — name plate fills it; numbers hang below. */
const INSET_NAME = { left: 20.12, top: 26.83, width: 26.52, height: 15.52 };
const INSET_NUMS = { left: 20.12, top: 43.45, width: 26.52, height: 7.1 };

/** Boxed name on the sleeper door; USDOT/MC on the door under the box. */
const DOOR_NAME = { left: 48.8, top: 62.45, width: 8.2, height: 6.7 };
const DOOR_NUMS = { left: 48.8, top: 69.3, width: 8.2, height: 3.35 };

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
          <Hotspot
            interactive={interactive}
            onOpen={() => setOpen(true)}
            box={DOOR_NAME}
            label="Open door lettering"
          >
            <NamePlate fields={fields} />
          </Hotspot>
          <Hotspot
            interactive={interactive}
            onOpen={() => setOpen(true)}
            box={DOOR_NUMS}
            label="Open USDOT and MC lettering"
          >
            <DotMcLines fields={fields} />
          </Hotspot>
          <Hotspot
            interactive={interactive}
            onOpen={() => setOpen(true)}
            box={INSET_NAME}
            label="Open lettering close-up"
          >
            <NamePlate fields={fields} />
          </Hotspot>
          <Hotspot
            interactive={interactive}
            onOpen={() => setOpen(true)}
            box={INSET_NUMS}
            label="Open USDOT and MC close-up"
          >
            <DotMcLines fields={fields} />
          </Hotspot>
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
              Close-up of the sleeper-door vinyl: boxed company name, USDOT and
              MC aligned underneath.
            </DialogDescription>
            <div className="overflow-hidden rounded-[1.2rem] border-[5px] border-black bg-white p-[3%] shadow-2xl">
              <TruckSign fields={fields} />
            </div>
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
