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
        width: "56%",
        height: "max(3px, 0.55cqw)",
        marginTop: "0.7cqw",
        marginBottom: "0.8cqw",
        display: "flex",
        gap: "0.7cqw",
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
        backgroundColor: plate,
        borderRadius: "1.1cqw",
        padding: "1.05cqw 2.4cqw",
      }}
    >
      <span
        className="font-sign-condensed shrink-0 font-semibold leading-none tracking-wide"
        style={{ fontSize: "2.7cqw", color: plateText }}
      >
        {label}
      </span>
      <span
        className="font-sign-condensed min-w-0 font-bold leading-none tracking-wide"
        style={{
          fontSize: "5.4cqw",
          marginLeft: "1.2cqw",
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
      style={{ marginTop: "1.1cqw", gap: "0.55cqw" }}
    >
      {[rule, accent, rule].map((color, i) => (
        <span
          key={`${color}-${i}`}
          style={{
            display: "inline-block",
            height: "max(3px, 0.7cqw)",
            width: "4.4cqw",
            backgroundColor: color,
            transform: "skewX(-32deg)",
            borderRadius: "0.15cqw",
          }}
        />
      ))}
    </div>
  );
}

function displaySize(name: string, logoSize: number, hasLogo: boolean): string {
  const len = name.length;
  let size = 3.4;
  if (len <= 7) size = 8.2;
  else if (len <= 10) size = 6.6;
  else if (len <= 14) size = 5.2;
  else if (len <= 18) size = 4.1;
  if (hasLogo) size *= 0.84;
  else if (logoSize >= 5) size *= 0.9;
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
  const logoSize = clampLogoSize(fields.logoSize);
  const mark = logoBox(logoSize);
  const hasLogo = Boolean(fields.logoDataUrl);

  return (
    <div
      className={cn("aspect-[20/10] w-full select-none", className)}
      style={{ containerType: "inline-size", backgroundColor: colors.face }}
      {...props}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundColor: colors.outerBorder,
          borderRadius: "2.4% / 4.8%",
          padding: "1.15% 1.05%",
        }}
      >
        <div
          className="h-full w-full"
          style={{
            backgroundColor: colors.innerBorder,
            borderRadius: "1.9% / 3.8%",
            padding: "0.8% 0.75%",
          }}
        >
          <div
            className="flex h-full w-full flex-col items-stretch justify-center"
            style={{
              backgroundColor: colors.face,
              borderRadius: "1.5% / 3%",
              padding: "2.4cqw 3.2cqw 2cqw",
            }}
          >
            <div
              className={cn(
                "flex min-h-0 items-center",
                hasLogo ? "justify-start gap-[2.4cqw]" : "flex-col justify-center",
              )}
            >
              {hasLogo ? (
                // Data-URL logos from the order form; next/image does not fit this flow.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fields.logoDataUrl}
                  alt=""
                  className="shrink-0 object-contain"
                  style={{
                    maxHeight: mark.maxHeight,
                    maxWidth: mark.maxWidth,
                  }}
                />
              ) : null}
              <div
                className={cn(
                  "flex min-w-0 flex-col",
                  hasLogo ? "items-start" : "items-center",
                )}
              >
                <p
                  className={cn(
                    "max-w-full shrink-0 font-bold leading-[0.88] tracking-[-0.03em]",
                    hasLogo ? "text-left" : "text-center",
                    nameFontClass,
                    !company && "opacity-35",
                  )}
                  style={{
                    color: colors.name,
                    fontSize: displaySize(displayName, logoSize, hasLogo),
                    transform: "scaleX(0.97)",
                  }}
                >
                  {displayName}
                </p>
                <GoldRedRule rule={colors.rule} accent={colors.accent} />
                {legal || !company ? (
                  <p
                    className={cn(
                      "font-sign-condensed max-w-full shrink-0 font-semibold leading-none tracking-[0.16em]",
                      hasLogo ? "text-left" : "text-center",
                      !legal && "opacity-35",
                    )}
                    style={{
                      color: colors.legal,
                      fontSize: "1.85cqw",
                    }}
                  >
                    {displayLegal}
                  </p>
                ) : null}
              </div>
            </div>

            <div
              className="flex w-full flex-col"
              style={{ marginTop: "1.15cqw", gap: "0.8cqw" }}
            >
              <NumberPlate
                label="USDOT"
                value={fields.dotNumber}
                placeholder="00000000"
                plate={colors.plate}
                plateText={colors.plateText}
              />
              <NumberPlate
                label="MC"
                value={fields.mcNumber}
                placeholder="000000"
                plate={colors.plate}
                plateText={colors.plateText}
              />
            </div>
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
        "flex flex-col rounded-md bg-neutral-100 shadow-xl ring-1 ring-black/10",
        className,
      )}
      style={{ gap: "0.55rem", padding: "0.65rem" }}
    >
      <div>
        <p className="mb-1.5 text-center text-[10px] font-semibold tracking-[0.14em] text-neutral-600 uppercase">
          Left door · landscape
        </p>
        <TruckSign fields={fields} />
      </div>
      <div>
        <p className="mb-1.5 text-center text-[10px] font-semibold tracking-[0.14em] text-neutral-600 uppercase">
          Right door · landscape
        </p>
        <TruckSign fields={fields} />
      </div>
    </div>
  );
}
