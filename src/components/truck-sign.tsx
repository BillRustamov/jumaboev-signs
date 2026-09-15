import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { clampLogoSize, logoBox } from "@/lib/logo-size";
import { defaultStyle, type SignPalette } from "@/lib/sign-style";
import type { SignFields } from "@/lib/order";

function GoldRedRule({ rule, accent }: { rule: string; accent: string }) {
  return (
    <div
      aria-hidden
      className="mx-auto"
      style={{
        width: "74%",
        height: "max(4px, 0.85cqw)",
        marginTop: "1.15cqw",
        marginBottom: "1.55cqw",
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
      className={cn("flex w-full items-center", !filled && "opacity-35")}
      style={{
        marginTop: "2.1%",
        backgroundColor: plate,
        borderRadius: "2.4cqw",
        padding: "2.3% 4.2%",
      }}
    >
      <span
        className="font-sign-condensed shrink-0 font-semibold leading-none tracking-wide"
        style={{ fontSize: "5.4cqw", color: plateText }}
      >
        {label}
      </span>
      <span
        className="font-sign-condensed min-w-0 font-bold leading-none tracking-wide"
        style={{ fontSize: "10.6cqw", marginLeft: "2%", color: plateText }}
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
      className="flex items-end justify-center"
      style={{
        marginTop: "auto",
        paddingTop: "3.2%",
        marginBottom: "0.4%",
        gap: "0.9cqw",
      }}
    >
      {[rule, accent, rule].map((color, i) => (
        <span
          key={`${color}-${i}`}
          style={{
            display: "inline-block",
            height: "max(4px, 1.35cqw)",
            width: "7.2cqw",
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
  let size = 5.5;
  if (len <= 7) size = 13.6;
  else if (len <= 10) size = 11.2;
  else if (len <= 14) size = 8.6;
  else if (len <= 18) size = 6.8;
  if (logoSize >= 5) size *= 0.82;
  else if (logoSize >= 4) size *= 0.9;
  return `${size}cqw`;
}

function paletteOf(fields: SignFields): SignPalette {
  return { ...defaultStyle().colors, ...fields.colors };
}

export function TruckSign({
  fields,
  className,
  layout = "square",
  ...props
}: {
  fields: SignFields;
  className?: string;
  /** Square mockup, or the 11×20 in print-door cell. */
  layout?: "square" | "door";
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
      className={cn(
        "w-full select-none",
        layout === "door" ? "aspect-[11/20] h-full" : "aspect-square",
        className,
      )}
      style={{ containerType: "inline-size", backgroundColor: colors.face }}
      {...props}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundColor: colors.outerBorder,
          borderRadius: "4.8%",
          padding: "1.55%",
        }}
      >
        <div
          className="h-full w-full"
          style={{
            backgroundColor: colors.innerBorder,
            borderRadius: "4%",
            padding: "1.05%",
          }}
        >
          <div
            className="flex h-full w-full flex-col items-center"
            style={{
              backgroundColor: colors.face,
              borderRadius: "3.2%",
              padding: logoSize >= 4 ? "4.4% 5.4% 3.2%" : "6.6% 6.2% 3.6%",
              overflow: "hidden",
            }}
          >
            {fields.logoDataUrl ? (
              // Data-URL logos from the order form; next/image does not fit this flow.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fields.logoDataUrl}
                alt=""
                className="object-contain"
                style={{
                  marginBottom: "1.1cqw",
                  maxHeight: mark.maxHeight,
                  maxWidth: mark.maxWidth,
                }}
              />
            ) : null}
            <p
              className={cn(
                "max-w-full text-center font-bold leading-[0.9] tracking-[-0.03em]",
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
                    "font-sign-condensed px-[2%] text-center font-semibold leading-none tracking-[0.18em]",
                    !legal && "opacity-35",
                  )}
                  style={{ color: colors.legal, fontSize: "3.15cqw" }}
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
            ) : (
              <div className="mt-auto" />
            )}
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
        "flex flex-col rounded-md bg-neutral-100 shadow-xl ring-1 ring-black/10",
        className,
      )}
      style={{ gap: "0.35rem", padding: "0.65rem" }}
    >
      <TruckSign fields={fields} />
      <TruckSign fields={fields} />
    </div>
  );
}
