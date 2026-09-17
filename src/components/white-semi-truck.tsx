"use client";

import { useState } from "react";
import type { SignFields } from "@/lib/order";
import { cn } from "@/lib/utils";
import { DimensionedSign, TruckSign } from "@/components/truck-sign";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VINYL } from "@/lib/vinyl-spec";
import { CAB_PHOTO, doorOverlayStyle } from "@/lib/cab-mockup";

export function WhiteSemiTruck({
  fields,
  className,
  interactive = true,
  showChrome = true,
  defaultView = "truck",
}: {
  fields: SignFields;
  className?: string;
  interactive?: boolean;
  showChrome?: boolean;
  defaultView?: "sign" | "truck";
}) {
  const [view, setView] = useState<"sign" | "truck">(defaultView);
  const [side, setSide] = useState<"driver" | "other">("driver");
  const [open, setOpen] = useState(false);
  const cut = fields.templateId === "direct-truck";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-white ring-1 ring-black/10",
        className,
      )}
    >
      {showChrome ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
          <div className="flex gap-1">
            <ModeBtn
              active={view === "sign"}
              onClick={() => setView("sign")}
            >
              Sign close-up
            </ModeBtn>
            <ModeBtn
              active={view === "truck"}
              onClick={() => setView("truck")}
            >
              On the door
            </ModeBtn>
          </div>
          {view === "truck" ? (
            <div className="flex gap-1">
              <ModeBtn
                active={side === "driver"}
                onClick={() => setSide("driver")}
              >
                Driver side
              </ModeBtn>
              <ModeBtn
                active={side === "other"}
                onClick={() => setSide("other")}
              >
                Other side
              </ModeBtn>
            </div>
          ) : null}
        </div>
      ) : null}

      {view === "sign" ? (
        <button
          type="button"
          className="block w-full cursor-zoom-in bg-neutral-100 p-4 text-left sm:p-5"
          onClick={() => interactive && setOpen(true)}
          aria-label={`Inspect ${VINYL.size} artwork`}
        >
          <DimensionedSign fields={fields} />
        </button>
      ) : (
        <OnDoor
          fields={fields}
          side={side}
          cut={cut}
          interactive={interactive}
          onOpen={() => setOpen(true)}
        />
      )}

      {showChrome ? (
        <p className="px-3 py-2 text-[11px] leading-snug text-muted-foreground">
          {view === "sign"
            ? `${VINYL.size} artwork. This is what we print — not stretched.`
            : side === "other"
              ? "Other-side look is flipped from the driver-door photo, not a separate picture. Placement is a preview only."
              : "On the cab door, below the window, clear of the handle. Preview only — vinyl is still 20 × 12 in."}
        </p>
      ) : null}

      {interactive ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[min(92vh,52rem)] overflow-y-auto sm:max-w-[min(52rem,calc(100%-2rem))]">
            <DialogTitle>Door vinyl · {VINYL.size}</DialogTitle>
            <DialogDescription>
              Full artwork at print proportion. On-truck placement is a look
              only and is not the cut file.
            </DialogDescription>
            <TruckSign fields={fields} />
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}

function OnDoor({
  fields,
  side,
  cut,
  interactive,
  onOpen,
}: {
  fields: SignFields;
  side: "driver" | "other";
  cut: boolean;
  interactive: boolean;
  onOpen: () => void;
}) {
  const flipped = side === "other";
  const box = doorOverlayStyle();
  const sign = (
    <TruckSign
      fields={fields}
      previewBackdrop={false}
      className={cn(
        "h-full w-full",
        cut ? "shadow-none" : "rounded-[0.12em] shadow-[0_1px_4px_rgba(0,0,0,0.28)]",
      )}
    />
  );

  return (
    <div
      className="relative overflow-hidden bg-[#cfd5dc]"
      style={{ aspectRatio: `${CAB_PHOTO.widthPx} / ${CAB_PHOTO.heightPx}` }}
    >
      <div
        className="absolute inset-0"
        style={{ transform: flipped ? "scaleX(-1)" : undefined }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CAB_PHOTO.src}
          alt={CAB_PHOTO.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {interactive ? (
          <button
            type="button"
            className="absolute z-10 cursor-zoom-in overflow-hidden p-0"
            style={{
              ...box,
              transform: flipped ? "scaleX(-1)" : undefined,
            }}
            aria-label="Inspect door vinyl"
            onClick={onOpen}
          >
            {sign}
          </button>
        ) : (
          <div
            className="absolute z-10 overflow-hidden"
            style={{
              ...box,
              transform: flipped ? "scaleX(-1)" : undefined,
            }}
          >
            {sign}
          </div>
        )}
      </div>
    </div>
  );
}

function ModeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "ghost"}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
