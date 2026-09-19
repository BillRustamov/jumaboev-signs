"use client";

import { useSyncExternalStore } from "react";
import { isShopLang, type ShopLang } from "@/lib/shop-entry";

const KEY = "jumaboev-shop-lang";
const EVENT = "jumaboev-shop-lang-change";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

export function readShopLang(): ShopLang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(KEY) ?? "";
  return isShopLang(stored) ? stored : "en";
}

export function writeShopLang(lang: ShopLang): void {
  window.localStorage.setItem(KEY, lang);
  window.dispatchEvent(new Event(EVENT));
}

export function useShopLang(): ShopLang {
  return useSyncExternalStore(subscribe, readShopLang, () => "en");
}
