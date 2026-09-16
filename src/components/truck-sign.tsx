import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { clampLogoSize, logoBox } from "@/lib/logo-size";
import { defaultStyle, type SignPalette } from "@/lib/sign-style";
import type { SignFields } from "@/lib/order";

function GoldRedRule({ rule, accent }: { rule: string; accent: string }) {
  return (
    <div
      aria-hidden
      className="mx-auto shrink-0"
      style={{
        width: "78%",
        height: "max(3px, 0.85cqw)",
        marginTop: "1.6cqw",
        marginBottom: "1.8cqw",
        display: "flex",
        gap: "1.1cqw",
      }}
    >
      <div
        style={{
          width: "72%",
          height: "100%",
          borderRadius: 999,
          backgroundColor: rule,
        }}
      />
      <div
        style={{
          width: "22%",
          height: "100%",
          borderRadius: 999,
          backgroundColor: accent,
        }}
      />
    </div>
  );
}

function NumberPlate({
  label,
  value,
  placeholder,
  plate,
  plateText,
}: {
  label: string;
  value: string;
  placeholder: string;
  plate: string;
  plateText: string;
}) {
  const filled = value.trim();
  return (
    <div
      className={cn("flex w-full shrink-0 items-center", !filled && "opacity-35")}
      style={{
        marginTop: "2.4cqw",
        backgroundColor: plate,
        borderRadius: "2.2cqw",
        padding: "2.8cqw 5cqw",
      }}
    >
      <span
        className="font-sign-condensed shrink-0 font-semibold leading-none tracking-wide"
        style={{ fontSize: "5.8cqw", color: plateText }}
      >
        {label}
      </span>
      <span
        className="font-sign-condensed min-w-0 font-bold leading-none tracking-wide"
        style={{
          fontSize: "12.2cqw",
          marginLeft: "2.4cqw",
          color: plateText,
        }}
      >
        {filled || placeholder}
      </span>
    </div>
  );
}

function Chevrons({ rule, accent }: { rule: string; accent: string }) {
  return (
    <div
      aria-hidden
      className="flex shrink-0 items-end justify-center"
      style={{
        marginTop: "3.4cqw",
        gap: "1cqw",
      }}
    >
      {[rule, accent, rule].map((color, i) => (
        <span
          key={`${color}-${i}`}
          style={{
            display: "inline-block",
            height: "max(3px, 1.2cqw)",
            width: "8cqw",
            backgroundColor: color,
            transform: "skewX(-32deg)",
            borderRadius: "0.2cqw",
          }}
        />
      ))}
    </div>
  );
}

function displaySize(name: string, logoSize: number): string {
  const len = name.length;
  let size = 6.2;
  if (len <= 7) size = 14.8;
  else if (len <= 10) size = 12.2;
  else if (len <= 14) size = 9.2;
  else if (len <= 18) size = 7.2;
  if (logoSize >= 5) size *= 0.86;
  else if (logoSize >= 4) size *= 0.92;
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
  const displayName = company || "COMPANY";
  const displayLegal = legal || "LEGAL OR TRADE NAME";
  const nameFontClass =
    fields.nameFont === "condensed" ? "font-sign-condensed" : "font-sign-serif";
  const printMc = fields.showMc !== false;
  const logoSize = clampLogoSize(fields.logoSize);
  const mark = logoBox(logoSize);

  return (
    <div
      className={cn("aspect-[10/20] w-full select-none", className)}
      style={{ containerType: "inline-size", backgroundColor: colors.face }}
      {...props}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundColor: colors.outerBorder,
          borderRadius: "5.5% / 2.8%",
          padding: "1.8% 2.4%",
        }}
      >
        <div
          className="h-full w-full"
          style={{
            backgroundColor: colors.innerBorder,
            borderRadius: "4.6% / 2.3%",
            padding: "1.3% 1.8%",
          }}
        >
          <div
            className="flex h-full w-full flex-col items-center justify-center"
            style={{
              backgroundColor: colors.face,
              borderRadius: "3.6% / 1.8%",
              padding: "8cqw 8cqw",
            }}
          >
            {fields.logoDataUrl ? (
              // Data-URL logos from the order form; next/image does not fit this flow.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fields.logoDataUrl}
                alt=""
                className="shrink object-contain"
                style={{
                  marginBottom: "2cqw",
                  maxHeight: mark.maxHeight,
                  maxWidth: mark.maxWidth,
                }}
              />
            ) : null}
            <p
              className={cn(
                "max-w-full shrink-0 text-center font-bold leading-[0.9] tracking-[-0.03em]",
                nameFontClass,
                !company && "opacity-35",
              )}
              style={{
                color: colors.name,
                fontSize: displaySize(displayName, logoSize),
                transform: "scaleX(0.96)",
              }}
            >
              {displayName}
            </p>
            <GoldRedRule rule={colors.rule} accent={colors.accent} />
            {legal || !company ? (
              <>
                <p
                  className={cn(
                    "font-sign-condensed max-w-full shrink-0 px-[1%] text-center font-semibold leading-none tracking-[0.16em]",
                    !legal && "opacity-35",
                  )}
                  style={{
                    color: colors.legal,
                    fontSize: "3.4cqw",
                  }}
                >
                  {displayLegal}
                </p>
                <GoldRedRule rule={colors.rule} accent={colors.accent} />
              </>
            ) : null}
            <NumberPlate
              label="USDOT"
              value={fields.dotNumber}
              placeholder="00000000"
              plate={colors.plate}
              plateText={colors.plateText}
            />
            {printMc ? (
              <NumberPlate
                label="MC"
                value={fields.mcNumber}
                placeholder="000000"
                plate={colors.plate}
                plateText={colors.plateText}
              />
            ) : null}
            {fields.showChevrons !== false ? (
              <Chevrons rule={colors.rule} accent={colors.accent} />
            ) : null}
          </div>
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
        "flex items-stretch rounded-md bg-neutral-100 shadow-xl ring-1 ring-black/10",
        className,
      )}
      style={{ gap: "0.55rem", padding: "0.65rem" }}
    >
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 text-center text-[10px] font-semibold tracking-[0.14em] text-neutral-600 uppercase">
          Left · ~10×20 in
        </p>
        <TruckSign fields={fields} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 text-center text-[10px] font-semibold tracking-[0.14em] text-neutral-600 uppercase">
          Right · ~10×20 in
        </p>
        <TruckSign fields={fields} />
      </div>
    </div>
  );
}
