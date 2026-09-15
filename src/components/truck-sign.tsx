import { cn } from "@/lib/utils";
import type { SignFields } from "@/lib/order";

const GREEN = "#3d5c38";
const NAVY = "#1a2744";
const GOLD = "#c6a23a";
const RED = "#b83a2f";

function GoldRedRule() {
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
          backgroundColor: GOLD,
        }}
      />
      <div
        style={{
          width: "22%",
          height: "100%",
          borderRadius: 999,
          backgroundColor: RED,
        }}
      />
    </div>
  );
}

function NavyPlate({
  label,
  value,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder: string;
}) {
  const filled = value.trim();
  return (
    <div
      className={cn("flex w-full items-center", !filled && "opacity-35")}
      style={{
        marginTop: "2.1%",
        backgroundColor: NAVY,
        borderRadius: "2.4cqw",
        padding: "2.3% 4.2%",
      }}
    >
      <span
        className="font-sign-condensed shrink-0 font-semibold leading-none tracking-wide text-white"
        style={{ fontSize: "6.4cqw" }}
      >
        {label}
      </span>
      <span
        className="font-sign-condensed min-w-0 font-bold leading-none tracking-wide text-white"
        style={{ fontSize: "11.8cqw", marginLeft: "2.2%" }}
      >
        {filled || placeholder}
      </span>
    </div>
  );
}

function Chevrons() {
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
      {[GOLD, RED, GOLD].map((color, i) => (
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

function displaySize(name: string): string {
  const len = name.length;
  if (len <= 7) return "13.6cqw";
  if (len <= 10) return "11.2cqw";
  if (len <= 14) return "8.6cqw";
  if (len <= 18) return "6.8cqw";
  return "5.5cqw";
}

export function TruckSign({
  fields,
  className,
}: {
  fields: SignFields;
  className?: string;
}) {
  const company = fields.companyName.trim().toUpperCase();
  const legal = fields.legalName.trim().toUpperCase();
  const displayName = company || "COMPANY";
  const displayLegal = legal || "LEGAL NAME LLC";

  return (
    <div
      className={cn("aspect-square w-full select-none bg-white", className)}
      style={{ containerType: "inline-size" }}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundColor: GOLD,
          borderRadius: "4.8%",
          padding: "1.55%",
        }}
      >
        <div
          className="h-full w-full"
          style={{
            backgroundColor: NAVY,
            borderRadius: "4%",
            padding: "1.05%",
          }}
        >
          <div
            className="flex h-full w-full flex-col items-center bg-white"
            style={{
              borderRadius: "3.2%",
              padding: "6.6% 6.2% 3.6%",
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
                  marginBottom: "1.4cqw",
                  maxHeight: "9cqw",
                  maxWidth: "28%",
                }}
              />
            ) : null}
            <p
              className={cn(
                "font-sign-serif max-w-full text-center font-bold leading-[0.9] tracking-[-0.03em]",
                !company && "opacity-35",
              )}
              style={{
                color: GREEN,
                fontSize: displaySize(displayName),
                transform: "scaleX(0.96)",
              }}
            >
              {displayName}
            </p>
            <GoldRedRule />
            <p
              className={cn(
                "font-sign-condensed px-[2%] text-center font-semibold leading-none tracking-[0.22em]",
                !legal && "opacity-35",
              )}
              style={{ color: NAVY, fontSize: "3.15cqw" }}
            >
              {displayLegal}
            </p>
            <GoldRedRule />
            <NavyPlate
              label="DOT:"
              value={fields.dotNumber}
              placeholder="00000000"
            />
            <NavyPlate
              label="MC:"
              value={fields.mcNumber}
              placeholder="000000"
            />
            {fields.fleetNumber.trim() ? (
              <NavyPlate
                label="FLEET:"
                value={fields.fleetNumber}
                placeholder=""
              />
            ) : null}
            <Chevrons />
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
