import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { clampLogoSize, logoBox } from "@/lib/logo-size";
import { defaultStyle, type SignPalette } from "@/lib/sign-style";
import type { SignFields } from "@/lib/order";

/** Fit one line of the door name inside the boxed plate. */
function nameSize(name: string, hasLogo: boolean, serif: boolean): string {
  const em = serif ? 0.72 : 0.55;
  const cqw = 88 / Math.max(name.length * em, 7);
  const scaled = hasLogo ? cqw * 0.86 : cqw;
  return `min(${scaled.toFixed(2)}cqw, 36cqh)`;
}

function paletteOf(fields: SignFields): SignPalette {
  return { ...defaultStyle().colors, ...fields.colors };
}

export function NamePlate({
  fields,
  className,
  ...props
}: {
  fields: SignFields;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  const colors = paletteOf(fields);
  const company = fields.companyName.trim().toUpperCase();
  const legal = fields.legalName.trim().toUpperCase();
  const displayName = company || "COMPANY NAME";
  const nameFontClass =
    fields.nameFont === "condensed" ? "font-sign-condensed" : "font-sign-serif";
  const mark = logoBox(clampLogoSize(fields.logoSize));
  const hasLogo = Boolean(fields.logoDataUrl);

  return (
    <div
      className={cn("h-full w-full select-none", className)}
      style={{ containerType: "size" }}
      {...props}
    >
      <div
        className="flex h-full w-full flex-col items-center justify-center text-center"
        style={{
          backgroundColor: colors.face,
          boxShadow: `inset 0 0 0 max(2px, 0.7cqmin) ${colors.innerBorder}`,
          padding: hasLogo ? "5cqmin 6cqmin" : "6cqmin 7cqmin",
        }}
      >
        {hasLogo ? (
          // Data-URL logos from the order form; next/image does not fit this flow.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fields.logoDataUrl}
            alt=""
            className="object-contain"
            style={{
              marginBottom: "2cqmin",
              maxHeight: mark.maxHeight,
              maxWidth: mark.maxWidth,
            }}
          />
        ) : null}
        <p
          className={cn(
            "max-w-full overflow-hidden font-bold leading-none tracking-[-0.03em] whitespace-nowrap",
            nameFontClass,
            !company && "opacity-35",
          )}
          style={{
            color: colors.name,
            fontSize: nameSize(
              displayName,
              hasLogo,
              fields.nameFont === "serif",
            ),
          }}
        >
          {displayName}
        </p>
        {legal ? (
          <p
            className="font-sign-condensed mt-[2cqmin] max-w-full overflow-hidden font-semibold leading-none tracking-[0.14em] whitespace-nowrap"
            style={{ color: colors.legal, fontSize: "min(8cqw, 12cqh)" }}
          >
            {legal}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** USDOT / MC as two flush columns, numbers right-aligned like the cab sample. */
export function DotMcLines({
  fields,
  className,
  ...props
}: {
  fields: SignFields;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  const colors = paletteOf(fields);
  const dot = fields.dotNumber.trim() || "0000000";
  const mc = fields.mcNumber.trim() || "000000";

  return (
    <div
      className={cn("flex h-full w-full select-none items-center", className)}
      style={{ containerType: "size" }}
      {...props}
    >
      <div
        className="font-sign-condensed grid w-full font-semibold"
        style={{
          gridTemplateColumns: "auto 1fr",
          columnGap: "0.55em",
          rowGap: "0.32em",
          color: colors.legal,
          fontSize: "min(12cqw, 38cqh)",
          letterSpacing: "0.04em",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        <span className={cn("text-left", !fields.dotNumber.trim() && "opacity-35")}>
          USDOT
        </span>
        <span className={cn("text-right", !fields.dotNumber.trim() && "opacity-35")}>
          {dot}
        </span>
        <span className={cn("text-left", !fields.mcNumber.trim() && "opacity-35")}>
          MC
        </span>
        <span className={cn("text-right", !fields.mcNumber.trim() && "opacity-35")}>
          {mc}
        </span>
      </div>
    </div>
  );
}

export function TruckSign({
  fields,
  className,
  ...props
}: {
  fields: SignFields;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex aspect-[2/1] w-full flex-col bg-transparent", className)}
      {...props}
    >
      <div className="min-h-0 flex-[1.65]">
        <NamePlate fields={fields} />
      </div>
      <div className="min-h-0 flex-1" style={{ padding: "2.4% 1.2% 0" }}>
        <DotMcLines fields={fields} />
      </div>
    </div>
  );
}

export function SignPair({
  fields,
  className,
}: {
  fields: SignFields;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-md bg-neutral-100 shadow-xl ring-1 ring-black/10",
        className,
      )}
      style={{ gap: "0.55rem", padding: "0.65rem" }}
    >
      <div>
        <p className="mb-1.5 text-center text-[10px] font-semibold tracking-[0.14em] text-neutral-600 uppercase">
          Left · 20–24 × 10–12 in
        </p>
        <TruckSign fields={fields} />
      </div>
      <div>
        <p className="mb-1.5 text-center text-[10px] font-semibold tracking-[0.14em] text-neutral-600 uppercase">
          Right · 20–24 × 10–12 in
        </p>
        <TruckSign fields={fields} />
      </div>
    </div>
  );
}
