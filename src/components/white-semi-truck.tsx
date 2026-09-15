import { defaultStyle, type SignPalette } from "@/lib/sign-style";
import type { SignFields } from "@/lib/order";
import { cn } from "@/lib/utils";

/** Cropped Roadway-style Cascadia template. */
const SRC = { w: 1460, h: 860 };

/** Covers the zoomed lettering inset in the template. */
const INSET = { left: 48.8, top: 0, width: 51.2, height: 56.5 };
const DOOR = { left: 43.5, top: 63.2, width: 12.2, height: 13.4 };

export function WhiteSemiTruck({
  fields,
  className,
}: {
  fields: SignFields;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-[#eceff2] ring-1 ring-black/10",
        className,
      )}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: `${SRC.w} / ${SRC.h}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cascadia-template.jpg"
          alt="Cascadia sleeper door with USDOT vinyl"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute z-10"
          style={{
            left: `${DOOR.left}%`,
            top: `${DOOR.top}%`,
            width: `${DOOR.width}%`,
            height: `${DOOR.height}%`,
          }}
        >
          <DoorDecal fields={fields} />
        </div>
        <div
          className="absolute z-10 overflow-hidden bg-white"
          style={{
            left: `${INSET.left}%`,
            top: `${INSET.top}%`,
            width: `${INSET.width}%`,
            height: `${INSET.height}%`,
            border: "7px solid #2f7dff",
          }}
        >
          <div className="h-full w-full p-[3%]">
            <DoorDecal fields={fields} />
          </div>
        </div>
      </div>
    </div>
  );
}

function paletteOf(fields: SignFields): SignPalette {
  return { ...defaultStyle().colors, ...fields.colors };
}

/** Lettering layout from the Roadway template, filled with this order’s logo. */
function DoorDecal({ fields }: { fields: SignFields }) {
  const colors = paletteOf(fields);
  const company = fields.companyName.trim().toUpperCase() || "COMPANY";
  const legal = fields.legalName.trim().toUpperCase();
  const dot = fields.dotNumber.trim() || "00000000";
  const mc = fields.mcNumber.trim();
  const printMc = fields.showMc !== false && Boolean(mc);
  const nameFontClass =
    fields.nameFont === "condensed" ? "font-sign-condensed" : "font-sign-serif";

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center overflow-hidden px-[6%] py-[8%] text-center"
      style={{
        containerType: "inline-size",
        backgroundColor: colors.face,
        color: colors.name,
        borderRadius: "18% / 42%",
      }}
    >
      {fields.logoDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fields.logoDataUrl}
          alt=""
          className="mb-[2cqw] max-h-[18cqw] max-w-[36cqw] object-contain"
        />
      ) : null}
      <p
        className={cn(
          "max-w-full font-bold leading-[0.88] tracking-tight",
          nameFontClass,
        )}
        style={{ fontSize: company.length > 12 ? "13cqw" : company.length > 8 ? "16cqw" : "19cqw" }}
      >
        {company}
      </p>
      {legal ? (
        <p
          className="font-sign-condensed mt-[1.6cqw] max-w-full font-semibold leading-none tracking-[0.12em]"
          style={{ fontSize: "6.4cqw", color: colors.legal }}
        >
          {legal}
        </p>
      ) : null}
      <p
        className="font-sign-condensed mt-[4.2cqw] font-semibold leading-none"
        style={{ fontSize: "7.2cqw", color: colors.legal }}
      >
        USDOT {dot}
      </p>
      {printMc ? (
        <p
          className="font-sign-condensed mt-[1.8cqw] font-semibold leading-none"
          style={{ fontSize: "7.2cqw", color: colors.legal }}
        >
          MC {mc}
        </p>
      ) : null}
    </div>
  );
}
