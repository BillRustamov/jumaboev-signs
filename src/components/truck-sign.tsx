import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { defaultStyle, type SignPalette } from "@/lib/sign-style";
import type { SignFields } from "@/lib/order";
import { VINYL } from "@/lib/vinyl-spec";

function nameSize(name: string): string {
  const len = name.length;
  if (len <= 10) return "min(12.6cqw, 16cqh)";
  if (len <= 14) return "min(10.8cqw, 14.5cqh)";
  if (len <= 18) return "min(9.2cqw, 13cqh)";
  return "min(7.6cqw, 11.5cqh)";
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
  const place = fields.legalName.trim().toUpperCase();
  const displayName = company || "COMPANY NAME";
  const dot = fields.dotNumber.trim() || "0000000";
  const mc = fields.mcNumber.trim() || "000000";
  const hasLogo = Boolean(fields.logoDataUrl);
  const ink = colors.name;

  return (
    <div
      className={cn(
        "relative aspect-[20/12] w-full select-none overflow-hidden",
        className,
      )}
      style={{
        containerType: "size",
        backgroundColor: colors.face,
        borderRadius: "3.2% / 5.4%",
        boxShadow: `inset 0 0 0 max(1.5px, 0.28cqh) ${colors.accent}`,
        color: ink,
      }}
      {...props}
    >
      <div className="flex h-full w-full flex-col items-center justify-center px-[6%] py-[7%] text-center">
        <div
          className="flex items-center justify-center"
          style={{
            marginBottom: "2cqh",
            minWidth: "30cqw",
            maxWidth: "44cqw",
            padding: "1.1cqh 3cqw",
            border: `max(1.5px, 0.38cqh) solid ${ink}`,
            borderRadius: "1.2cqh",
          }}
        >
          {hasLogo ? (
            // Data-URL logos from the order form; next/image does not fit this flow.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fields.logoDataUrl}
              alt=""
              className="max-h-full max-w-full object-contain"
              style={{ height: "8.5cqh" }}
            />
          ) : (
            <span
              className="font-sign-condensed font-semibold leading-none tracking-[0.2em]"
              style={{ fontSize: "min(5.8cqw, 7.6cqh)" }}
            >
              LOGO
            </span>
          )}
        </div>

        <p
          className={cn(
            "font-sign-condensed max-w-full overflow-hidden font-bold leading-[0.9] tracking-[-0.03em] whitespace-nowrap",
            !company && "opacity-40",
          )}
          style={{ color: ink, fontSize: nameSize(displayName) }}
        >
          {displayName}
        </p>

        <div
          style={{
            marginTop: "1.8cqh",
            marginBottom: "1.6cqh",
            width: "46%",
            height: "max(1px, 0.28cqh)",
            backgroundColor: colors.accent,
          }}
        />

        <p
          className={cn(
            "font-sign-condensed max-w-full overflow-hidden font-medium leading-none tracking-[0.18em] whitespace-nowrap",
            !place && "opacity-40",
          )}
          style={{ color: colors.legal, fontSize: "min(5cqw, 6.8cqh)" }}
        >
          {place || "CITY, STATE"}
        </p>

        <p
          className={cn(
            "font-sign-condensed mt-[1.7cqh] max-w-full overflow-hidden font-semibold leading-none tracking-[0.1em] whitespace-nowrap",
            !fields.dotNumber.trim() && "opacity-40",
          )}
          style={{ color: colors.legal, fontSize: "min(5.6cqw, 7.4cqh)" }}
        >
          USDOT {dot}
        </p>
        <p
          className={cn(
            "font-sign-condensed mt-[1.1cqh] max-w-full overflow-hidden font-semibold leading-none tracking-[0.1em] whitespace-nowrap",
            !fields.mcNumber.trim() && "opacity-40",
          )}
          style={{ color: colors.legal, fontSize: "min(5.6cqw, 7.4cqh)" }}
        >
          MC {mc}
        </p>
      </div>
    </div>
  );
}

export function DimensionedSign({
  fields,
  className,
}: {
  fields: SignFields;
  className?: string;
}) {
  return (
    <div className={cn("w-full text-[11px] font-medium tracking-[0.16em] text-neutral-700 sm:text-xs", className)}>
      <div className="mb-2 flex items-center gap-2 px-[6%]">
        <span className="h-px flex-1 bg-neutral-800" />
        <span>20 INCH</span>
        <span className="h-px flex-1 bg-neutral-800" />
      </div>
      <div className="flex items-stretch gap-2">
        <div className="min-w-0 flex-1">
          <TruckSign fields={fields} />
        </div>
        <div className="flex w-6 flex-col items-center justify-between py-1 text-center sm:w-8">
          <span className="w-px flex-1 bg-neutral-800" />
          <span className="py-2 [writing-mode:vertical-rl] rotate-180">
            12 INCH
          </span>
          <span className="w-px flex-1 bg-neutral-800" />
        </div>
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
          Left · {VINYL.size}
        </p>
        <TruckSign fields={fields} />
      </div>
      <div>
        <p className="mb-1.5 text-center text-[10px] font-semibold tracking-[0.14em] text-neutral-600 uppercase">
          Right · {VINYL.size}
        </p>
        <TruckSign fields={fields} />
      </div>
    </div>
  );
}
