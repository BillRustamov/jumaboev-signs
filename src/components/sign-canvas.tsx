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
  });
}

export function SignCanvas({
  fields,
  design,
  className,
  title,
}: {
  fields?: SignFields;
  design?: DesignDocument;
  className?: string;
  title?: string;
}) {
  const doc = design ?? (fields ? designFromFields(fields) : null);
  if (!doc) return null;
  const { widthIn, heightIn, background } = doc;
  const radius = background.radiusIn;

  return (
    <svg
      viewBox={`0 0 ${widthIn} ${heightIn}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      className={cn("block select-none", className)}
      role="img"
      aria-label={title ?? "Truck door decal"}
    >
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
      {doc.elements.map((el) => {
        if (!el.visible) return null;
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
          return (
            <g key={el.id}>
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
                  x={el.xIn}
                  y={el.yIn}
                  width={el.widthIn}
                  height={el.heightIn}
                  preserveAspectRatio="xMidYMid meet"
                  opacity={el.opacity ?? 1}
                />
              ) : null}
            </g>
          );
        }
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
