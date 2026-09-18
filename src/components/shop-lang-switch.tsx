"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LANGS, LANG_LABELS, shopT } from "@/lib/shop-entry";
import { useShopLang, writeShopLang } from "@/lib/shop-lang";

export function ShopLangSwitch({
  variant = "ghost",
  size = "sm",
  compact = false,
}: {
  variant?: "ghost" | "outline" | "secondary";
  size?: "sm" | "lg" | "default";
  compact?: boolean;
}) {
  const lang = useShopLang();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          aria-label={shopT(lang, "language")}
        >
          <Languages className="size-4" />
          {compact ? null : <span>{shopT(lang, "language")}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{shopT(lang, "chooseLanguage")}</DialogTitle>
          <DialogDescription>{LANG_LABELS[lang]}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2">
          {LANGS.map((code) => (
            <Button
              key={code}
              variant={code === lang ? "default" : "outline"}
              className="justify-start"
              onClick={() => {
                writeShopLang(code);
                setOpen(false);
              }}
            >
              {LANG_LABELS[code]}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
