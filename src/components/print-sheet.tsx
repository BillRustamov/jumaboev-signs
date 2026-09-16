import { TruckSign } from "@/components/truck-sign";
import type { SignFields } from "@/lib/order";

/** Physical print: two ~20×10 in doors (left and right), laid out landscape. */
export const SHEET_IN = 24;
export const DOOR_W_IN = 20;
export const DOOR_H_IN = 10;

export function PrintSheet({
  fields,
  orderId,
}: {
  fields: SignFields;
  orderId?: string;
}) {
  return (
    <div
      className="print-sheet relative bg-white text-black"
      style={{ width: `${SHEET_IN}in`, height: `${SHEET_IN}in` }}
    >
      <p className="absolute left-[0.45in] top-[0.28in] font-sans text-[0.2in] tracking-wide text-neutral-700">
        Jumaboev Signs
        {orderId ? ` · ${orderId}` : ""} · two landscape ~10×20 in doors, left and right
      </p>
      <p
        className="absolute font-sans text-[0.22in] font-semibold tracking-[0.16em] text-neutral-800"
        style={{ left: "2in", top: "0.85in", width: "20in", textAlign: "center" }}
      >
        LEFT · landscape ~10×20 in
      </p>
      <div
        className="absolute"
        style={{ left: "2in", top: "1.2in", width: "20in", height: "10in" }}
      >
        <DoorCell fields={fields} />
      </div>
      <p
        className="absolute font-sans text-[0.22in] font-semibold tracking-[0.16em] text-neutral-800"
        style={{ left: "2in", top: "11.5in", width: "20in", textAlign: "center" }}
      >
        RIGHT · landscape ~10×20 in
      </p>
      <div
        className="absolute"
        style={{ left: "2in", top: "11.85in", width: "20in", height: "10in" }}
      >
        <DoorCell fields={fields} />
      </div>
      <p className="absolute bottom-[0.35in] left-[0.45in] font-sans text-[0.18in] text-neutral-600">
        Matched pair · print at 100% scale · do not fit to page
      </p>
    </div>
  );
}

function DoorCell({ fields }: { fields: SignFields }) {
  return (
    <div
      className="relative h-full w-full"
      style={{ width: `${DOOR_W_IN}in`, height: `${DOOR_H_IN}in` }}
    >
      <CropMarks />
      <TruckSign
        fields={fields}
        className="h-full w-full shadow-none [aspect-ratio:auto]"
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
