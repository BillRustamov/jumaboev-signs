"use client";

import { useCallback, useEffect, useState } from "react";
import type { ShopAccount } from "@/lib/account";
import { writeUsername } from "@/lib/client-session";

export const ACCOUNT_EVENT = "jumaboev-account-change";

async function fetchAccount(): Promise<ShopAccount | null> {
  const response = await fetch("/api/auth/me", {
    cache: "no-store",
    credentials: "same-origin",
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as { user: ShopAccount | null };
  return payload.user ?? null;
}

export function useAccount() {
  const [user, setUser] = useState<ShopAccount | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchAccount();
      setUser(next);
      if (next?.username) writeUsername(next.username);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const onChange = () => {
      void refresh();
    };
    window.addEventListener(ACCOUNT_EVENT, onChange);
    return () => window.removeEventListener(ACCOUNT_EVENT, onChange);
  }, [refresh]);

  return { user, loading, refresh, setUser };
}

export function notifyAccountChanged(): void {
  window.dispatchEvent(new Event(ACCOUNT_EVENT));
}
