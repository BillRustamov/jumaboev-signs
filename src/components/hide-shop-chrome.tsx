"use client";

import { useEffect } from "react";

export function HideShopChrome() {
  useEffect(() => {
    document.body.classList.add("bot-preview");
    return () => document.body.classList.remove("bot-preview");
  }, []);
  return null;
}
