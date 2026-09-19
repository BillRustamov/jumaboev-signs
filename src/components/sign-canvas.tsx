"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import {
  compileDesign,
  fontFamily,
  type DesignDocument,
} from "@/lib/design";
import type { SignFields } from "@/lib/order";

export function designFromFields(fields: SignFields): DesignDocument {
  return compileDesign({
    companyName: fields.companyName,
    city: fields.city,
    state: fields.state,
    legalName: fields.legalName,
    dotNumber: fields.dotNumber,
    mcNumber: fields.mcNumber,
    logoDataUrl: fields.logoDataUrl,
    logoAspect: fields.logoAspect,
    logoSize: fields.logoSize,
    nameFont: fields.nameFont,
    templateId: fields.templateId,
    showChevrons: fields.showChevrons,
    showMc: fields.showMc,
    colors: fields.colors,
    artworkRole: fields.artworkRole,
    artworkFit: fields.artworkFit,
    artworkOffsetX: fields.artworkOffsetX,
    artworkOffsetY: fields.artworkOffsetY,
    logoContainsName: fields.logoContainsName,
  });
}

export function SignCanvas({
  fields,
  design,
  className,
  title,
  previewBackdrop = true,
  mockupOutline = false,
}: {
  fields?: SignFields;
  design?: DesignDocument;
  className?: string;
  title?: string;
  /** Checkerboard behind cut lettering. Off for production sheets. */
  previewBackdrop?: boolean;
  /** Fine edge for white vinyl on a white truck. Never used on print sheets. */
  mockupOutline?: boolean;
}) {
  const doc = design ?? (fields ? designFromFields(fields) : null);
  const paintId = useId().replace(/:/g, "");
  if (!doc) return null;
  const { widthIn, heightIn, background } = doc;
  const radius = background.radiusIn;
  const transparent = background.fill === "none" || background.fill === "transparent";

  return (
    <svg
      viewBox={`0 0 ${widthIn} ${heightIn}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      className={cn("block size-full select-none", className)}
      role="img"
      aria-label={title ?? "Truck door decal"}
    >
      {transparent && previewBackdrop ? (
        <>
          <defs>
            <pattern
              id={`paint-${paintId}`}
              width={0.45}
              height={0.45}
              patternUnits="userSpaceOnUse"
            >
              <rect width={0.45} height={0.45} fill="#d5d9dd" />
              <rect width={0.225} height={0.225} fill="#eceff1" />
              <rect x={0.225} y={0.225} width={0.225} height={0.225} fill="#eceff1" />
            </pattern>
          </defs>
          <rect
            width={widthIn}
            height={heightIn}
            fill={`url(#paint-${paintId})`}
          />
        </>
      ) : null}
      {transparent ? null : (
        <rect
          x={background.borderIn / 2}
          y={background.borderIn / 2}
          width={widthIn - background.borderIn}
          height={heightIn - background.borderIn}
          rx={radius}
          ry={radius}
          fill={background.fill}
          stroke={background.borderColor}
          strokeWidth={background.borderIn}
        />
      )}
      {mockupOutline && !transparent ? (
        <rect
          x={0.04}
          y={0.04}
          width={widthIn - 0.08}
          height={heightIn - 0.08}
          rx={radius}
          ry={radius}
          fill="none"
          stroke="rgba(20, 28, 36, 0.38)"
          strokeWidth={0.045}
        />
      ) : null}
      {doc.elements.map((el) => {
        if (!el.visible) return null;
        if (el.type === "band") {
          return (
            <rect
              key={el.id}
              x={el.xIn}
              y={el.yIn}
              width={el.widthIn}
              height={el.heightIn}
              rx={el.radiusIn}
              ry={el.radiusIn}
              fill={el.fill}
            />
          );
        }
        if (el.type === "rule") {
          return (
            <rect
              key={el.id}
              x={el.xIn}
              y={el.yIn}
              width={el.widthIn}
              height={el.heightIn}
              fill={el.color}
            />
          );
        }
        if (el.type === "chevron") {
          const { xIn, yIn, widthIn: w, heightIn: h } = el;
          const points =
            el.direction === "right"
              ? `${xIn},${yIn} ${xIn + w},${yIn + h / 2} ${xIn},${yIn + h}`
              : `${xIn + w},${yIn} ${xIn},${yIn + h / 2} ${xIn + w},${yIn + h}`;
          return <polygon key={el.id} points={points} fill={el.color} />;
        }
        if (el.type === "logo") {
          const clipId = `crop-${el.id}-${paintId}`;
          return (
            <g key={el.id}>
              {el.cropped ? (
                <defs>
                  <clipPath id={clipId}>
                    <rect
                      x={el.xIn}
                      y={el.yIn}
                      width={el.widthIn}
                      height={el.heightIn}
                    />
                  </clipPath>
                </defs>
              ) : null}
              {el.boxed ? (
                <rect
                  x={el.xIn}
                  y={el.yIn}
                  width={el.widthIn}
                  height={el.heightIn}
                  rx={0.12}
                  fill="none"
                  stroke={el.boxColor}
                  strokeWidth={0.06}
                />
              ) : null}
              {el.src ? (
                <image
                  href={el.src}
                  x={el.imageXIn ?? el.xIn}
                  y={el.imageYIn ?? el.yIn}
                  width={el.imageWidthIn ?? el.widthIn}
                  height={el.imageHeightIn ?? el.heightIn}
                  preserveAspectRatio="xMidYMid meet"
                  opacity={el.opacity ?? 1}
                  clipPath={el.cropped ? `url(#${clipId})` : undefined}
                />
              ) : null}
            </g>
          );
        }
        if (el.type !== "text") return null;
        const anchor =
          el.align === "left" ? "start" : el.align === "right" ? "end" : "middle";
        const x =
          el.align === "left"
            ? el.xIn
            : el.align === "right"
              ? el.xIn + el.widthIn
              : el.xIn + el.widthIn / 2;
        const y = el.yIn + el.fontSizeIn * 0.86;
        const boxedGhost = el.role === "ghost-logo";
        return (
          <g key={el.id} opacity={el.opacity ?? 1}>
            {boxedGhost ? (
              <rect
                x={el.xIn}
                y={el.yIn}
                width={el.widthIn}
                height={el.heightIn}
                rx={0.14}
                fill="none"
                stroke={el.color}
                strokeWidth={0.055}
              />
            ) : null}
            <text
              x={x}
              y={boxedGhost ? el.yIn + el.heightIn / 2 + el.fontSizeIn * 0.32 : y}
              textAnchor={anchor}
              fill={el.color}
              fontFamily={fontFamily(el.font)}
              fontSize={el.fontSizeIn}
              fontWeight={el.weight}
              letterSpacing={
                el.letterSpacingEm ? `${el.letterSpacingEm}em` : undefined
              }
              style={{ textTransform: el.uppercase ? "uppercase" : undefined }}
            >
              {el.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
