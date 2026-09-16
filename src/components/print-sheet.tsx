import { TruckSign } from "@/components/truck-sign";
import type { SignFields } from "@/lib/order";

/** Physical print: two ~10×20 in doors (left and right). */
export const SHEET_IN = 24;
export const DOOR_W_IN = 10;
export const DOOR_H_IN = 20;

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
        {orderId ? ` · ${orderId}` : ""} · two ~10×20 in doors, left and right
      </p>
      <div
        className="absolute flex"
        style={{
          left: "1in",
          top: "0.85in",
          width: "22in",
          gap: "2in",
        }}
      >
        <p className="w-[10in] text-center font-sans text-[0.22in] font-semibold tracking-[0.16em] text-neutral-800">
          LEFT · ~10×20 in
        </p>
        <p className="w-[10in] text-center font-sans text-[0.22in] font-semibold tracking-[0.16em] text-neutral-800">
          RIGHT · ~10×20 in
        </p>
      </div>
      <div
        className="absolute flex items-stretch"
        style={{
          left: "1in",
          top: "1.35in",
          width: "22in",
          height: "20in",
          gap: "2in",
        }}
      >
        <DoorCell fields={fields} />
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
      className="relative"
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
