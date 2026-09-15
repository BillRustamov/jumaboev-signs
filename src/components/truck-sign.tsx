import { cn } from "@/lib/utils";
import type { SignFields } from "@/lib/order";

const GREEN = "#3d5c38";
const NAVY = "#1a2744";
const GOLD = "#c6a23a";
const RED = "#b83a2f";

function GoldRedRule() {
  return (
    <div
      className="mx-auto mt-[1.1cqw] mb-[1.4cqw] flex w-[74%] items-center gap-[1.1cqw]"
      aria-hidden
    >
      <span
        className="h-[0.55cqw] flex-[3.2] rounded-full"
        style={{ backgroundColor: GOLD }}
      />
      <span
        className="h-[0.55cqw] flex-1 rounded-full"
        style={{ backgroundColor: RED }}
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
      className={cn(
        "mt-[2.1%] flex w-full items-center rounded-[2.4cqw] px-[4.2%] py-[2.2%]",
        !filled && "opacity-35",
      )}
      style={{ backgroundColor: NAVY }}
    >
      <span className="font-sign-condensed shrink-0 text-[6.4cqw] font-semibold leading-none tracking-wide text-white">
        {label}
      </span>
      <span className="ml-[2.2%] min-w-0 font-sign-condensed text-[11.8cqw] font-bold leading-none tracking-wide text-white">
        {filled || placeholder}
      </span>
    </div>
  );
}

function Chevrons() {
  return (
    <div
      className="mt-auto mb-[0.6%] flex items-end justify-center gap-[0.75cqw] pt-[2.5%]"
      aria-hidden
    >
      {[GOLD, RED, GOLD].map((color, i) => (
        <span
          key={`${color}-${i}`}
          className="inline-block h-[1.2cqw] w-[6.6cqw] -skew-x-[32deg] rounded-[0.15cqw]"
          style={{ backgroundColor: color }}
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
      className={cn(
        "@container aspect-square w-full select-none bg-white",
        className,
      )}
    >
      <div
        className="h-full w-full rounded-[4.8%] p-[1.55%]"
        style={{ backgroundColor: GOLD }}
      >
        <div
          className="h-full w-full rounded-[4%] p-[1.05%]"
          style={{ backgroundColor: NAVY }}
        >
          <div className="flex h-full w-full flex-col items-center rounded-[3.2%] bg-white px-[6.2%] pt-[6.4%] pb-[3.4%]">
            {fields.logoDataUrl ? (
              // Data-URL logos from the order form; next/image does not fit this flow.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fields.logoDataUrl}
                alt=""
                className="mb-[1.4cqw] max-h-[9cqw] max-w-[28%] object-contain"
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
                "font-sign-condensed px-[2%] text-center text-[3.05cqw] font-semibold leading-none tracking-[0.22em]",
                !legal && "opacity-35",
              )}
              style={{ color: NAVY }}
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
        "flex flex-col gap-2 rounded-md bg-neutral-100 p-2 shadow-xl ring-1 ring-black/10 sm:gap-3 sm:p-3",
        className,
      )}
    >
      <TruckSign fields={fields} />
      <TruckSign fields={fields} />
    </div>
  );
}
