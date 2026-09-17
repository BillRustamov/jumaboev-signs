"use client";

import { useState } from "react";
import type { SignFields } from "@/lib/order";
import { cn } from "@/lib/utils";
import { DimensionedSign, TruckSign } from "@/components/truck-sign";
import { TruckMockup } from "@/components/truck-mockup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VINYL } from "@/lib/vinyl-spec";
import {
  getTruckMockup,
  IDENTITY_NUDGE,
  nudgeStep,
  type PlacementNudge,
  type TruckMockupConfig,
} from "@/lib/truck-mockups";

export function WhiteSemiTruck({
  fields,
  className,
  interactive = true,
  showChrome = true,
  defaultView = "truck",
  calibrate = false,
  truckId,
  fillFrame = false,
}: {
  fields: SignFields;
  className?: string;
  interactive?: boolean;
  showChrome?: boolean;
  defaultView?: "sign" | "truck";
  calibrate?: boolean;
  truckId?: string;
  fillFrame?: boolean;
}) {
  const [view, setView] = useState<"sign" | "truck">(defaultView);
  const [side, setSide] = useState<"driver" | "other">("driver");
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState<PlacementNudge>(IDENTITY_NUDGE);
  const [config, setConfig] = useState<TruckMockupConfig>(() =>
    getTruckMockup(truckId),
  );
  const cut = fields.templateId === "direct-truck";
  const showCalibrate =
    calibrate && process.env.NODE_ENV !== "production";

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
        <TruckMockup
          fields={fields}
          config={config}
          side={side}
          cut={cut}
          interactive={interactive}
          onOpen={() => setOpen(true)}
          nudge={nudge}
          onConfigChange={setConfig}
          calibrate={showCalibrate}
          fill={fillFrame}
        />
      )}

      {showChrome && view === "truck" && interactive ? (
        <PlacementBar
          nudge={nudge}
          onNudge={(action) => setNudge((cur) => nudgeStep(cur, action))}
        />
      ) : null}

      {showChrome ? (
        <p className="px-3 py-2 text-[11px] leading-snug text-muted-foreground">
          {view === "sign"
            ? `${VINYL.size} artwork. This is what we print — not stretched.`
            : side === "other"
              ? "Other-side look is the driver-door photo flipped. Lettering is not mirrored. Placement is a preview only."
              : "On the cab door, below the window, clear of the handle and mirror. Preview only — vinyl is still 20 × 12 in."}
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

function PlacementBar({
  nudge,
  onNudge,
}: {
  nudge: PlacementNudge;
  onNudge: (
    action: "left" | "right" | "up" | "down" | "smaller" | "larger" | "reset",
  ) => void;
}) {
  const dirty =
    nudge.dx !== 0 || nudge.dy !== 0 || nudge.scale !== 1;
  return (
    <div className="flex flex-wrap items-center gap-1 border-t px-3 py-2">
      <span className="mr-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
        Placement
      </span>
      <ModeBtn active={false} onClick={() => onNudge("left")}>
        Left
      </ModeBtn>
      <ModeBtn active={false} onClick={() => onNudge("right")}>
        Right
      </ModeBtn>
      <ModeBtn active={false} onClick={() => onNudge("up")}>
        Up
      </ModeBtn>
      <ModeBtn active={false} onClick={() => onNudge("down")}>
        Down
      </ModeBtn>
      <ModeBtn active={false} onClick={() => onNudge("smaller")}>
        Smaller
      </ModeBtn>
      <ModeBtn active={false} onClick={() => onNudge("larger")}>
        Larger
      </ModeBtn>
      <ModeBtn active={dirty} onClick={() => onNudge("reset")}>
        Reset placement
      </ModeBtn>
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
