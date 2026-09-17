"use client";

import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";
import type { SignFields } from "@/lib/order";
import { TruckSign } from "@/components/truck-sign";
import {
  aabbBottom,
  aabbOfQuad,
  aabbRight,
  calibrationJson,
  containedImageRect,
  containerPointToImage,
  cornersForSide,
  fitSignToDoor,
  IDENTITY_NUDGE,
  imagePointToContainer,
  insetAabb,
  matrix3dFromQuads,
  overlayBoxStyle,
  quadPoints,
  rectCorners,
  type AABB,
  type ContainedImage,
  type DoorQuad,
  type PlacementNudge,
  type Point,
  type TruckMockupConfig,
} from "@/lib/truck-mockups";

const ZONE_FILL: Record<string, string> = {
  window: "rgba(56, 132, 255, 0.28)",
  mirror: "rgba(220, 50, 50, 0.28)",
  handle: "rgba(220, 160, 0, 0.35)",
  seam: "rgba(160, 40, 180, 0.28)",
  trim: "rgba(20, 160, 80, 0.28)",
};

export function TruckMockup({
  fields,
  config,
  side,
  cut,
  interactive,
  onOpen,
  nudge = IDENTITY_NUDGE,
  onConfigChange,
  calibrate = false,
  fill = false,
}: {
  fields: SignFields;
  config: TruckMockupConfig;
  side: "driver" | "other";
  cut: boolean;
  interactive: boolean;
  onOpen: () => void;
  nudge?: PlacementNudge;
  onConfigChange?: (next: TruckMockupConfig) => void;
  calibrate?: boolean;
  fill?: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [contained, setContained] = useState<ContainedImage>(() =>
    containedImageRect(
      config.imageWidthPx,
      config.imageHeightPx,
      config.imageWidthPx,
      config.imageHeightPx,
    ),
  );

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const box = el.getBoundingClientRect();
      setContained(
        containedImageRect(
          box.width,
          box.height,
          config.imageWidthPx,
          config.imageHeightPx,
        ),
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [config.imageWidthPx, config.imageHeightPx]);

  const fit = fitSignToDoor(config, nudge);
  const box = overlayBoxStyle(fit.rect, contained, side);
  const flipped = side === "other";
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

  const perspectiveStyle =
    config.perspective && contained.renderW > 0
      ? perspectiveOverlayStyle(fit.rect, fit.corners, contained, side)
      : null;

  const overlayStyle = perspectiveStyle ?? {
    left: box.left,
    top: box.top,
    width: box.width,
    height: box.height,
  };

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative overflow-hidden bg-[#cfd5dc]",
        fill && "h-full w-full",
      )}
      style={
        fill
          ? undefined
          : {
              aspectRatio: `${config.imageWidthPx} / ${config.imageHeightPx}`,
            }
      }
      data-truck-mockup={config.id}
      data-truck-side={side}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={config.image}
        alt={config.alt}
        className="absolute inset-0 h-full w-full object-contain"
        style={{ transform: flipped ? "scaleX(-1)" : undefined }}
        draggable={false}
      />

      {calibrate ? (
        <CalibrationOverlay
          config={config}
          contained={contained}
          side={side}
          onConfigChange={onConfigChange}
        />
      ) : null}

      {interactive ? (
        <button
          type="button"
          className="absolute z-10 cursor-zoom-in overflow-hidden p-0"
          style={overlayStyle}
          aria-label="Inspect door vinyl"
          data-truck-door-sign=""
          onClick={onOpen}
        >
          {sign}
        </button>
      ) : (
        <div
          className="absolute z-10 overflow-hidden"
          style={overlayStyle}
          data-truck-door-sign=""
        >
          {sign}
        </div>
      )}

      {fit.warning ? (
        <p className="absolute bottom-2 left-2 right-2 z-20 rounded-md bg-black/70 px-2 py-1 text-[11px] text-white">
          {fit.warning}
        </p>
      ) : null}
    </div>
  );
}

function perspectiveOverlayStyle(
  rect: AABB,
  corners: [Point, Point, Point, Point],
  contained: ContainedImage,
  side: "driver" | "other",
): {
  left: number;
  top: number;
  width: number;
  height: number;
  transform: string;
  transformOrigin: string;
} {
  const placed = overlayBoxStyle(rect, contained, side);
  const dest = cornersForSide(corners, side).map((p) =>
    imagePointToContainer(p.x, p.y, contained),
  ) as [Point, Point, Point, Point];
  const src = rectCorners({
    x: placed.left,
    y: placed.top,
    width: placed.width,
    height: placed.height,
  });
  return {
    left: placed.left,
    top: placed.top,
    width: placed.width,
    height: placed.height,
    transformOrigin: "0 0",
    transform: matrix3dFromQuads(src, dest),
  };
}

