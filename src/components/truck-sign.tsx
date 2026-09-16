import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { clampLogoSize, logoBox } from "@/lib/logo-size";
import { defaultStyle, type SignPalette } from "@/lib/sign-style";
import type { SignFields } from "@/lib/order";

/** Name ~2–3 in at 20–24 in plaque width (10–15 cqw). */
function nameSize(name: string, hasLogo: boolean): string {
  const len = name.length;
  let size = 8.5;
  if (len <= 10) size = 13;
  else if (len <= 16) size = 11.5;
  else if (len <= 22) size = 10.5;
  else size = 8.5;
  if (hasLogo) size *= 0.88;
  return `${size}cqw`;
}

function paletteOf(fields: SignFields): SignPalette {
  return { ...defaultStyle().colors, ...fields.colors };
}

export function TruckSign({
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
  const dot = fields.dotNumber.trim() || "0000000";
  const mc = fields.mcNumber.trim() || "000000";
  const nameFontClass =
    fields.nameFont === "condensed" ? "font-sign-condensed" : "font-sign-serif";
  const logoSize = clampLogoSize(fields.logoSize);
  const mark = logoBox(logoSize);
  const hasLogo = Boolean(fields.logoDataUrl);

  return (
    <div
      className={cn("aspect-[2/1] w-full select-none", className)}
      style={{ containerType: "inline-size", backgroundColor: colors.face }}
      {...props}
    >
      <div
        className="flex h-full w-full flex-col items-center justify-center text-center"
        style={{
          backgroundColor: colors.face,
          borderRadius: "2.8% / 5.6%",
          boxShadow: `inset 0 0 0 2px ${colors.innerBorder}`,
          padding: hasLogo ? "3.2cqw 4.5cqw" : "4.2cqw 5cqw",
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
              marginBottom: "1.4cqw",
              maxHeight: mark.maxHeight,
              maxWidth: mark.maxWidth,
            }}
          />
        ) : null}
        <p
          className={cn(
            "max-w-full font-bold leading-[1.05] tracking-[-0.02em]",
            nameFontClass,
            !company && "opacity-35",
          )}
          style={{ color: colors.name, fontSize: nameSize(displayName, hasLogo) }}
        >
          {displayName}
        </p>
        {legal ? (
          <p
            className="font-sign-condensed mt-[0.6cqw] max-w-full font-semibold leading-none tracking-[0.12em]"
            style={{ color: colors.legal, fontSize: "3.6cqw" }}
          >
            {legal}
          </p>
        ) : null}
        <p
          className={cn(
            "font-sign-condensed mt-[1.6cqw] max-w-full font-semibold leading-none tracking-[0.04em]",
            !fields.dotNumber.trim() && "opacity-35",
          )}
          style={{ color: colors.legal, fontSize: "12cqw" }}
        >
          USDOT {dot}
        </p>
        <p
          className={cn(
            "font-sign-condensed mt-[1.2cqw] max-w-full font-semibold leading-none tracking-[0.04em]",
            !fields.mcNumber.trim() && "opacity-35",
          )}
          style={{ color: colors.legal, fontSize: "10cqw" }}
        >
          MC {mc}
        </p>
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
