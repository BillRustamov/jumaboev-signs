"use client";

import { useEffect, type ElementType } from "react";
import { uiT, type UiKey } from "@/lib/shop-copy";
import { useShopLang } from "@/lib/shop-lang";

export function Localized({
  k,
  as: Tag = "span",
  className,
  vars,
}: {
  k: UiKey;
  as?: ElementType;
  className?: string;
  vars?: Record<string, string>;
}) {
  const lang = useShopLang();
  return <Tag className={className}>{uiT(lang, k, vars)}</Tag>;
}

export function ShopLangHtml() {
  const lang = useShopLang();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