function CalibrationOverlay({
  config,
  contained,
  side,
  onConfigChange,
}: {
  config: TruckMockupConfig;
  contained: ContainedImage;
  side: "driver" | "other";
  onConfigChange?: (next: TruckMockupConfig) => void;
}) {
  const fit = fitSignToDoor(config);
  const doorPts = quadPoints(config.doorZone).map((p) =>
    imagePointToContainer(side === "other" ? 1 - p.x : p.x, p.y, contained),
  );
  const inset = insetAabb(
    aabbOfQuad(config.doorZone),
    config.safeInset ?? { top: 0.06, right: 0.06, bottom: 0.06, left: 0.06 },
  );
  const insetPts = rectCorners(inset).map((p) =>
    imagePointToContainer(side === "other" ? 1 - p.x : p.x, p.y, contained),
  );
  const usablePts = rectCorners(fit.usable).map((p) =>
    imagePointToContainer(side === "other" ? 1 - p.x : p.x, p.y, contained),
  );
  const signPts = rectCorners(fit.rect).map((p) =>
    imagePointToContainer(side === "other" ? 1 - p.x : p.x, p.y, contained),
  );
  const center = imagePointToContainer(
    side === "other" ? 1 - (fit.rect.x + fit.rect.width / 2) : fit.rect.x + fit.rect.width / 2,
    fit.rect.y + fit.rect.height / 2,
    contained,
  );
  const handles: { key: keyof DoorQuad; point: Point }[] = [
    { key: "topLeft", point: config.doorZone.topLeft },
    { key: "topRight", point: config.doorZone.topRight },
    { key: "bottomRight", point: config.doorZone.bottomRight },
    { key: "bottomLeft", point: config.doorZone.bottomLeft },
  ];

  const [copied, setCopied] = useState(false);
  const drag = useRef<{ key: keyof DoorQuad } | null>(null);

  function onHandleDown(key: keyof DoorQuad, event: PointerEvent<SVGCircleElement>) {
    if (side !== "driver" || !onConfigChange) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { key };
  }

  function onHandleMove(event: PointerEvent<SVGCircleElement>) {
    if (!drag.current || !onConfigChange || !event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const local = { x: event.clientX - box.left, y: event.clientY - box.top };
    const img = containerPointToImage(local.x, local.y, contained);
    const nx = Math.min(1, Math.max(0, img.x));
    const ny = Math.min(1, Math.max(0, img.y));
    onConfigChange({
      ...config,
      doorZone: {
        ...config.doorZone,
        [drag.current.key]: { x: round4(nx), y: round4(ny) },
      },
    });
  }

  function onHandleUp(event: PointerEvent<SVGCircleElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drag.current = null;
  }

  async function copyJson() {
    await navigator.clipboard.writeText(calibrationJson(config));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <polygon
          points={doorPts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(0, 180, 255, 0.12)"
          stroke="rgb(0, 180, 255)"
          strokeWidth="2"
        />
        <polygon
          points={insetPts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="rgb(0, 255, 160)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <polygon
          points={usablePts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="rgb(255, 255, 0)"
          strokeWidth="1.25"
        />
        {config.forbiddenZones?.map((zone, i) => {
          const pts = zone.polygon.map((p) =>
            imagePointToContainer(side === "other" ? 1 - p.x : p.x, p.y, contained),
          );
          return (
            <polygon
              key={`${zone.type}-${i}`}
              points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
              fill={ZONE_FILL[zone.type] ?? "rgba(255,255,255,0.2)"}
              stroke="rgba(0,0,0,0.45)"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          points={signPts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="rgb(255, 80, 80)"
          strokeWidth="2"
        />
        <line
          x1={center.x - 8}
          y1={center.y}
          x2={center.x + 8}
          y2={center.y}
          stroke="rgb(255,80,80)"
          strokeWidth="1.5"
        />
        <line
          x1={center.x}
          y1={center.y - 8}
          x2={center.x}
          y2={center.y + 8}
          stroke="rgb(255,80,80)"
          strokeWidth="1.5"
        />
        {handles.map(({ key, point }) => {
          const at = imagePointToContainer(
            side === "other" ? 1 - point.x : point.x,
            point.y,
            contained,
          );
          return (
            <circle
              key={key}
              cx={at.x}
              cy={at.y}
              r={7}
              fill="white"
              stroke="rgb(0, 180, 255)"
              strokeWidth="2"
              className="pointer-events-auto cursor-grab"
              onPointerDown={(event) => onHandleDown(key, event)}
              onPointerMove={onHandleMove}
              onPointerUp={onHandleUp}
            />
          );
        })}
      </svg>
      <div className="pointer-events-auto absolute top-2 right-2 max-w-[16rem] rounded-md bg-black/80 p-2 text-[10px] leading-snug text-white">
        <p className="font-semibold tracking-wide uppercase">Door calibration</p>
        <p className="mt-1 font-mono">
          door {fmt(config.doorZone.topLeft)} · {fmt(config.doorZone.topRight)}
          <br />
          {fmt(config.doorZone.bottomLeft)} · {fmt(config.doorZone.bottomRight)}
        </p>
        <p className="mt-1 font-mono">
          sign {fit.rect.x.toFixed(3)},{fit.rect.y.toFixed(3)}{" "}
          {fit.rect.width.toFixed(3)}×{fit.rect.height.toFixed(3)}
        </p>
        <p className="mt-1 font-mono">
          usable {fit.usable.x.toFixed(3)}–{aabbRight(fit.usable).toFixed(3)} y{" "}
          {fit.usable.y.toFixed(3)}–{aabbBottom(fit.usable).toFixed(3)}
        </p>
        <button
          type="button"
          className="mt-2 rounded bg-white px-2 py-1 text-[10px] font-semibold text-black"
          onClick={() => void copyJson()}
        >
          {copied ? "Copied" : "Copy calibration JSON"}
        </button>
      </div>
    </div>
  );
}

function fmt(p: Point): string {
  return `${p.x.toFixed(3)},${p.y.toFixed(3)}`;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
