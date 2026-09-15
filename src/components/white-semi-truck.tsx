"use client";

import { useState } from "react";
import { defaultStyle, type SignPalette } from "@/lib/sign-style";
import type { SignFields } from "@/lib/order";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

/** Cropped Roadway-style Cascadia template (carousel arrows removed). */
const SRC = { w: 1340, h: 828 };

const INSET = { left: 46.8, top: 0, width: 53.2, height: 55.8 };
const DOOR = { left: 43.5, top: 63.7, width: 13.3, height: 13.9 };

export function WhiteSemiTruck({
  fields,
  className,
}: {
  fields: SignFields;
  className?: string;
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
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute z-10 cursor-zoom-in overflow-hidden p-0 shadow-[0_4px_14px_rgba(20,24,28,0.28)] ring-0"
            style={{
              left: `${DOOR.left}%`,
              top: `${DOOR.top}%`,
              width: `${DOOR.width}%`,
              height: `${DOOR.height}%`,
              borderRadius: "18% / 42%",
            }}
            aria-label="Open door lettering"
          >
            <DoorDecal fields={fields} />
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute z-10 cursor-zoom-in overflow-hidden bg-white p-0 text-left shadow-md"
            style={{
              left: `${INSET.left}%`,
              top: `${INSET.top}%`,
              width: `${INSET.width}%`,
              height: `${INSET.height}%`,
              border: "6px solid #2f7dff",
              borderRadius: "4% / 10%",
            }}
            aria-label="Open lettering close-up"
          >
            <div className="h-full w-full p-[3.2%]">
              <DoorDecal fields={fields} />
            </div>
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[min(52rem,calc(100%-1.5rem))] overflow-hidden border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-[min(52rem,calc(100%-2rem))]"
          showCloseButton
        >
          <DialogTitle className="sr-only">Door lettering</DialogTitle>
          <DialogDescription className="sr-only">
            Close-up of the sleeper-door vinyl.
          </DialogDescription>
          <div className="overflow-hidden rounded-[1.6rem] border-[6px] border-[#2f7dff] bg-white shadow-2xl">
            <div className="aspect-[2.15/1] w-full p-[2%]">
              <DoorDecal fields={fields} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function paletteOf(fields: SignFields): SignPalette {
  return { ...defaultStyle().colors, ...fields.colors };
}

function nameSize(name: string): string {
  const len = name.length;
  if (len <= 8) return "min(17cqw, 30cqh)";
  if (len <= 12) return "min(14cqw, 24cqh)";
  if (len <= 16) return "min(11.5cqw, 20cqh)";
  return "min(9.2cqw, 16cqh)";
}

/** Lettering from the Roadway template, sized to stay inside the rounded square. */
function DoorDecal({ fields }: { fields: SignFields }) {
  const colors = paletteOf(fields);
  const company = fields.companyName.trim().toUpperCase() || "COMPANY";
  const legal = fields.legalName.trim().toUpperCase();
  const dot = fields.dotNumber.trim() || "00000000";
  const mc = fields.mcNumber.trim();
  const printMc = fields.showMc !== false && Boolean(mc);
  const nameFontClass =
    fields.nameFont === "condensed" ? "font-sign-condensed" : "font-sign-serif";

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center overflow-hidden px-[6%] py-[7%] text-center"
      style={{
        containerType: "size",
        backgroundColor: colors.face,
        color: colors.name,
        borderRadius: "18% / 42%",
      }}
    >
      {fields.logoDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fields.logoDataUrl}
          alt=""
          className="mb-[1.5cqh] max-h-[16cqh] max-w-[28cqw] object-contain"
        />
      ) : null}
      <p
        className={cn(
          "max-w-full font-bold leading-[0.9] tracking-tight",
          nameFontClass,
        )}
        style={{ fontSize: nameSize(company) }}
      >
        {company}
      </p>
      {legal ? (
        <p
          className="font-sign-condensed mt-[1.4cqh] max-w-full truncate font-semibold leading-none tracking-[0.1em]"
          style={{ fontSize: "min(5.6cqw, 9cqh)", color: colors.legal }}
        >
          {legal}
        </p>
      ) : null}
      <p
        className="font-sign-condensed mt-[3.2cqh] max-w-full truncate font-semibold leading-none"
        style={{ fontSize: "min(6.4cqw, 10cqh)", color: colors.legal }}
      >
        USDOT {dot}
      </p>
      {printMc ? (
        <p
          className="font-sign-condensed mt-[1.4cqh] max-w-full truncate font-semibold leading-none"
          style={{ fontSize: "min(6.4cqw, 10cqh)", color: colors.legal }}
        >
          MC {mc}
        </p>
      ) : null}
    </div>
  );
}
