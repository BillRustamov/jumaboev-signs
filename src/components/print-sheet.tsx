import { TruckSign } from "@/components/truck-sign";
import type { SignFields } from "@/lib/order";
import { VINYL } from "@/lib/vinyl-spec";

/** 24 in wide roll. Two 20×12 in doors laid out along the length — never 20×10. */
export const SHEET_W_IN = VINYL.sheetIn;
export const SHEET_H_IN = VINYL.sheetLengthIn;
export const DOOR_W_IN = VINYL.printWIn;
export const DOOR_H_IN = VINYL.printHIn;

export function PrintSheet({
  fields,
  orderId,
}: {
  fields: SignFields;
  orderId?: string;
}) {
  const left = (SHEET_W_IN - DOOR_W_IN) / 2;
  const firstTop = 1.15;
  const secondTop = firstTop + DOOR_H_IN + 0.7;

  return (
    <div
      className="print-sheet relative bg-white text-black"
      style={{ width: `${SHEET_W_IN}in`, height: `${SHEET_H_IN}in` }}
    >
      <p className="absolute left-[0.45in] top-[0.28in] font-sans text-[0.2in] tracking-wide text-neutral-700">
        Jumaboev Signs
        {orderId ? ` · ${orderId}` : ""} · matched pair · {VINYL.printSize} each ·
        24 in roll
      </p>
      <p
        className="absolute font-sans text-[0.2in] font-semibold tracking-[0.16em] text-neutral-800"
        style={{ left: `${left}in`, top: "0.78in", width: `${DOOR_W_IN}in`, textAlign: "center" }}
      >
        LEFT · {VINYL.printSize}
      </p>
      <div
        className="absolute"
        style={{
          left: `${left}in`,
          top: `${firstTop}in`,
          width: `${DOOR_W_IN}in`,
          height: `${DOOR_H_IN}in`,
        }}
      >
        <DoorCell fields={fields} />
      </div>
      <p
        className="absolute font-sans text-[0.2in] font-semibold tracking-[0.16em] text-neutral-800"
        style={{
          left: `${left}in`,
          top: `${secondTop - 0.38}in`,
          width: `${DOOR_W_IN}in`,
          textAlign: "center",
        }}
      >
        RIGHT · {VINYL.printSize}
      </p>
      <div
        className="absolute"
        style={{
          left: `${left}in`,
          top: `${secondTop}in`,
          width: `${DOOR_W_IN}in`,
          height: `${DOOR_H_IN}in`,
        }}
      >
        <DoorCell fields={fields} />
      </div>
      <p className="absolute bottom-[0.28in] left-[0.45in] font-sans text-[0.16in] text-neutral-600">
        Artwork is 20 × 12 in. Print at 100% scale. Do not fit to page. Do not
        squash.
      </p>
    </div>
  );
}

function DoorCell({ fields }: { fields: SignFields }) {
  return (
    <div
      className="relative"
      style={{ width: `${DOOR_W_IN}in`, height: `${DOOR_H_IN}in` }}
    >
      <CropMarks />
      <TruckSign
        fields={fields}
        previewBackdrop={false}
        className="h-full w-full shadow-none"
      />
    </div>
  );
}

function CropMarks() {
  const mark = "0.28in";
  const gap = "0.08in";
  const common = {
    position: "absolute" as const,
    background: "#111",
  };
  return (
    <>
      <span style={{ ...common, top: 0, left: `-${gap}`, width: 1, height: mark, transform: "translateY(-100%)" }} />
      <span style={{ ...common, top: `-${gap}`, left: 0, height: 1, width: mark, transform: "translateX(-100%)" }} />
      <span style={{ ...common, top: 0, right: `-${gap}`, width: 1, height: mark, transform: "translateY(-100%)" }} />
      <span style={{ ...common, top: `-${gap}`, right: 0, height: 1, width: mark, transform: "translateX(100%)" }} />
      <span style={{ ...common, bottom: 0, left: `-${gap}`, width: 1, height: mark, transform: "translateY(100%)" }} />
      <span style={{ ...common, bottom: `-${gap}`, left: 0, height: 1, width: mark, transform: "translateX(-100%)" }} />
      <span style={{ ...common, bottom: 0, right: `-${gap}`, width: 1, height: mark, transform: "translateY(100%)" }} />
      <span style={{ ...common, bottom: `-${gap}`, right: 0, height: 1, width: mark, transform: "translateX(100%)" }} />
    </>
  );
}
