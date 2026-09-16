"use client";

import { useState, type ReactNode } from "react";
import { TruckSign } from "@/components/truck-sign";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SignFields } from "@/lib/order";
import { cn } from "@/lib/utils";

export function SignPreview({
  fields,
  className,
  signClassName,
  children,
}: {
  fields: SignFields;
  className?: string;
  signClassName?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const name = fields.companyName.trim().toUpperCase() || "Door vinyl";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "block w-full cursor-zoom-in appearance-none rounded-lg border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)]",
          className,
        )}
        aria-label={`Preview ${name}`}
      >
        {children ?? <TruckSign fields={fields} className={signClassName} />}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(92vh,40rem)] max-w-[min(40rem,calc(100%-1.5rem))] overflow-y-auto p-4">
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>
            20 × 12 in filled plaque for each side of the cab.
          </DialogDescription>
          <TruckSign fields={fields} />
        </DialogContent>
      </Dialog>
    </>
  );
}
