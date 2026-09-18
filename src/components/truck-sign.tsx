"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { SignFields } from "@/lib/order";
import { VINYL } from "@/lib/vinyl-spec";
import { SignCanvas } from "@/components/sign-canvas";
import { uiT } from "@/lib/shop-copy";
import { useShopLang } from "@/lib/shop-lang";

export function TruckSign({
  fields,
  className,
  previewBackdrop = true,
  ...props
}: {
  fields: SignFields;
  previewBackdrop?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative aspect-[20/12] w-full select-none", className)}
      {...props}
    >
      <SignCanvas
        fields={fields}
        previewBackdrop={previewBackdrop}
        className="h-full w-full overflow-visible"
      />
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
  const lang = useShopLang();
  return (
    <div className={cn("w-full text-[11px] font-medium tracking-[0.16em] text-neutral-700 sm:text-xs", className)}>
      <div className="mb-2 flex items-center gap-2 px-[6%]">
        <span className="h-px flex-1 bg-neutral-800" />
        <span>{uiT(lang, "inch20")}</span>
        <span className="h-px flex-1 bg-neutral-800" />
      </div>
      <div className="flex items-stretch gap-2">
        <div className="min-w-0 flex-1">
          <TruckSign fields={fields} />
        </div>
        <div className="flex w-6 flex-col items-center justify-between py-1 text-center sm:w-8">
          <span className="w-px flex-1 bg-neutral-800" />
          <span className="py-2 [writing-mode:vertical-rl] rotate-180">
            {uiT(lang, "inch12")}
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
  const lang = useShopLang();
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
          {uiT(lang, "leftDoor")} · {VINYL.size}
        </p>
        <TruckSign fields={fields} />
      </div>
      <div>
        <p className="mb-1.5 text-center text-[10px] font-semibold tracking-[0.14em] text-neutral-600 uppercase">
          {uiT(lang, "rightDoor")} · {VINYL.size}
        </p>
        <TruckSign fields={fields} />
      </div>
    </div>
  );
}
